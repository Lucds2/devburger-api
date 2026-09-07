import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

class ProductsController {
 async store(request, response){
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean().required()
    });

    // Como o FormData envia tudo como string, convertemos antes de validar
    const bodyData = {
      ...request.body,
      price: Number(request.body.price),
      category_id: Number(request.body.category_id),
      offer: request.body.offer === 'true' || request.body.offer === true
    };

    try {
      await schema.validate(bodyData, { abortEarly: false });
    } catch (error) {
      return response.status(400).json({ errors: error.errors });
    }

    const { name, price, category_id, offer } = bodyData;
    
    console.log('REQUEST FILE:', request.file);

    if (!request.file) {
      return response.status(400).json({ error: 'A imagem do produto é obrigatória.' });
    }

    const urlImage = request.file.path || request.file.secure_url;

    if (!urlImage) {
      return response.status(500).json({ error: 'Erro ao obter a URL da imagem do Cloudinary.' });
    }

    try {
      const newProduct = await Product.create({
        name,
        price,
        category_id,
        offer,
        path: urlImage
      });

      const productResponse = newProduct.toJSON();
      productResponse.url = urlImage.startsWith('http') 
        ? urlImage 
        : `${request.protocol}://${request.get('host')}/product-file/${urlImage}`;

      return response.status(201).json(productResponse);
    } catch (dbError) {
      console.error('ERRO NO SQL DO CREATE:', dbError);
      return response.status(500).json({ error: dbError.message });
    }
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
      path = request.file.path;
    }

    await Product.update(
      {
        name,
        price,
        category_id,
        offer,
        ...(path && { path }), 
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

    const formattedProducts = products.map(product => {
      const prod = product.toJSON();
      // Se o path já for uma URL do Cloudinary, a propriedade url recebe ele diretamente
      prod.url = prod.path.startsWith('http') 
        ? prod.path 
        : `${request.protocol}://${request.get('host')}/product-file/${prod.path}`;
      return prod;
    });

    return response.status(200).json(formattedProducts);
  }
}

export default new ProductsController();