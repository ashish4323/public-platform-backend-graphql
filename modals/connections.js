
import mongoose from "mongoose"

const Schema = mongoose.Schema;


const connectionSchema = new Schema({
    connectionBy: 
    {
        type: Schema.Types.ObjectId,
        ref: 'PPUser'
    },
    connectionTo: 
    {
        type: Schema.Types.ObjectId,
        ref: 'PPUser'
    },
    status: 
    {
        type: String,
        enum: ["accepted","rejected","pending"],
        default:"pending"
    }
})

const Connection = mongoose.model("Connection",connectionSchema);

export {Connection}
