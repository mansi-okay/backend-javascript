import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim:true,
            index: true
        },
        fullname: {
            type: String,
            required: true,
            lowercase: true,
            trim:true,
            index: true            
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim:true            
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            // bug fix => removed lowercase: true,  unique: true
            trim:true            
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverimage: {
            type: String    // cloudinary url
        },
        watchHistory: [{
            type: Schema.Types.ObjectId,
            ref: "Video"
        }], 
        refreshToken: {
            type: String,
        }
    },
    {
        timestamps: true
    })


// .pre hook here used to modify(encypt) data before saving
// Express middlware => async or not -> usually use next()
// Mongoose middlewares => async -> no next()   and  non-async ->  use next()
userSchema.pre("save", async function () {     // bug fix:  async function (next) ->  async function ()
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,7)
})

// never decrypt password
// checking if password correct
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// Access Token -> short term, use this to get data
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
        _id: this._id,
        username: this.username,
        fullname: this.fullname,
        email : this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

// Access token expires -> client sends refresh token -> server issues new access token

// Refresh Token -> long term, use this to get a new access token
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)    
}

export const User = mongoose.model("User",userSchema)