const express = require('express');
const ObjectId = require('mongodb').ObjectID;
const jwt =require('jsonwebtoken');
const dotenv = require("dotenv"); 
const Farmer = require('../model/model.farmers');
const Customer =require('../model/model.customers');
const Order = require('../model/order');
const nodemailer = require("nodemailer");
const {Storage} = require('@google-cloud/storage');
const path = require('path');

/*===== Dot Enveit is a global object, so I can get/call it from any where.
 used to secure our token & Other secret data like Password =========*/
dotenv.config(); 

  /* New Farmer sign Up send Farmer information to database  */
   exports.farmSignup= async (req,res,next)=>{
    const {farmName, email, password} = req.body;
    let farmer = await Farmer.findOne({email:email});
    // if(req.body.password <= 6){
    // rres.json({status:'error', msg: 'you need to have more then 6 char'}) 
    // }
    if(farmer){

    /*========Find by Email if there exist ========*/
       res.json({status:'error', msg: 'farmer is already exist'}) 
    }
    else{
    /*========reate New Farmer/Regstration ========*/  
     await Farmer.create({  
        farmName:farmName, 
          email:email, 
          password:password,
          
        })    
     res.status(201).json({status: true, msg:"New Farmer Added"})
     console.log(farmer, 'when new farmer registered')
    }
    
}


 /*========Authenticated Farmer Can login if email & password match========*/
   exports.farmLogin= async(req,res,next)=>{
    const {email, password} = req.body;
    if(!email || !password){
       return res.json({status:'error', msg:'please enter valid email or password'}) 
    }
     let farmer = await Farmer.findOne({email:email})
     if(!farmer){
        return res.json({status:'error', msg:'invalid credential'}) 
     }
  /*====== Generate Token for the logged in Farmer & Start useing JWT to get Token  =======*/// 
 let token = await jwt.sign({id:farmer._id}, process.env.ACCESS_TOKEN_SECRET)
 res.status(200).json({success:true, token: token})
}

/*========= Logged in Farmer Can Add Products  ========*/
exports.addProducts= async (req, res, next) => {

console.log('From addProduct BackEnd', req.file)
console.log("from add id", req.farmer._id)
    try {
      const authKey = path.join(__dirname, '../BacketKey/authKey.json');
      const storage = new Storage({
        projectId : 'feresh-corner-amele-miu',
        keyFilename : authKey,
      })
      const bucket = storage.bucket('e-market');
      const imageName = Date.now() + req.file.originalname //=======If in case there exist image with the same name, I can  identifay it by Date()====//

      const file = bucket.file(imageName);
      const stream = file.createWriteStream({
        metadata:{
          contentType: req.file.mimetype
        }
      })

/*=======Push Image to bucket and the rest data to database =======*/
      console.log(authKey);
      const imgUrl = `https://storage.cloud.google.com/e-market/${imageName}`
      stream.end(req.file.buffer);
      stream.on('finish', async ()=>{

      console.log("inside try", req.body);
  let  farmer=   await Farmer.updateOne({_id: req.farmer._id},
   {$push:
   {products:{
          farmName: req.body.farmName,
          prodName: req.body.prodName, 
           price:req.body.price, 
           image:imgUrl,
           prodInfo :req.body.prodInfo ,
     }
}})
  console.log("from add", farmer)    
   
  res.status(201).json({ success: true, msg: "New Product Successfully Created" });
      })
      stream.on('error', (error)=>{
        console.log(error.message);
        res.json({success: false, error:error.message})
      })
   
      } catch (error) {
        res.status(401).json({ success: false, msg: error.message });
      }
  };

  /*==========  ====== Retrieve  or get all Products Lists from database by using farmers Id ====== ========== */
  exports.getAllProducts = async(req,res,next) =>{  

    try {
        let farmer = await Farmer.findOne({_id: req.farmer._id});
        console.log( "this is from add prod",farmer)
     
         res.status(200).json({ success: true, data: farmer.products });
     
    } catch (err) {
        res.status(404).send(err);
    }
 }
 /*========= Update the products in The farmer   ============*/
 /*========= To update the product first we need to find the specific famer ==========*/
 exports.updateProducts= async (req, res, next) => {
   console.log("This is From update backEnd", req. body)
   console.log("This is From update req.farmer id ",req.farmer._id)
   console.log("This is From update req.params.product ", req.params.products_id)
    try {
     let result =  await Farmer.updateOne({_id: req.farmer._id, 'products._id': req.params.products_id }, 
      { $set: {"products.$": req.body} });

      console.log(result);
      res.status(201).json({ success: true, msg: "Successfully Updated" });
    } catch (error) {
      res.status(404).json({ success: false, msg: error.message });
    }
  };

