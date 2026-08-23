import * as Yup from 'yup';
import Products from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../schemas/Order.js';

class OrderController {
  async store(request, response) {
    const schema = Yup.object({
      products: Yup.array().required().of(
        Yup.object({
          id: Yup.number().required(),
          quantity: Yup.number().required(),
        }),
      ),
    });

    try {
      await schema.validate(request.body, { abortEarly: false, strict: true });
    } catch (error) {
      return response.status(400).json({ errors: error.errors });
    }

    const { userId, userName } = request;
    const { products, deliveryFee = 0 } = request.body; // Pega a taxa de entrega enviada pelo front

    const productsIds = products.map((product) => product.id);
    const findedProducts = await Products.findAll({
      where: {
        id: productsIds,
      },
      include: { model: Category, as: 'category', attributes: ['name'] },
    });

    const mapedProducts = findedProducts.map((product) => {
      const quantity = products.find((p) => p.id === product.id).quantity;
      const newProduct = {
        id: product.id,
        name: product.name,
        price: Number(product.price) / 100, // Converte para número e divide por 100 (500 vira 5.00)
        Category: product.category.name,
        quantity,
        url: product.url,
      };
      return newProduct;
    });

    // Calcula o valor total dos produtos
    const productsTotal = mapedProducts.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    // Soma os produtos + a taxa de entrega (ex: 5.00 + 5.00 = 10.00)
    const finalOrderTotal = productsTotal + deliveryFee;

    const order = {
      user: {
        id: userId,
        name: userName,
        products: mapedProducts,
        total: finalOrderTotal, // Salva o total correto aqui
        status: 'Pedido Realizado',
        paymentMethod: true,
        retCliente: true,
      },
      products: mapedProducts,
      deliveryFee,
      total: finalOrderTotal, // Salva o total correto na raiz do documento
      status: 'Pedido Realizado',
    };

    const newOrder = await Order.create(order);

    return response.status(201).json(newOrder);
  }

  async update(request, response) {
    const schema = Yup.object({
      status: Yup.string().required(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false, strict: true });
    } catch (error) {
      return response.status(400).json({ errors: error.errors });
    }

    const { status } = request.body;
    const { id } = request.params;

    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { 
          status, 
          'user.status': status 
        },
        { new: true }
      );

      if (!updatedOrder) {
        return response.status(404).json({ message: 'Order not found' });
      }

      return response.status(200).json(updatedOrder);
    } catch (err) {
      return response.status(400).json({ message: err.message });
    }
  }

  async index(request, response) {
    try {
      const orders = await Order.find();
      return response.status(200).json(orders);
    } catch (err) {
      return response.status(500).json({ message: err.message });
    }
  }
}

export default new OrderController();