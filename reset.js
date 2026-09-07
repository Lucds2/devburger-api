import { Sequelize } from 'sequelize';

// Cole a URL externa do Render entre aspas abaixo:
const connection = new Sequelize('postgresql://devburger_user:Eg6w6vIjYpgeA5tfQ5w72FISyXiLU8EX@dpg-dafdbduq1p3s73b9t0q0-a.oregon-postgres.render.com/devburger_i177', {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

async function resetDb() {
  try {
    await connection.authenticate();
    console.log('Conectado ao banco do Render com sucesso!');
    
    // Apaga e recria todas as tabelas limpando os dados antigos
    await connection.sync({ force: true });
    console.log('Banco limpo e tabelas recriadas!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao limpar o banco:', error);
    process.exit(1);
  }
}

resetDb();