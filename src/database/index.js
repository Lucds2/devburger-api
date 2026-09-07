import Sequelize from "sequelize";
import databaseconfig from '../config/database.cjs';
import User from "../app/models/User.js";
import Product from "../app/models/Product.js";
import Category from "../app/models/Category.js";
import mongoose from "mongoose";

const models = [User, Product, Category];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    // Se existir a variável DATABASE_URL (no Render), usa ela; caso contrário, usa o databaseconfig padrão
    if (process.env.DATABASE_URL) {
      this.connection = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        define: {
          timestamps: true,
          underscored: true,
          underscoredAll: true,
        },
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false, // Necessário para aceitar conexões SSL no Render
          },
        },
      });
    } else {
      this.connection = new Sequelize(databaseconfig);
    }

    models
      .map((model) => model.init(this.connection))
      .map((model) => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongooseConnection = mongoose.connect(
      process.env.MONGO_URL || 'mongodb://localhost:27017/devburger'
    );
  }
}

export default new Database();