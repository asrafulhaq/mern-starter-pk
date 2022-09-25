import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import createError from "./errorController.js";
import jwt from 'jsonwebtoken';


/**
 * @access public 
 * @route /api/user
 * @method GET 
 */
export const getAllUser = async (req, res, next) => {
    
    try {

        const users = await User.find();
        res.status(200).json(users);

    } catch (error) {

        next(error);
        
    }
    
}



/**
 * @access public 
 * @route /api/user/:id
 * @method GET
 */
 export const getSingleUser = async (req, res, next) => {
    const { id } = req.params;
    try {        
        const user = await User.findById(id);

        if( !user ){
            return next(createError(404, "Single user not found"));
        }

        if(user){
            res.status(200).json(user);
        }

    } catch (error) {
        next(error);
    }
}


/**
 * @access public 
 * @route /api/user
 * @method POST
 */
 export const createUser = async (req, res, next) => {

    // make hash pass
    const salt = await bcrypt.genSalt(10);
    const hash_pass = await bcrypt.hash(req.body.password, salt);


    try {        
        const user = await User.create({ ...req.body, password : hash_pass });
        res.status(200).json(user);

    } catch (error) {
        next(error);
    }
}

 
/**
 * @access public 
 * @route /api/user/:id
 * @method PUT/PATCH
 */
 export const updateUser = async (req, res, next) => {
    const { id } = req.params;
    try {        
        const user = await User.findByIdAndUpdate(id, req.body, { new : true });
        res.status(200).json(user);

    } catch (error) {
        next(error);
    }
}



/**
 * @access public 
 * @route /api/user/:id
 * @method DELETE
 */
 export const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {        
        const user = await User.findByIdAndDelete(id);
        res.status(200).json(user);

    } catch (error) {
        next(error);
    }
}




/**
 * @access public 
 * @route /api/user/login
 * @method POST
 */
 export const userLogin = async (req, res, next) => {
    // get body data 


    try {
        
        // find user 
        const login_user = await User.findOne({ email : req.body.email });

        // check user exists or not 
        if( !login_user ){
            return next(createError(404, "User not found"));
        }

        // check password
        const passwordCheck = await bcrypt.compare(req.body.password, login_user.password);

        // password handle 
        if( !passwordCheck ){
            return next(createError(404, "Wrong password"));
        }

        // create a token
        const token = jwt.sign({ id : login_user._id, isAdmin : login_user.isAdmin }, process.env.JWT_SECRET );

        // login user info 
        const { password, isAdmin,  ...login_info } = login_user._doc; 

        res.cookie("access_token", token).status(200).json({
            token :  token,
            user : login_info, 
        });

        

        
    } catch (error) {
        next(error)
    }
   
}




/**
 * @access public 
 * @route /api/user/register
 * @method POST
 */
 export const userRegister = async (req, res, next) => {

    // make hash pass
    const salt = await bcrypt.genSalt(10);
    const hash_pass = await bcrypt.hash(req.body.password, salt);


    try {        
        const user = await User.create({ ...req.body, password : hash_pass });
        res.status(200).json(user);

    } catch (error) {
        next(error);
    }
}