import express, { Request, Response } from "express";
import { Book } from "../models/books.model";
import { Error, isValidObjectId } from "mongoose";

export const booksRoutes = express.Router();

interface queryParamInterface {
  filter?: string;
  sortBy?: string;
  sort?: "asc" | "desc";
  limit?: number;
}

booksRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const book = await Book.create(body);

    const successMessage = {
      success: true,
      message: "Book created successfully",
      data: book,
    };

    res.status(201).json(successMessage);
  } catch (err: any) {
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

booksRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const queryOptions = req.query as queryParamInterface;
    const filterOption: any = {};
    if (queryOptions.filter) filterOption.genre = queryOptions.filter;

    const sortBy = queryOptions.sortBy
      ? {
          [queryOptions.sortBy as string]: queryOptions.sort
            ? queryOptions.sort
            : "asc",
        }
      : {};

    const books = await Book.find(filterOption)
      .sort(sortBy)
      .limit(queryOptions.limit as number);
    const successMessage = {
      success: true,
      message: "Books retrieved successfully",
      data: books,
    };
    res.send(successMessage);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("unknown error");
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
});

booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;

    if (!isValidObjectId(bookId)) {
      res.status(400).json({
        message: "Invalid Object ID",
        success: false,
      });
      return;
    }
    const book = await Book.findById(bookId);
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
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("unknown error");
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
});

booksRoutes.put("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    
    if (!isValidObjectId(bookId)) {
      res.status(400).json({
        message: "Invalid Object ID",
        success: false,
      });
      return;
    }

    const body = req.body;
    const updatedBook = await Book.findByIdAndUpdate(bookId, body, {
      new: true,
    });

    if (!updatedBook) {
      res.status(404).json({
        message: "Book is not found to be updated",
        success: false,
      });
      return;
    }

    res.json({
      message: "Book updated successfully",
      success: true,
      data: updatedBook,
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("unknown error");
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
});

booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    if (!isValidObjectId(bookId)) {
      res.status(400).json({
        message: "Invalid Object ID",
        success: false,
      });
      return;
    }

    const deletedBook = await Book.findByIdAndDelete(bookId);
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
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("unknown error");
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
});
