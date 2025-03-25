// const { default: SummaryApi } = require("../common")

// const fetchCategoryWiseProduct = async(category)=>{
//     const response = await fetch(SummaryApi.categoryWiseProduct.url,{
//         method : SummaryApi.categoryWiseProduct.method,
//         headers : {
//             "content-type" : "application/json"
//         },
//         body : JSON.stringify({
//             category : category
//         })
//     })

//     const dataResponse = await response.json()

//     return dataResponse
// }

// export default fetchCategoryWiseProduct




const { default: SummaryApi } = require("../common");

const fetchCategoryWiseProduct = async (category) => {
    try {
        console.log("Fetching products for category:", category);

        const response = await fetch(`${SummaryApi.categoryWiseProduct.url}?_=${new Date().getTime()}`, { // Added timestamp to avoid caching
            method: SummaryApi.categoryWiseProduct.method,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ category })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const dataResponse = await response.json();
        console.log("API Response:", dataResponse);
        
        return dataResponse;
    } catch (error) {
        console.error("Error fetching category-wise products:", error);
        return { data: [] }; // Return empty array on failure
    }
};

export default fetchCategoryWiseProduct;
