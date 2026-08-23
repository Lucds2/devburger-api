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
    const {filename} = request.file;

    const categoryExists = await Category.findOne({where:{name}});
    if(categoryExists){
        return response.status(400).json({error: "Category already exists"});
    }

   

    const newCategory = await Category.create({
      name,
      path: filename
    });


    return response.status(200).json({ newCategory});
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
      const {filename} = request.file;
      path = filename;
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