import mongoose, { Schema } from "mongoose"
const employeeSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter Full Name"]
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        department: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {timestamps: true}
)

const Employee = mongoose.model("Employee", employeeSchema)

export default Employee;