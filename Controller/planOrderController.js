const asyncHandler = require('express-async-handler');
const plandOrderModel = require('../Model/plandOrderModel');
const moment = require('moment'); // Import moment library for date manipulation

exports.postPlandOrder = asyncHandler(async(req,res)=>{
    const { userId, planId, name, amount, duration } = req.body;
    try{
        // Calculate expiry date by adding duration months to the current date
        const expiryDate = moment().add(duration, 'months').toDate();
        
        // Create plan order with expiry date
        await plandOrderModel.create({ userId, planId, name, amount, duration, expiryDate });
        
        res.json({ message: 'User plan selected successfully' });
    } catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// exports.getPlanOrderById = asyncHandler(async(req,res)=>{
//     const {userId} = req.params;
//     // console.log(req.params, 'the request body')
//     try{
//         const response = await plandOrderModel.findById({userId}).populate('planId');
//        console.log(response,'adfjahsdojfhiasdhfio')
//         res.status(200).json(response)
//     }catch(err){
//         console.log(err)
//         res.status(500).message('an error occured while fetching data')
//     }
// })

exports.getPlanOrderByUser = asyncHandler(async (req, res) => {
    const {id:userId}  = req.params; // Correctly extract userId from request params
    console.log(userId, 'the id of the user'); // Log userId for debugging
    try {
      // Find all plan orders of the user
      const userPlanOrders = await plandOrderModel.find({ userId }); // Use find instead of findById
      console.log(userPlanOrders, "the user's plan orders");

      res.json(userPlanOrders);
  } catch (error) {
      console.error('Error fetching user plan orders:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
;
  
