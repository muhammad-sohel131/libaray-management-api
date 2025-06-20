import mongoose, { Schema } from "mongoose";
import bookInterface from "../interface/book.interface";
import borrowInterface from "../interface/borrow.interface";

const bookSchema = new Schema<bookInterface>(
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

const borrowSchema = new Schema<borrowInterface>(
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

export const Book = mongoose.model('Book', bookSchema)
export const Borrow = mongoose.model('Borrow', borrowSchema)
