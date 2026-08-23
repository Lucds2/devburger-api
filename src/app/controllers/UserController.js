
import { v4 } from "uuid";
import User from "../models/User.js";
import * as Yup from "yup";
import bcryptjs from 'bcryptjs';
import bcrypt from 'bcryptjs';




/*
store - criar dado
index - lista todos os dados
show - mostra um dado especifico
update - atualiza um dado
delete - deleta um dado
*/


class UserController {
    async store(request, response){
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            address_user: Yup.string().required(),
            admin: Yup.boolean()
        });

        try {
            await schema.validate(request.body, { abortEarly: false, strict: true });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }
        

    const {name, email, password, address_user, payment_on_delivery, cliente_retira, admin} = request.body;

    const userExists = await User.findOne({where:{email}});
    if(userExists){
        return response.status(400).json({error: "User already exists"});
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({id:v4(), name, email, password_hash, address_user, admin});
    return response.status(201).json({id:user.id, name:user.name, email:user.email, admin:user.admin, address_user:user.address_user, });
}
}

export default new UserController();