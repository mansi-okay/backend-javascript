import mongoose from "mongoose"

// Schema -> blueprint of data, defines structure, no DB interaction
const userSchema = new mongoose.Schema(
    {
        username : {
            type: String,
            required: true,
            unique: true,
            lowrcase: true,
            trim: true
        },
        email : {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength : [8, "Password must be 8 character long"]
        }
    },
    {
        timestamps : true //automatically saves when a document(ie, field) was created and when it was last updated
    }
)

// Model -> created using schema, performs database operations
export const User = mongoose.model("User", userSchema)
// mongoose converts model names to lowercase plural collection names automatically
// Model name = class name (User)
// Collection name = table name (users)