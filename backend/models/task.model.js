import mongoose, {Schema} from 'mongoose'

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description : {
        type: String,
    },
    status : {
        type: String,
        default: "Pending",
        enum : {
            values: ["Pending", "In Progress", "Completed"],
            message: 'Invalid role: Entered value is not a valid role.'
        },
        required: true
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    due_date: {
        type: Date
    }
})

const Task = mongoose.model("Task", taskSchema)
export default Task;