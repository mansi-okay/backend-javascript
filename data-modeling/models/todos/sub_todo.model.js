import mongoose from "mongoose";

const subTodoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        notes: {
            type: String,
            trim: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        complete: {
            type: Boolean,
            default: false
        },
        dueDate: {
            type: Date
        }  
    },
    {
        timestamps: true
    }
)

export const SubTodo = mongoose.model("SubTodo", subTodoSchema)