const asyncHandler = require('express-async-handler');
const pendingOrderModel = require('../Model/pendingOrders')

exports.postPendingOrder = asyncHandler(async(req,res)=>{
    const { userId, planId, name, amount, duration, userName, modeOfPayment } = req.body;
    console.log(req.body), 'the rusult'
    try{
      
        await pendingOrderModel.create({ userId, planId, name, amount, duration,modeOfPayment, userName});
        
        res.json({ message: 'User plan selected successfully' });
    } catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

exports.getPendingOrder = asyncHandler(async(req,res)=>{
    try{
        const response = await pendingOrderModel.find()
        res.status(200).json(response)
        res.send('the pending order fetched successfully')
    }catch(err){
        console.log(err)
        res.status(500).send('error occured while fetching data')
    }
})