import mongoose from "mongoose";


const todoSchema = new mongoose.Schema(
    {
        title : {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: string,
            trim: true
        },
        complete : {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId, //refrence to another model
            ref: "User"
        },
        subTodos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SubTodo"
            }
        ] // Array of sub todo elements  
    },
    {
        timestamps: true
    }
)

export const Todo = mongoose.model("Todo", todoSchema)