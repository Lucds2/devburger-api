import * as Yup from 'yup';
import Category from '../models/Category.js';

class CategoryController {
  async store(request, response){
    const schema = Yup.object({
      name: Yup.string().required()
    });
    
    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (error) {
      return response.status(400).json({ errors: error.errors });
    }

    const { name } = request.body;

    if (!request.file) {
      return response.status(400).json({ error: 'A imagem da categoria é obrigatória.' });
    }

    const urlImage = request.file.path; // URL gerada pelo Cloudinary

    const categoryExists = await Category.findOne({where:{name}});
    if(categoryExists){
        return response.status(400).json({error: "Category already exists"});
    }

    const newCategory = await Category.create({
      name,
      path: urlImage
    });

    return response.status(200).json({ newCategory });
  }

  async update(request, response){
    const schema = Yup.object({
      name: Yup.string()
    });
    
    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (error) {
      return response.status(400).json({ errors: error.errors });
    }

    const { name } = request.body;

    let path;
    if (request.file) {
      path = request.file.path; // URL do Cloudinary no update
    }

    const categoryExists = await Category.findOne({where:{name}});
    if(categoryExists){
        return response.status(400).json({error: "Category already exists"});
    }

    await Category.update({
      name,
      path
    }, {
      where: { id: request.params.id }
    });

    return response.status(200).json({});
  }

  async index(request, response){
    const categories = await Category.findAll();
    return response.status(200).json({ categories });
  }
}

export default new CategoryController();