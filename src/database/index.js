import  Sequelize  from "sequelize";
import databaseconfig from '../config/database.cjs'
import User from "../app/models/User.js";
import Product from "../app/models/Product.js";
import Category from "../app/models/Category.js";
import mongoose from "mongoose";

const models = [User, Product, Category];

class Database {
    constructor(){
this.init();
this.mongo();

    }

    init(){
        this.connection = new Sequelize(databaseconfig);
        models.map((models)=> models.init(this.connection)).map((models)=> models.associate && models.associate(this.connection.models));
    }

    mongo(){
        this.mongooseConnection = mongoose.connect('mongodb://localhost:27017/devburger',);
    }
}


export default new Database();