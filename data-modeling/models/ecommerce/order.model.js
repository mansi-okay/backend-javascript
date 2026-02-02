import mongoose, { trusted } from "mongoose";
import { Product } from "./product.model";

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity : {
            type: Number,
            default: 1,
            min: 1
        },
        purchasePrice: {
            type: Number,
            required: true
        }
    }
)

const orderSchema = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["pending","cancelled","shipped","delivered"],
            default: "pending"
        },
        orderTotal: {
            type: Number,
            required: true
        },
        orderItems: {
            type: [orderItemSchema],
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Order = mongoose.model("Order", orderSchema)