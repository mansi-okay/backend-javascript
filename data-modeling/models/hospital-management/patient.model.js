import mongoose from "mongoose"

const patientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        diagnosis: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        age:{
            type: Number,
            required: true
        },
        bloodGroup:{
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            required: true
        },
        gender: {
            type: String,
            required: true,
            enum: ["Male","Female","Other"]
        },
        admittedIn: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
            required: true
        },
        patientPhoto: {
            url: String
        }       
    },
    {
        timestamps: true
    }
)

export const Patient = mongoose.model("Patient",patientSchema)