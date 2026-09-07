import express from 'express';
import routes from './routes.js';
import fileRouteConfig from './config/fileRoutes.cjs';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/product-file', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use('/category-file', express.static(path.resolve(__dirname, '..', 'uploads')));



app.use(routes);


export default app;
