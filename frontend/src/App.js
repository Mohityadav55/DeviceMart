import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {
  const dispatch = useDispatch()
  const [cartProductCount,setCartProductCount] = useState(0)

  const fetchUserDetails = async()=>{
      const dataResponse = await fetch(SummaryApi.current_user.url,{
        method : SummaryApi.current_user.method,
        credentials : 'include'
      })

      const dataApi = await dataResponse.json()

      if(dataApi.success){
        dispatch(setUserDetails(dataApi.data))
      }
  }

  const fetchUserAddToCart = async()=>{
    const dataResponse = await fetch(SummaryApi.addToCartProductCount.url,{
      method : SummaryApi.addToCartProductCount.method,
      credentials : 'include'
    })

    const dataApi = await dataResponse.json()

    setCartProductCount(dataApi?.data?.count)
  }

  useEffect(()=>{
    /**user Details */
    fetchUserDetails()
    /**user Details cart product */
    fetchUserAddToCart()

  },[])
  return (
    <>
      <Context.Provider value={{
          fetchUserDetails, // user detail fetch 
          cartProductCount, // current user add to cart product count,
          fetchUserAddToCart
      }}>
        <ToastContainer position='top-center' />
        <div className="flex flex-col min-h-screen">
          <Header/>
          <main className='min-h-[calc(100vh-120px)] flex-grow pt-16'>
           <Outlet/>
          </main>
          <Footer/>
        </div>
        {/* <Header/>
        <main className='min-h-[calc(100vh-120px)] pt-16'>
          <Outlet/>
        </main>
        <Footer/> */}
      </Context.Provider>
    </>
  );
}

export default App;


// import './App.css';
// import { Outlet } from 'react-router-dom';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useEffect, useState } from 'react';
// import SummaryApi from './common';
// import Context from './context';
// import { useDispatch } from 'react-redux';
// import { setUserDetails } from './store/userSlice';

// function App() {
//   const dispatch = useDispatch();
//   const [cartProductCount, setCartProductCount] = useState(0);
//   const [cartItems, setCartItems] = useState([]); // Default to an empty array


//   // Fetch user details
//   const fetchUserDetails = async () => {
//     const dataResponse = await fetch(SummaryApi.current_user.url, {
//       method: SummaryApi.current_user.method,
//       credentials: 'include'
//     });

//     const dataApi = await dataResponse.json();

//     if (dataApi.success) {
//       dispatch(setUserDetails(dataApi.data));
//     }
//   };

//   //  Fetch cart items
//   const fetchUserAddToCart = async () => {
//     try {
//       const dataResponse = await fetch(SummaryApi.addToCartProductView.url, {
//         method: SummaryApi.addToCartProductView.method,
//         credentials: 'include'
//       });

//       const dataApi = await dataResponse.json();

//       if (dataApi.success) {
//         setCartItems(dataApi.data || []); //  Always ensure cartItems is an array
//         setCartProductCount(dataApi.data.length); //  Update count
//       }
//     } catch (error) {
//       console.error("Error fetching cart items:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUserDetails(); //  Fetch user details on load
//     fetchUserAddToCart(); //  Fetch cart items on load
//   }, []);

//   return (
//     <>
//       <Context.Provider value={{
//           fetchUserDetails, 
//           cartProductCount, 
//           fetchUserAddToCart,
//           cartItems, //  Provide cartItems in context
//           setCartItems //  Allow updates to cartItems
//       }}>
//         <ToastContainer position='top-center' />
//         <Header />
//         <main className='min-h-[calc(100vh-120px)] pt-16'>
//           <Outlet />
//         </main>
//         <Footer />
//       </Context.Provider>
//     </>
//   );
// }

// export default App;
