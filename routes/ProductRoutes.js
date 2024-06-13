//import express module
const express = require('express')
//create router instance
const router = express.Router()
//import productApi
const productApi = require('../apis/ProductApis')

router.get("/fetch",productApi.products_all)
router.post("/insert-p-in-list",productApi.insert_product_to_list)
router.post("/delete-p-from-list",productApi.delete_product_from_list)
router.put("/update-p-in-list",productApi.update_product_in_list)

router.get("/login",productApi.login)
router.post("/insert",productApi.createUser)
router.post("/delete-user",productApi.delete_user)

router.get("/getcart",productApi.getcart)
router.post("/inscart",productApi.inscart)
router.post("/updcart",productApi.updcart)
router.delete("/delcart",productApi.delcart)

module.exports=router