import mongoose, { Schema } from "mongoose";
import bookInterface from "../interface/book.interface";
import borrowInterface, { BorrowModel } from "../interface/borrow.interface";

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


borrowSchema.statics.getBorrowSummary = async function () {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: {
            $sum: "$quantity",
          },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: 'bookDetails'
        },
      },
      {
        $unwind: '$bookDetails'
      },
      {
        $project: {
            _id: 0,
            book: {
                title: '$bookDetails.title',
                isbn: '$bookDetails.isbn'
            },
            totalQuantity: 1
        }
      }
    ]);

    return summary
} 

export const Book = mongoose.model('Book', bookSchema)
export const Borrow = mongoose.model<borrowInterface, BorrowModel>('Borrow', borrowSchema)
