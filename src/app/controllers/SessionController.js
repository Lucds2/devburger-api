import * as Yup from 'yup';
import User from '../models/User.js';
import bcryptjs from 'bcryptjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth.js';


class SessionController {
  async store(request, response) {

    const schema = Yup.object({
        email: Yup.string().email().required(),
        password: Yup.string().required().min(6),
    });


      const isValid = await schema.isValid(request.body, { strict: true });
  
     if(!isValid){
        return response.status(400).json({ error: "Email or password is invalid" });
     }
     const { email, password } = request.body;

     const userExists = await User.findOne({where:{email}});
    if(!userExists){
        return response.status(400).json({error: "Email or password is invalid"});
    }

    const isPasswordCorrect = await bcrypt.compare(password, userExists.password_hash);
    if(!isPasswordCorrect){
        return response.status(400).json({error: "Email or password is invalid"});
    }

    const token = jwt.sign({ id: userExists.id, admin: userExists.admin, name: userExists.name }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
    });

    return response.status(200).json({ 
        id: userExists.id,
        name: userExists.name,
        email: userExists.email,
        admin: userExists.admin,
        token,    
    });  

  }
};

export default new SessionController();