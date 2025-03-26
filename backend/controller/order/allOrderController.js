
const orderModel = require("../../models/orderProductModel");
const userModel = require("../../models/userModel");

const allOrderController = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }


        let orders;
        if (user.role.toUpperCase() === "ADMIN") {
            //  Ensure Admin Fetches ALL Orders
            orders = await orderModel.find().sort({ createdAt: -1 });
            console.log("Admin Fetching All Orders:", orders.length);
        } else {
            //  General user sees only their orders
            orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
            console.log("User Fetching Their Orders:", orders.length);
        }

        return res.status(200).json({
            data: orders,
            success: true,
        });

    } catch (err) {
        console.error("Error Fetching Orders:", err);
        res.status(500).json({
            message: err.message || "Server error",
            error: true,
            success: false,
        });
    }
};

module.exports = allOrderController;




// const allOrderController = async(req,res) => {
//     const userId = req.userId

//     try{
//         const  user = await userModel.findById(userId);

//         if (user.role.toUpperCase() !== 'ADMIN') {
//             return res.json({
//                 message: "no access"
//             })
//         }

//         const AllOrder = await orderModel.find().sort({createdAt: -1})
//         return res.status(200).json({
//             data: AllOrder,
//             success: true,
//         })

//     }catch(err){
//         res.status(500).json({
//             message : err.message || err  ,
//             error : true,
//             success : false,
//         })
//     }
// }

// module.exports = allOrderController;
