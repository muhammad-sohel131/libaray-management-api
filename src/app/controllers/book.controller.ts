import express, { Request, Response } from "express";
import { Book } from "../models/books.model";
import { Error } from "mongoose";

export const booksRoutes = express.Router();

booksRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const book = await Book.create(body);
    const result = await book.save();

    const successMessage = {
      success: true,
      message: "Book created successfully",
      data: result,
    };

    res.status(201).json(successMessage);
  }catch (err: any) {
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
});

