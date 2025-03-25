// const url = `https://api.cloudinary.com/v1_1/defwhvzw6/image/upload`

// const uploadImage  = async(image) => {
//     const formData = new FormData()
//     formData.append("file",image)
//     formData.append("upload_preset","mern_product")
    

//     const dataResponse = await fetch(url,{
//         method : "post",
//         body : formData
//     })

//     console.log("dataResponse",dataResponse);
    

//     return dataResponse.json()

// }


// export default uploadImage 
// console.log(process.env.REACT_APP_CLOUDINARY_URL);
// console.log(process.env.REACT_APP_CLOUD_NAME);


const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "mern_product");
    
    console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);

    console.log("Cloudinary URL:", process.env.REACT_APP_CLOUDINARY_URL);
    console.log("Cloud Name:", process.env.REACT_APP_CLOUD_NAME);
    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        console.log("Cloudinary Upload Response:", response);
        

        const data = await response.json();
        // console.log("Cloudinary Upload Response:", data);

        if (response.ok && data.secure_url) {
            // console.log(" Image uploaded successfully:", data.secure_url);
            return { success: true, url: data.secure_url };  //  Use `secure_url`
        } else {
            console.error(" Upload failed:", data.error || "Unknown error");
            return { success: false, error: data.error?.message || "Upload failed" };
        }
    } catch (error) {
        console.error(" Upload error:", error);
        return { success: false, error: "Network error. Please try again." };
    }
};

export default uploadImage;


