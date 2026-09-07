import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes.js';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Aponta para a pasta 'uploads' na raiz do projeto (1 nível acima de src/)
const uploadsFolder = path.resolve(__dirname, '..', 'uploads');

app.use('/category-file', express.static(uploadsFolder));
app.use('/product-file', express.static(uploadsFolder));

app.use(routes);

export default app;