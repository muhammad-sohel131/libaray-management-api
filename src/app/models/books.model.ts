import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        author: {
            type: String,
            require: true
        },
        genre: {
            type: String,
            required: true,
            enum: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY']
        },
        isbn: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String
        },
        copies: {
            type: Number,
            required: true
        },
        available: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const borrowSchema = new Schema(
    {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export const Book = mongoose.model('book', bookSchema)
export const Borrow = mongoose.model('borrow', borrowSchema)
