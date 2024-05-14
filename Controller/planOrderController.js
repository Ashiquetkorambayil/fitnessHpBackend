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


exports.getPlanOrderByUser = asyncHandler(async (req, res) => {
    const { id: userId } = req.params;
    console.log(userId, 'the id of the user');
    try {
        const userPlanOrders = await plandOrderModel.find({ userId });

        // Check if any plan orders have expired or are nearly expired and update activeStatus accordingly
        const currentDate = moment();
        for (const planOrder of userPlanOrders) {
            const daysUntilExpiry = moment(planOrder.expiryDate).diff(currentDate, 'days');
            if (daysUntilExpiry <= 0) {
                // If the expiry date has passed, set activeStatus to "Expired"
                planOrder.activeStatus = "Expired";
            } else if (daysUntilExpiry <= 5) {
                // If the plan is within 5 days of expiry, set activeStatus to "Nearly Expire"
                planOrder.activeStatus = "Nearly Expire";
            } else {
                // Otherwise, set activeStatus to "Active"
                planOrder.activeStatus = "Active";
            }
            await planOrder.save(); // Save the updated plan order
        }

        console.log(userPlanOrders, "the user's plan orders");
        
        // Send the user's plan orders with updated activeStatus to the frontend
        res.json(userPlanOrders);
    } catch (error) {
        console.error('Error fetching user plan orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


exports.getLastPlanOrderOfUser = asyncHandler(async (req, res) => {
    const { id: userId } = req.params;
    console.log(userId, 'the id of the user');
    try {
        // Retrieve the last plan order for the user
        const lastPlanOrder = await plandOrderModel.findOne({ userId }).sort({ selectedAt: -1 }).limit(1);

        if (!lastPlanOrder) {
            // If no plan orders found, send an empty response
            res.json([]);
            return;
        }

        // Calculate the active status for the last plan order
        const currentDate = moment();
        const daysUntilExpiry = moment(lastPlanOrder.expiryDate).diff(currentDate, 'days');
        if (daysUntilExpiry <= 0) {
            // If the expiry date has passed, set activeStatus to "Expired"
            lastPlanOrder.activeStatus = "Expired";
        } else if (daysUntilExpiry <= 5) {
            // If the plan is within 5 days of expiry, set activeStatus to "Nearly Expire"
            lastPlanOrder.activeStatus = "Nearly Expire";
        } else {
            // Otherwise, set activeStatus to "Active"
            lastPlanOrder.activeStatus = "Active";
        }

        console.log(lastPlanOrder, "the user's last plan order");
        
        // Send the last plan order with updated activeStatus to the frontend
        res.json(lastPlanOrder);
    } catch (error) {
        console.error('Error fetching user last plan order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


exports.getPlanDetailsById = asyncHandler(async(req,res)=>{
    const {id} = req.params
    console.log(req.params,'haihfoiashdfoiasiodfhioasdhpfio')
    try{
        const response = await plandOrderModel.findById(id)
        res.status(200).json(response)
    }catch(err){
        console.log(err)
        res.status(500).message('an error occured while fetching data')
    }
})

