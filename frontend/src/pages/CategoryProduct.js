// import React, { useCallback, useEffect, useState } from 'react'
// import { useLocation, useNavigate, useParams } from 'react-router-dom'
// import productCategory from '../helpers/productCategory'
// import VerticalCard from '../components/VerticalCard'
// import SummaryApi from '../common'


// const CategoryProduct = () => {
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();
//     const urlSearch = new URLSearchParams(location.search);
//     const urlCategoryListinArray = urlSearch.getAll("category");

//     const urlCategoryListObject = {};
//     urlCategoryListinArray.forEach(el => {
//         urlCategoryListObject[el] = true;
//     });

//     const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
//     const [filterCategoryList, setFilterCategoryList] = useState([]);
//     const [sortBy, setSortBy] = useState("");

//     //  Memoized fetchData using useCallback to prevent infinite re-renders
//     const fetchData = useCallback(async () => {
//         setLoading(true);
//         try {
//             const response = await fetch(SummaryApi.filterProduct.url, {
//                 method: SummaryApi.filterProduct.method,
//                 headers: {
//                     "content-type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     category: filterCategoryList
//                 })
//             });

//             const dataResponse = await response.json();
//             let products = dataResponse?.data || [];

//             // Sorting applied after fetching the data, using a copy of the array
//             if (sortBy === 'asc') {
//                 products = [...products].sort((a, b) => a.sellingPrice - b.sellingPrice);
//             }
//             if (sortBy === 'dsc') {
//                 products = [...products].sort((a, b) => b.sellingPrice - a.sellingPrice);
//             }

//             setData(products);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         } finally {
//             setLoading(false);
//         }
//     }, [filterCategoryList, sortBy]); // Proper dependencies set

//     // Handle Category Selection
//     const handleSelectCategory = (e) => {
//         const { value, checked } = e.target;
//         setSelectCategory((prev) => ({
//             ...prev,
//             [value]: checked
//         }));
//     };

//     //  Optimized category list update & URL query update
//     useEffect(() => {
//         const arrayOfCategory = Object.keys(selectCategory)
//             .filter(categoryKey => selectCategory[categoryKey]);

//         setFilterCategoryList(arrayOfCategory);

//         //  Proper URL formatting for multiple categories
//         const urlFormat = arrayOfCategory.map(el => `category=${el}`).join("&");
//         navigate(`/product-category?${urlFormat}`);
//     }, [selectCategory, navigate]);

//     //  Fetch data when filters or sort order changes
//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     return (
//         <div className='container mx-auto p-4'>

//             {/***desktop version */}
//             <div className='hidden lg:grid grid-cols-[200px,1fr]'>
//                 {/***left side */}
//                 <div className='bg-white p-2 min-h-[calc(100vh-120px)] overflow-y-scroll'>
//                     {/**sort by */}
//                     <div className=''>
//                         <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by</h3>

//                         <form className='text-sm flex flex-col gap-2 py-2'>
//                             <div className='flex items-center gap-3'>
//                                 <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={(e) => setSortBy(e.target.value)} value={"asc"} />
//                                 <label>Price - Low to High</label>
//                             </div>

//                             <div className='flex items-center gap-3'>
//                                 <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={(e) => setSortBy(e.target.value)} value={"dsc"} />
//                                 <label>Price - High to Low</label>
//                             </div>
//                         </form>
//                     </div>

//                     {/**filter by */}
//                     <div className=''>
//                         <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Category</h3>

//                         <form className='text-sm flex flex-col gap-2 py-2'>
//                             {
//                                 productCategory.map((categoryName, index) => {
//                                     return (
//                                         <div key={index} className='flex items-center gap-3'>
//                                             <input type='checkbox' name={"category"} checked={selectCategory[categoryName?.value]} value={categoryName?.value} id={categoryName?.value} onChange={handleSelectCategory} />
//                                             <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
//                                         </div>
//                                     )
//                                 })
//                             }
//                         </form>
//                     </div>
//                 </div>

//                 {/***right side ( product ) */}
//                 <div className='px-4'>
//                     <p className='font-medium text-slate-800 text-lg my-2'>Search Results : {data.length}</p>

