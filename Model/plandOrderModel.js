const mongoose = require('mongoose');
const planOrderModel = new mongoose.Schema({
    userId: { type: String },
    userName: { type: String },
    modeOfPayment: { type: String },
    planId: { type: String },
    name: { type: String },
    amount: { type: Number },
    duration: { type: Number },
    selectedAt: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    activeStatus: { type: String, enum: ["Active", "Expired", "Nearly Expire"], default: "Active" },
});

const plandOrderData = mongoose.model("plandOrderData", planOrderModel)
module.exports = plandOrderData