/*======== Delete single products from farmers products list by using products id   ============*/
exports. deleteProducts = async (req, res, next) => {
  try {
  
    let deletePro = await Farmer.findOne({_id : req.farmer._id})
    console.log('from farmer delete ',deletePro);
    deletePro.products.pull({_id:req.params.products_id})
     await deletePro.save()
    console.log("This is from delete")
    res.status(202).json({ success: true, msg: "Successfully Removed" });
  } catch (error) {
    res.status(404).json({ success: false, msg: error.message });
  }
}
 /*============= Farmer Can get all Oreders by using Orders id ============**/
exports.getOrders = async (req,res)=>{

  console.log( req.farmer._id); 
    try {
      console.log('this is from get order', req.farmer._id) 
    
      const orders = await Order.find({farmer:req.farmer._id}) //{products:farmer.products}
      console.log(orders);
      res.status(202).json({ success: true, data:orders});
    } catch (error) {
      res.status(404).json({ success: false, msg: error.message });
    }

}
/*=========== Farmer Can chanege the status(Pending to READY OR COMPLET) by using single order id  ==========*/
exports.changeStatus = async (req,res)=>{
  try {
    console.log('from updatStatus order')
   let newStatus= await Order.updateOne({_id:req.params.orderid},{$set:{status:req.body.status}}) 
   console.log("from update status line 135", newStatus )

 const orders = await Order.find({_id:req.params.orderid}) 
      console.log("From Order id--->",orders);


    let myCustomer = await Customer.findOne({_id:orders[0].customer})
     console.log('From my customer email', myCustomer.email);
  let farm= await Farmer.findOne({_id:orders[0].farmer});
   console.log("from my Farmer email", farm.email);

   if(req.body.status.toLowerCase()==='Ready'){
         
/*========= save Email and password in sacured & global object place (dotinve)   ========*/

  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth:{
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
      }
   }) 

  
  /*===========Sender and reciver ============ */
let mailOptions={
        from:farm.email,                  
        to: myCustomer.email,
        cc:myCustomer.email ,
        subject: "Hello customer",
        text: "ViVa Amele!,"
    }
     /*============ Farmer can Sent Email to the Sepsific Customer with status Change (READY, COMPLETE) ============ */
transporter.sendMail(mailOptions, function(err, data){
    if(err){
    console.log("error error!", err);
    }else{
        console.log('Your Order is ready!.Thank you for shoping')
    }
})
   }else{
  // let myCustomer = await Customer.findOne({_id:req.body.customer})
  //   console.log('From my customer', myCustomer.email);
  //   let farm= await Farmer.findOne({_id:req.body.farmer});
  // console.log("from makeOrder", farm.email);
//about email

/*=============Complete =============*/
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth:{
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
      }
   }) 

let mailOptions={
        from:'amelemiu2020@gmail.com',                   //legesseelsabet@gmail.com ,
        to: myCustomer.email,
        cc:myCustomer.email ,
        subject: "Hello customer",
        text: "ViVa Amele!"
    }
transporter.sendMail(mailOptions, function(err, data){
    if(err){
    console.log("error error!", err);
    }else{
        console.log('Your order is completed! Thank You for shoping!')
    }
})
   }
    res.status(202).json({ success: true, message:"successfully status updated"});
  } catch (error) {
    res.status(404).json({ success: false, msg: error.message });
  }


}