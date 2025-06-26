"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const books_model_1 = require("../models/books.model");
exports.borrowRoutes = express_1.default.Router();
exports.borrowRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const book = yield books_model_1.Book.findById(body.book);
        if (!book) {
            res.status(404).json({
                message: "Book is not found",
                success: false,
            });
            return;
        }
        if (!book.available) {
            res.status(400).json({
                message: "The book is not available",
                success: false,
            });
            return;
        }
        if (book.copies < body.quantity) {
            res.status(400).json({
                message: "Limited quantity",
                success: false,
            });
            return;
        }
        book.copies -= body.quantity;
        if (book.copies === 0)
            book.available = false;
        yield book.save();
        const createdBorrow = yield books_model_1.Borrow.create(body);
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: createdBorrow,
        });
    }
    catch (error) {
        const err = error instanceof Error ? error : new Error("unknown error");
        const errorMessage = {
            message: "Internal server error",
            success: false,
            error: {
                name: err.name,
                message: err.message,
            },
        };
        console.error(err);
        res.status(500).json(errorMessage);
    }
}));
exports.borrowRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrows = yield books_model_1.Borrow.aggregate([
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
        res.json({
            message: "Borrowed books summary retrieved successfully",
            success: true,
            data: borrows
        });
    }
    catch (error) {
        const err = error instanceof Error ? error : new Error("unknown error");
        const errorMessage = {
            message: "Internal server error",
            success: false,
            error: {
                name: err.name,
                message: err.message,
            },
        };
        console.error(err);
        res.status(500).json(errorMessage);
    }
}));
