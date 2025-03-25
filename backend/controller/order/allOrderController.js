const orderModel = require("../../models/orderProductModel");
const userModel = require("../../models/userModel");

const allOrderController = async(req,res) => {
    const userId = req.userId

    try{
        const  user = await userModel.findById(userId);

        if (user.role !== 'ADMIN') {
            return res.json({
                message: "no access"
            })
        }

        const AllOrder = await orderModel.find().sort({createdAt: -1})
        return res.status(200).json({
            data: AllOrder,
            success: true,
        })

    }catch(err){
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}

module.exports = allOrderController