// import React from 'react'

// const Footer = () => {
//   return (
//     <footer className='bg-slate-200  bottom-0 w-full'>
//       <div className='container mx-auto p-4'>
//        <p className='text-center font-bold' >DeviceMart</p>
//       </div>
//     </footer>
//   )
// }

// export default Footer

import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  
  // Apply absolute positioning only on the login page
  const footerClass = location.pathname === "/login " 
    ? "absolute bottom-0 w-full bg-slate-200"
    : "bg-slate-200";

  return (
    <footer className={footerClass}>
      <div className="container mx-auto p-4">
        <p className="text-center font-bold">DeviceMart</p>
      </div>
    </footer>
  );
};

export default Footer;
