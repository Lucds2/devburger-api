import Stripe from 'stripe';
import * as Yup from 'yup';
import dotenv from 'dotenv';
dotenv.config();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const calculateAmount = (itens) => {
    const total = itens.reduce((acc, curr) => {
        return acc + curr.price * curr.quantity;
    }, 0);
    return Math.round(total ) ;
}

class CreatePaymentIntent {
  async store(request, response) {

    const schema = Yup.object({
          products: Yup.array().required().of(
            Yup.object({
              id: Yup.number().required(),
              quantity: Yup.number().required(),
              price: Yup.number().required(),
            }),
          ),
        });

         try {
      await schema.validate(request.body, { abortEarly: false, strict:true });
    } catch (error) {
      return response.status(400).json({ errors: error.errors });
    }

    const { products } = request.body;
    const amount = calculateAmount(products);

    const paymentIntent = await stripe.paymentIntents.create({
       amount,
        currency: 'brl',
        payment_method_types: ['card'],
        
      });

   return response.json({
  clientSecret: paymentIntent.client_secret,
  dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
});

  }

 

};

export default new CreatePaymentIntent();