import { Router } from "express";
import UserController from "./app/controllers/UserController.js";
import SessionController from "./app/controllers/SessionController.js";
import ProductsController from "./app/controllers/ProductsController.js";
import multer from "multer";
import multerConfig from "./config/multer.js";
import authmiddlwares from "./app/middlewares/auth.js";
import CategoryController from "./app/controllers/CategoryController.js";
import adminMiddlwares from "./app/middlewares/admin.js";
import OrderController from "./app/controllers/OrderController.js";
import CreatePaymentIntent from "./app/controllers/stripe/CreatePaymentIntent.js";
import Product from './app/models/Product.js';

const routes = new Router();
const upload = multer(multerConfig);


// // Rota temporária para limpar a tabela de produtos
// routes.get('/products/delete-all', async (req, res) => {
//   try {
//     await Product.destroy({ where: {}, truncate: true, cascade: true });
//     return res.status(200).json({ message: 'Todos os produtos foram apagados com sucesso!' });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

// Rotas Públicas
routes.post('/user', UserController.store);
routes.post('/sessions', SessionController.store);
routes.get('/categories', CategoryController.index);
routes.get('/products', ProductsController.index);

// Middleware Global de Autenticação (A partir daqui, exige Token)
routes.use(authmiddlwares);

// Rotas de Usuário Autenticado (Clientes e Admins)
routes.post('/order', OrderController.store); // Sem adminMiddlwares!
 // Sem adminMiddlwares!

// Rotas de Administrador (Exigem Token + Permissão de Admin)
routes.post('/product', adminMiddlwares, upload.single('file'), ProductsController.store);
routes.put('/product/:id', adminMiddlwares, upload.single('file'), ProductsController.update);
routes.get('/order', OrderController.index);
routes.post('/categories', adminMiddlwares, upload.single('file'), CategoryController.store);
routes.put('/categories/:id', adminMiddlwares, upload.single('file'), CategoryController.update);


routes.put('/orders/:id', adminMiddlwares, OrderController.update);

routes.post('/create-payment-intent', CreatePaymentIntent.store);

export default routes;