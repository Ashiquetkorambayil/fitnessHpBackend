const mongoose = require('mongoose');
const planOrderModel = new mongoose.Schema({
    userId:{ type:String},
    planId:{ type:String},
    name:{type:String},
    amount:{type:Number},
    duration:{type:Number},
    selectedAt: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
})

const plandOrderData = mongoose.model("plandOrderData", planOrderModel)
module.exports = plandOrderData