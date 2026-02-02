import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 100
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        stock: {
            type: Number,
            min: 0,
            default: 0
        },
        warranty: {
            type: Number,
            default: 0,
            min: 0
        },
        productImages: [
            {
                url: String
            }
        ],
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
)


export const Product = mongoose.model("Product", productSchema)