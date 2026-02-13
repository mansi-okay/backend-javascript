import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from  "../models/user.model.js"
import {uploadFileOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const generateAccessandRefreshTokens = async (userId)=> {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({
            validateBeforeSave: false  // to avoid validation and avoid errors when required fields not given while saving
        })

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating tokens")
    }
}

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
        //console.log(existingUser);
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
        throw new ApiError(500, "Something went wrong")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered success")
    )

})  

const loginUser = asyncHandler(async(req,res) => {
    // get login data from user mainly username/email and password
    // check if user with username/email exist
    // check password
    // when login success generate access + refresh token 
    // and send them to user

    const {email, username, password} = req.body

    if (!username?.trim() && !email?.trim()) {
        throw new ApiError(400,"Please enter username or email")
    }
    if (!password?.trim()) {
        throw new ApiError(400,"Please enter password")
    }

    const existingUser = await User.findOne({
        $or : [{username},{email}]
    })

    if (!existingUser){
        throw new ApiError(400,"User does not exist")
    }

    const passwordMatch = await existingUser.isPasswordCorrect(password)

    if (!passwordMatch) {
        throw new ApiError(400,"Please enter correct credentials")
    }

    const {accessToken, refreshToken} = await generateAccessandRefreshTokens(existingUser._id)

    const loggedInUser =  await User.findById(existingUser._id).select("-password -refreshToken")
    
    const options = {
        httpOnly: true,   // Prevents JS from reading or modifying the cookie
        secure: true      // Cookie is only sent over HTTPS
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
            {user: loggedInUser, accessToken, refreshToken},
            "User logged-in successfully"
        )
    )
})

const logOut = asyncHandler(async (req,res) => {
    // refresh token expire ho jab logout
    // or user logs out themselves 
        await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))

}) 


export {registerUser, loginUser,logOut}