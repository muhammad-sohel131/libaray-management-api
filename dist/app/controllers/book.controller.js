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
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const books_model_1 = require("../models/books.model");
const mongoose_1 = require("mongoose");
exports.booksRoutes = express_1.default.Router();
exports.booksRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const book = yield books_model_1.Book.create(body);
        const result = yield book.save();
        const successMessage = {
            success: true,
            message: "Book created successfully",
            data: result,
        };
        res.status(201).json(successMessage);
    }
    catch (err) {
        // Handle duplicate key error
        if (err.name === "MongoServerError" && err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            const value = err.keyValue[field];
            const errorMessage = {
                message: "Validation failed",
                success: false,
                error: {
                    name: "ValidationError",
                    errors: {
                        [field]: {
                            message: `${field} must be unique. '${value}' is already in use.`,
                            name: "ValidatorError",
                            properties: {
                                message: `${field} must be unique. '${value}' is already in use.`,
                                type: "unique",
                            },
                            kind: "unique",
                            path: field,
                            value: value,
                        },
                    },
                },
            };
            res.status(400).json(errorMessage);
        }
        // Handle other Mongoose validation errors
        if (err.name === "ValidationError") {
            const errorMessage = {
                message: "Validation failed",
                success: false,
                error: {
                    name: err.name,
                    errors: err.errors,
                },
            };
            res.status(400).json(errorMessage);
        }
        // Fallback for other errors
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
exports.booksRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryOptions = req.query;
        const filterOption = {};
        if (queryOptions.filter)
            filterOption.genre = queryOptions.filter;
        const sortBy = queryOptions.sortBy
            ? {
                [queryOptions.sortBy]: queryOptions.sort
                    ? queryOptions.sort
                    : "asc",
            }
            : {};
        const books = yield books_model_1.Book.find(filterOption)
            .sort(sortBy)
            .limit(queryOptions.limit);
        const successMessage = {
            success: true,
            message: "Books retrieved successfully",
            data: books,
        };
        res.send(successMessage);
    }
    catch (err) {
        const error = err instanceof mongoose_1.Error ? err : new mongoose_1.Error("unknown error");
        const errorMessage = {
            message: "Internal server error",
            success: false,
            error: {
                name: error.name,
                message: error.message,
            },
        };
        console.error(err);
        res.status(500).json(errorMessage);
    }
}));
exports.booksRoutes.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield books_model_1.Book.findById(bookId);
        if (!book) {
            res.status(404).json({
                message: "Book is not found for this ID",
                success: false,
            });
        }
        res.json({
            message: "Book retrieved successfully",
            success: true,
            data: book,
        });
    }
    catch (err) {
        const error = err instanceof mongoose_1.Error ? err : new mongoose_1.Error("unknown error");
        const errorMessage = {
            message: "Internal server error",
            success: false,
            error: {
                name: error.name,
                message: error.message,
            },
        };
        res.status(500).json(errorMessage);
    }
}));
exports.booksRoutes.put("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        if (!(0, mongoose_1.isValidObjectId)(bookId)) {
            res.status(400).json({
                message: "Invalid Object ID",
                success: false,
            });
        }
        const body = req.body;
        const updatedBook = yield books_model_1.Book.findByIdAndUpdate(bookId, body, {
            new: true,
        });
        if (!updatedBook) {
            res.status(404).json({
                message: "Book is not found to be updated",
                success: false,
            });
        }
        res.json({
            message: "Book updated successfully",
            success: true,
            data: updatedBook,
        });
    }
    catch (err) {
        const error = err instanceof mongoose_1.Error ? err : new mongoose_1.Error("unknown error");
        const errorMessage = {
            message: "Internal server error",
            success: false,
            error: {
                name: error.name,
                message: error.message,
            },
        };
        res.status(500).json(errorMessage);
    }
}));
exports.booksRoutes.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        if (!(0, mongoose_1.isValidObjectId)(bookId)) {
            res.status(400).json({
                message: "Invalid Object ID",
                success: false,
            });
            return;
        }
        const deletedBook = yield books_model_1.Book.findByIdAndDelete(bookId);
        if (!deletedBook) {
            res.status(404).json({
                message: "Book is not found to be delete",
                success: false,
            });
            return;
        }
        res.json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (err) {
        const error = err instanceof mongoose_1.Error ? err : new mongoose_1.Error("unknown error");
        const errorMessage = {
            message: "Internal server error",
            success: false,
            error: {
                name: error.name,
                message: error.message,
            },
        };
        res.status(500).json(errorMessage);
    }
}));
