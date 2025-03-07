import SummaryApi from "../common"
import { toast } from 'react-toastify'

const addToCart = async(e,id) =>{
    e?.stopPropagation()
    e?.preventDefault()

    try{

        const response = await fetch(SummaryApi.addToCartProduct.url,{
            method : SummaryApi.addToCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                { productId : id }
            )
        })

        const responseData = await response.json()
        console.log("Add to Cart Response:", responseData); // Debugging

        if(responseData.success){
            toast.success(responseData.message)
        }

        if(responseData.error){
            toast.error(responseData.message)
        }


        return responseData

    }catch (error) {
        console.error("Add to Cart Error:", error);
        toast.error("Something went wrong. Please try again.");
    }

    

}


export default addToCart





// const response = await fetch(SummaryApi.addToCartProduct.url,{
    //     method : SummaryApi.addToCartProduct.method,
    //     credentials : 'include',
    //     headers : {
    //         "content-type" : 'application/json'
    //     },
    //     body : JSON.stringify(
    //         { productId : id }
    //     )
    // })

    // const responseData = await response.json()
    // console.log("Add to Cart Response:", responseData); // Debugging

    // if(responseData.success){
    //     toast.success(responseData.message)
    // }

    // if(responseData.error){
    //     toast.error(responseData.message)
    // }


    // return responseData




    // import SummaryApi from "../common";
    // import { toast } from "react-toastify";
    
    // const addToCart = async (e, id, cartItems = [], setCartItems, fetchUserAddToCart) => {
    //     e?.stopPropagation();
    //     e?.preventDefault();
    
    //     // ✅ Ensure `cartItems` is always an array before checking `.some()`
    //     if (!Array.isArray(cartItems)) {
    //         console.error("cartItems is not an array:", cartItems);
    //         return;
    //     }
    
    //     // ✅ Prevent duplicate checks with safe handling
    //     if (cartItems.some(item => item.productId === id)) {
    //         toast.error("Selected item is already in cart");
    //         return;
    //     }
    
    //     try {
    //         const response = await fetch(SummaryApi.addToCartProduct.url, {
    //             method: SummaryApi.addToCartProduct.method,
    //             credentials: "include",
    //             headers: { "content-type": "application/json" },
    //             body: JSON.stringify({ productId: id }),
    //         });
    
    //         const responseData = await response.json();
    //         console.log("Add to Cart Response:", responseData);
    
    //         if (responseData.success) {
    //             toast.success(responseData.message);
    
    //             // ✅ Update UI immediately
    //             setCartItems(prevCart => [...prevCart, { productId: id, quantity: 1 }]);
    
    //             fetchUserAddToCart(); // ✅ Refetch cart items for accuracy
    //         } else {
    //             toast.error(responseData.message);
    //         }
    //     } catch (error) {
    //         console.error("Add to Cart Error:", error);
    //         toast.error("Something went wrong. Please try again.");
    //     }
    // };
    
    // export default addToCart;
    
