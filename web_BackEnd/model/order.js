const mongoose= require('mongoose');
const  ObjectID  = require('mongodb').ObjectID;
const Schema= mongoose.Schema;
const orderSchema= new Schema({
 
        status:{type:String, 
            default:'pending'},
        date: {type: Date,
        default:Date.now()},
        ProdList:[],
        totalPrice: Number,     
        customer: ObjectID,
        farmer: ObjectID    

})
module.exports= mongoose.model('order', orderSchema);