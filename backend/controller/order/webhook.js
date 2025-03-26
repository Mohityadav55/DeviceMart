const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const addToCartModel = require('../../models/cartProduct');
const orderModel = require('../../models/orderProductModel');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;


async function getLineItems(lineItems) {
    let ProductItems = [];

    if(lineItems?.data?.length ){
        for(const item of lineItems.data){
            const product = await stripe.products.retrieve(item.price.product);
            
            const productId = product.metadata.productId;

            const productData = {
                productId : productId,
                name : product.name,
                price: item.price.unit_amount / 100,
                quantity : item.quantity,
                image : product.images
            }
            ProductItems.push(productData);

        }
    }

    return ProductItems;
}


const webhooks = async (req,res) => {
    const sig = req.headers['stripe-signature'];
    const payloadString = JSON.stringify(req.body);

    

    const header = stripe.webhooks.generateTestHeaderString({
        payload : payloadString,
        secret : endpointSecret,
    });
    

    let event;

    
    try {
        // Verify the event
        const event = stripe.webhooks.constructEvent(payloadString, header, endpointSecret);
        // console.log('Event:', event);        

        // Handle event types
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                // console.log('Session:', session);
                

                // Fetch line items
                const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

                const productDetails = await getLineItems(lineItems);

                // console.log('Product Details:', productDetails);
                
                const orderDetails = {
                    productDetails: productDetails,
                    email: session.customer_email,
                    userId: session.metadata.userId,
                    paymentDetails: {
                        paymentId:  session.payment_intent,
                        payment_method_type: session.payment_method_types,
                        payment_status: session.payment_status
                    },
                    shipping_options: session.shipping_options.map( s => {
                        return{ ...s, shipping_amount : s.shipping_amount / 100}
                    }),
                    totalAmount: session.amount_total / 100,
                }
                

                const order = new orderModel(orderDetails)

                const saveOrder = await order.save()
                console.log('Order Saved:', saveOrder);
                
                if (saveOrder?._id) {
                    const deleteCartProduct = await addToCartModel.deleteMany({userId: session.metadata.userId})
                }

                // console.log('Cart Deleted:', deleteCartProduct);

                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.status(200).send('Webhook received');
    } catch (error) {
        console.error('Webhook Error:', error.message);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
};


module.exports = webhooks;




