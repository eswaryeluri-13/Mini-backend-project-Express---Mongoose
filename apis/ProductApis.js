const { Product, User, Cart } = require('../model/Product');
const products_all = async (req, res) => {
    try {
        const products = await Product.find();
        console.log("Data Sent");
        res.json(products)
    }
    catch (error) {
        console.log("Fetch error :-", error)
        res.json({ 'message': error })
    }
}

const insert_product_to_list = async(req,res) => {
    let obj = new Product({
        
            "p_id": req.body.p_id,
            "p_name": req.body.p_name,
            "p_cost": req.body.p_cost,
            "p_cat": req.body.p_cat,
            "p_desc": req.body.p_desc,
            "p_img": req.body.p_img
        
    })
    try {
        const inserted_product=await obj.save()
        console.log("Product inserted into products list")
        res.send({"insert-product-to-list":"success"})
    }

    catch(error)
    {
        console.log("errror :- ",error)
        res.send({"insert-product-to-list":"failed"})
        
    }
}

//delete product from products-list
const delete_product_from_list = async (req, res) => {
    let p_id = req.body.p_id
    try {
        const deletedproduct = await Product.deleteOne({ p_id })
        if (deletedproduct.deletedCount != 0) {
            console.log('Product Deleted')
            res.send({ 'delete-product-from-list': 'success' })
        }
        else {
            console.log('Product Not deleted')
            res.send({ 'delete-product-from-list': 'Product Not Found in list' })
        }
    }
    catch (error) {
        res.status(400).send(error)
    }
}


//update product in products-list
const update_product_in_list = async (req, res) => {
    let p_id = req.body.p_id
    const product = {
        p_name:req.body.p_name,
        p_cost:req.body.p_cost
    }
    try {
        const updateProduct = await Product.updateOne(
            { p_id }, product
        )
        if (updateProduct.modifiedCount != 0) {
            console.log('Product Updated', updateProduct)
            res.send({ 'update-product-in-list': 'success' })
        }
        else {
            console.log('Product not updated')
            res.send({ 'update-product-in-list': 'Product Not Found In list' })
        }
    }
    catch (error) {
        res.status(400).send(error)
    }
}



const login = async (req, res) => {
    try {
        const { u_u_email, u_pwd } = req.body;
        const user = await User.findOne({ u_u_email: u_u_email, u_pwd: u_pwd });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        res.json({ message: "Login successful", user: user });
    } catch (error) {
        console.log("Login error :-", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const createUser = async (req, res) => {
    try {
        const { u_name, u_pwd, u_u_email, u_addr, u_u_contact } = req.body;
        const user = new User({
            u_id,
            u_name,
            u_pwd,
            u_u_email,
            u_addr,
            u_u_contact
        });
        await user.save();
        res.json({ message: "User created successfully" });
    } catch (error) {
        console.log("Create user error :-", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//delete user
const delete_user = async (req, res) => {
    let u_id = req.body.u_id
    try {
        const deletedproduct = await User.deleteOne({ u_id })
        if (deletedproduct.deletedCount != 0) {
            console.log('User Deleted')
            res.send({ 'delete-user': 'success' })
        }
        else {
            console.log('User Not deleted')
            res.send({ 'delete-user': 'failed' })
        }
    }
    catch (error) {
        res.status(400).send(error)
    }
}



const inscart = async (req, res) => {
    try {
        const { p_id, p_cost, p_img, u_name } = req.body;

        // Check if the user exists
        const user = await User.findOne({ u_name: u_name });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the cart item if it already exists
        let cartItem = await Cart.findOne({ p_id: p_id, u_name: u_name });

        if (!cartItem) {
            // Create a new Cart instance
            cartItem = new Cart({
                p_id: p_id,
                p_cost: p_cost,
                qty: 1,
                p_img: p_img,
                u_name: u_name
            });
        } else {
            // Update the quantity of the existing cart item
            cartItem.qty += 1;
        }

        // Save the cart item
        await cartItem.save();
        console.log("Cart data uploaded successfully");
        res.json({ message: "Cart data uploaded successfully" });

    } catch (error) {
        console.log("Error in creating cart :-", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



const getcart = async (req, res) => {
    try {
        const { u_name } = req.body;

        // Find all cart items for the user
        const cartItems = await Cart.find({ u_name: u_name });
        if (!cartItems.length) {
            return res.status(404).json({ message: "No items in cart" });
        }

        res.json({ message: "Data retrieved successfully", cart: cartItems });

    } catch (error) {
        console.log("Error :-", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updcart = async (req, res) => {
    try {
        const { p_id, qty,p_cost,p_img, u_name } = req.body;

        // Check if the user exists
        const user = await User.findOne({ u_name });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the cart item if it already exists
        let cartItem = await Cart.findOne({ p_id, u_name });

        if (!cartItem) {
            // If the cart item doesn't exist, return an error
            return res.status(404).json({ message: "Item not found in cart" });
        }

        // Update the quantity of the existing cart item
        cartItem.qty = qty;
        cartItem.p_cost=p_cost;
        cartItem.p_img=p_img;

        // Save the updated cart item
        await cartItem.save();

        console.log("Cart data updated successfully");
        res.json({ message: "Cart data updated successfully", cart: cartItem });

    } catch (error) {
        console.log("Error in updating cart :-", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const delcart = async (req, res) => {
    const p_id = req.body.p_id;
    const u_name = req.body.u_name;

    try {
        const cart = await Cart.findOneAndDelete({ p_id, u_name });

        if (!cart) {
            console.log(`Record not found for user ${u_name} and product ${p_id}`);
            return res.status(404).json({ cartDelete: 'Record Not found' });
        }

        console.log(`Cart data for ${u_name} and product ${p_id} deleted`);
        res.json({ cartDelete: 'success' });
    } catch (error) {
        console.log("Delete cart error :-", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    products_all,
    login,
    createUser,
    delete_user,
    getcart,
    inscart,
    updcart,
    delcart,
    insert_product_to_list,
    delete_product_from_list,
    update_product_in_list
}