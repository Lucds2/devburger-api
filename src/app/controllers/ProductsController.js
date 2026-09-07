import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

class ProductsController {
  async store(request, response){
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.mixed().required(),
      category_id: Yup.mixed().required(),
      offer: Yup.mixed().required()
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (error) {
      return response.status(400).json({ errors: error.errors });
    }

    const { name, price, category_id, offer } = request.body;
    
    if (!request.file) {
      return response.status(400).json({ error: 'A imagem do produto é obrigatória.' });
    }

    // O Cloudinary disponibiliza a URL pública direto em request.file.path
    const urlImage = request.file.path;

    const newProduct = await Product.create({
      name,
      price: Number(price),
      category_id: Number(category_id),
      offer: offer === 'true' || offer === true,
      path: urlImage // Salva a URL completa do Cloudinary no banco
    });

    return response.status(201).json(newProduct);
  }

  async update(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (error) {
      return response.status(400).json({ errors: error.errors });
    }

    const { name, price, category_id, offer } = request.body;
    const { id } = request.params;

    let path;
    if (request.file) {
      path = request.file.path; // Pega a nova URL do Cloudinary se houver upload
    }

    await Product.update(
      {
        name,
        price,
        category_id,
        offer,
        path, 
      },
      {
        where: { id },
      }
    );

    return response.status(200).json({ message: 'Product updated successfully' });
  }

  async index(request, response){
    const products = await Product.findAll({
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name'],
            },
        ],
    });
    return response.status(200).json({ products });
  }
}

export default new ProductsController();