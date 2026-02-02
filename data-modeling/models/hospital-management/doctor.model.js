import mongoose from "mongoose"

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        department: {
            type: String,
            enum: ["Cardiology","Neurology","Orthopedics","Prediatrics",
                "Dermatology", "Gynecology","Radiology","Emergency","General Medicine"],
            required: true,
        },
        designation: {
            type: String,
            required: true,
        },
        qualifications:[
            {
            type: String,
            required: true
        }],
        experienceInYears: {
            type: Number,
            default:0,
            min:0
        },
        worksInHospitals: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Hospital"
            }
        ]
    },
    {
        timestamps: true
    }
)

export const Doctor = mongoose.model("Doctor",doctorSchema)