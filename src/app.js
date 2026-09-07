import express from 'express';
import path from 'path';
import routes from './routes.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Aponta com precisão para a pasta 'uploads' na raiz do projeto
const uploadsPath = path.resolve(process.cwd(), 'uploads');

app.use('/category-file', express.static(uploadsPath));
app.use('/product-file', express.static(uploadsPath));

app.use(routes);

export default app;