const userModel = require('../Model/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
exports.postUser = asyncHandler(async (req, res) => {
    const { name, phone, password, height, weight, dateOfBirth, blood, email } = req.body; 
    const image = req.file ? req.file.filename : undefined;
    
    try {
        // Validate inputs
        if (!name || !phone || !password || !height || !weight || !dateOfBirth || !blood || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // Check if the phone number already exists
        const existingUser = await userModel.findOne({ phone });
        if (existingUser) {
            return res.status(409).json({ message: "Phone number already exists" });
        }
        
        // Create the user
        const newUser = await userModel.create({
            image,
            name,
            phone,
            password,
            height,
            weight,
            dateOfBirth,
            blood,
            email
        });
        
        // Log the successful creation
        console.log("New user created:", newUser);

        // Respond with success message and the created user
        res.status(200).json({
            message: 'User posted successfully',
            user: newUser
        });
        
    } catch (err) {
        // Log the error
        console.error("Error posting user:", err);

        // Respond with a generic error message
        res.status(500).json({ message: 'An error occurred while posting user' });
    }
});



exports.userPostSignIn = asyncHandler(async(req, res) => {
    const { phone, password } = req.body;
    console.log(req.body,"the body is here")
    
    try {
        const postSignin = await userModel.findOne({ phone });

        if (!postSignin) {
            return res.status(400).json({ error: "Invalid phone number or password" });
        }

        const isPasswordMatch = await bcrypt.compare(password, postSignin.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ error: "Invalid phone number or password" });
        }

        const token = jwt.sign({ email: postSignin.email }, "myjwtsecretkey");

        // Update the admin document in the database to save the token
        await userModel.findByIdAndUpdate(postSignin._id, { token: token });

        const userProfile = {
            id: postSignin._id,
            name: postSignin.name,
            email: postSignin.email,
            phone: postSignin.phone,
            image: postSignin.image,
            blood: postSignin.blood,
            height: postSignin.height,
            weight: postSignin.weight,
            dateOfBirth: postSignin.dateOfBirth
        };
        console.log(postSignin.image, " the image is ")

        res.status(200).json({ token: token, user: userProfile });
        console.log(token,'the token is here')
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



exports.getUser = async (req, res) => {
    // const search = req.query.search;
    // console.log(search, "the search term");
    try {
        // const query = {};
        // if (search) {
        //     query.$or = [
        //         { categories: { $regex: search, $options: 'i' } }
        //     ];
        // }
        // console.log(query, "the query"); // Log the formed query
        const response = await userModel.find();//adrd the query in find()
        // console.log(response, "the response"); // Log the response from the database
        res.status(200).json(response);
        console.log(response,"the response")
    } catch (err) {
        console.error(err); // Log any errors
        res.status(500).send('An error occurred while fetching data');
    }
};



exports.getUserById = asyncHandler(async(req,res)=>{
    const {id} = req.params
    // console.log(req.params, 'the id is here')
    try{
        const response = await userModel.findById(id)
        res.status(200).json(response)
    }catch(err){
        console.log(err)
        res.status(500).send('An error occured while fetching data')
    }
})

exports.editUser = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const {name, phone, height, weight, dateOfBirth, blood, email} = req.body;
    const image = req.file ? req.file.filename : undefined;
    try{  
        const update = {
            image:image, 
            name:name,
            phone:phone,
            height:height,
            weight:weight,
            dateOfBirth:dateOfBirth,
            blood:blood,
            email:email
        }
        const updateData = await userModel.findByIdAndUpdate(id, {$set:update}, {new:true})
        res.status(200).json(updateData)
       
    }catch(err){
        res.status(500).json({err:'error while updating data'})
    }
})

exports.deleteUser = asyncHandler(async(req, res)=>{
    const {id} = req.params
    try{
        const response = await userModel.findByIdAndDelete(id)
        res.status(200).json(response)
    }catch(err){
        console.log(err)
    }
})

