import React from "react";
import { Link } from "react-router-dom";
import CANCELIMAGE from '../assest/cancel.gif'

const Cancel = () => {
    return(
          <div className="bg-slate-200 w-full max-w-md mx-auto flex justify-center items-center flex-col p-4 m-2">
                    <img src={CANCELIMAGE} 
                    width={200}
                    height={200} 
                    
                    alt="cancel" />
                    <p className="text-red-600 font-bold text-2xl m-1">Payment Denied</p>
                    <Link to={"/order"} className="p-2 px-3 mt-4 border-2 border-red-600 rounded-md font-semibold text-red-600 hover:bg-red-600 hover:text-white">Go To Cart</Link>
                </div>
    )
}

export default Cancel