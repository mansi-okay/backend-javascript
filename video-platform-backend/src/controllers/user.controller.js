import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from  "../models/user.model.js"
import {uploadFileOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt, { decode } from "jsonwebtoken"


const generateAccessandRefreshTokens = async (userId)=> {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({
            validateBeforeSave: false  // // skips ALL schema validation (used here to avoid required-field errors)
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

    // finds the user and updates simultaneously
    // (id, update, options)
    await User.findByIdAndUpdate(
    req.user._id,
        {
            // $set: {
            //     refreshToken: undefined // this removes the field from document
            // }
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true   // Returns the updated document (after changes)
            // without new: true -> Returns the old document (before changes)
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


const refreshAccessToken = asyncHandler(async (req,res) => {
    const incomingRefreshToken =  req.cookies.refreshToken || 
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.body.refreshToken

    if (!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        // This pattern is called refresh token rotation
        // more secure as we are regenrating refresh token 
        const {accessToken, refreshToken: newRefreshToken} = await generateAccessandRefreshTokens(user._id)
        // bug fix ->  no property called newRefreshToken in the returned object in generateAccessandRefreshTokens
        // so correctly destructure and rename refreshToken otherwise newRefreshToken=undefined


        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async(req,res) => {
    // get id of user from auth middleware
    // find the user and check if exist
    // take passwords(old + new) from user match the previous password
    // update password

    const {oldPassword, newPassword,confirmPassword} = req.body

    if (!oldPassword?.trim() || !newPassword?.trim() || !confirmPassword?.trim()) {
        throw new ApiError(400, "All password fields are required")
    }

    if(newPassword !== confirmPassword){
        throw new ApiError(400,"Paaword mismatch")
    }

    const user = await User.findById(req.user?._id)

    if (!user){
        throw new ApiError(400,"User does not exist")
    }
    
    const passwordValid = await user.isPasswordCorrect(oldPassword)

    if(!passwordValid){
        throw new ApiError(401,"Old password invalid")
    }

    user.password = newPassword
    await user.save(
        {
            validateModifiedOnly: true
            //validate only modified fields to avoid unrelated required-field validation errors
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,{}, "Password change success")
    )
})

const getCurrentUser = asyncHandler(async(req,res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched success"
    ))
}) 

const updateAccountDetails = asyncHandler(async(req,res) => {
    const {fullname,email} = req.body

    if(!fullname && !email){
        throw new ApiError(400, "At least one field is required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email: email
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(new ApiResponse(
        200, 
        user, 
        "Account details updated successfully"
    ))
})

const updateAvatar = asyncHandler(async(req,res) => {
    // upload local file using multer
    // get local path and upload on cloudinary
    // update the url in db

    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath){
        throw new ApiError(400, "Avatar file missing")
    }

    const avatar = await uploadFileOnCloudinary(avatarLocalPath)

    if (!avatar?.url){
        throw new ApiError(400, "Avatar upload failed")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(new ApiResponse(
        200, 
        user, 
        "Avatar updated success"
    ))
})

const updateCoverImage = asyncHandler(async(req,res) => {
    // upload local file using multer
    // get local path and upload on cloudinary
    // update the url in db

    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath){
        throw new ApiError(400, "Cover image file missing")
    }

    const coverimage = await uploadFileOnCloudinary(coverImageLocalPath)

    if (!coverimage?.url){
        throw new ApiError(400, "Cover image upload failed")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverimage: coverimage.url
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(new ApiResponse(
        200, 
        user, 
        "Cover image updated success"
    ))
})

export {
    registerUser,
    loginUser,
    logOut,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage
}