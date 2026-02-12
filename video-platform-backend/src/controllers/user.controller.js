import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from  "../models/user.model.js"
import {uploadFileOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message: "ok"
    // })

    // data input from frontend
    // validation -  not empty 
    // check if already exists user: uname, email
    // check for files, check for avatar
    // upload to cloudninary, check for avatar
    // create user object - create entry in db
    // remove password and refresh token field
    // check for user creation
    // return res

    const {username,fullname,email,password} = req.body;
    
    // optional chaining " ? " -> Only call .trim() if field is NOT null or undefined
    if ([username,fullname,email,password].some((fields) => fields?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    //findOne -> whichever first user matches it returns it
    const existingUser = await User.findOne({
        $or: [{username},{email}]
    })
    if (existingUser) {
        throw new ApiError(400, "User already exists") 
    }

    // console.log(req.files);  
    const avatarLocalPath = req.files?.avatar?.[0]?.path;     //print files
    const coverImageLocalPath = req.files?.coverimage?.[0]?.path; 

    if (!avatarLocalPath){
        throw new ApiError(400, "Avatar required")
    }

    const avatar = await uploadFileOnCloudinary(avatarLocalPath)
    // console.log(avatar)  //response

    if (!avatar){
        throw new ApiError(400, "Avatar upload failed")
    }

    let coverimage
    if (coverImageLocalPath){
        coverimage = await  uploadFileOnCloudinary(coverImageLocalPath)
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        email,
        password,
        avatar: avatar.url,
        coverimage: coverimage?.url || ""
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        new ApiError(500, "Something went wrong")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered success")
    )

})  

export {registerUser}