//                     <div className='min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)]'>
//                         {
//                             loading ? <p>Loading...</p> : //  UPDATED CODE: Added Loading state UI
//                                 (data.length !== 0 ? <VerticalCard data={data} loading={loading} /> : <p>No products found.</p>)
//                         }
//                     </div>
//                 </div>
//             </div>

//         </div>
//     )
// }

// export default CategoryProduct;



import { useState, useEffect, useCallback } from "react";
import productCategory from '../helpers/productCategory';
import { useNavigate, useLocation } from "react-router-dom";
import SummaryApi from "../common";
import VerticalCard from "../components/VerticalCard"; // Assuming you use this for rendering products

const CategoryProduct = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const urlSearch = new URLSearchParams(location.search);
    const urlCategoryListinArray = urlSearch.getAll("category");

    const urlCategoryListObject = {};
    urlCategoryListinArray.forEach(el => {
        urlCategoryListObject[el] = true;
    });

    const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
    const [filterCategoryList, setFilterCategoryList] = useState([]);
    const [sortBy, setSortBy] = useState("");

    // Ensure fetchData is only called when filterCategoryList is ready
    const fetchData = useCallback(async () => {
        if (filterCategoryList.length === 0) return; // Prevent fetching on empty category list

        setLoading(true);
        try {
            // console.log("Fetching data for categories:", filterCategoryList);

            const response = await fetch(SummaryApi.filterProduct.url, {
                method: SummaryApi.filterProduct.method,
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ category: filterCategoryList })
            });

            const dataResponse = await response.json();
            let products = dataResponse?.data || [];

            // console.log("API Response:", products);

            if (sortBy === 'asc') {
                products = [...products].sort((a, b) => a.sellingPrice - b.sellingPrice);
            }
            if (sortBy === 'dsc') {
                products = [...products].sort((a, b) => b.sellingPrice - a.sellingPrice);
            }

            setData(products);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [filterCategoryList, sortBy]);

    // Handle Category Selection
const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setSelectCategory((prev) => ({
        ...prev,
        [value]: checked
    }));
};


    // ✅ Update filter category list before calling fetchData
    useEffect(() => {
        const arrayOfCategory = Object.keys(selectCategory).filter(key => selectCategory[key]);
        setFilterCategoryList(arrayOfCategory);

        const urlFormat = arrayOfCategory.map(el => `category=${el}`).join("&");
        navigate(`/product-category?${urlFormat}`);
    }, [selectCategory, navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className='container mx-auto p-4'>
            <div className='hidden lg:grid grid-cols-[200px,1fr]'>
                <div className='bg-white p-2 min-h-[calc(100vh-120px)] overflow-y-scroll'>
                    <div>
                        <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by</h3>
                        <form className='text-sm flex flex-col gap-2 py-2'>
                            <div className='flex items-center gap-3'>
                                <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={(e) => setSortBy(e.target.value)} value={"asc"} />
                                <label>Price - Low to High</label>
                            </div>
                            <div className='flex items-center gap-3'>
                                <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={(e) => setSortBy(e.target.value)} value={"dsc"} />
                                <label>Price - High to Low</label>
                            </div>
                        </form>
                    </div>

                    <div>
                        <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Category</h3>
                        <form className='text-sm flex flex-col gap-2 py-2'>
                            {productCategory.map((categoryName, index) => (
                                <div key={index} className='flex items-center gap-3'>
                                    <input type='checkbox' name={"category"} checked={selectCategory[categoryName?.value]} value={categoryName?.value} id={categoryName?.value} onChange={handleSelectCategory} />
                                    <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
                                </div>
                            ))}
                        </form>
                    </div>
                </div>

                <div className='px-4'>
                    <p className='font-medium text-slate-800 text-lg my-2'>Search Results: {data.length}</p>
                    <div className='min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)]'>
                        {loading ? <p>Loading...</p> : (data.length !== 0 ? <VerticalCard data={data} loading={loading} /> : <p>No products found.</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryProduct;
