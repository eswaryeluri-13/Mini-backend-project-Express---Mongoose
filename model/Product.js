const mongoose = require('mongoose')

const products = new mongoose.Schema({
    p_id:Number,
    p_name:String,
    p_cost:Number,
    p_cat:String,
    p_img:String,
    p_desc:String
})

const users = new mongoose.Schema({
    u_id:Number,
    u_name:String,
    u_pwd: String,
    u_u_email:String,
    u_addr:String,
    u_u_contact:Number
})

const cart = new mongoose.Schema({

    p_id:Number,
    p_img:String,
    qty:Number,
    p_cost:Number,
    u_name:String
})

const Product = mongoose.model('Product', products);
const User = mongoose.model('User', users);
const Cart = mongoose.model('cart', cart);

module.exports ={
    Product,
    User,
    Cart
}