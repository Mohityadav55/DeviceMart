import React from "react";
import { Link } from "react-router-dom";
import SUCCESSIMAGE from '../assest/success.gif'

const Success = () => {
    return(
        <div className="bg-slate-200 w-full max-w-md mx-auto flex justify-center items-center flex-col p-4 m-2">
            <img src={SUCCESSIMAGE} 
            width={150}
            height={150} 
            alt="success" />
            <p className="text-green-600 font-bold text-xl m-1">Payment Successful</p>
            <Link to={"/order"} className="p-2 px-3 mt-5 border-2 border-green-600 rounded-md font-semibold text-green-600 hover:bg-green-600 hover:text-white">Go To Order Page</Link>
        </div>
    )
}

export default Success;