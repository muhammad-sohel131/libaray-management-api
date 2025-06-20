import mongoose from "mongoose";

interface borrowInterface {
    book: mongoose.Schema.Types.ObjectId
    quantity: number,
    dueDate: Date
}

export default borrowInterface