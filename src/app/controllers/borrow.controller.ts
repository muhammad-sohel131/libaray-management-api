import express, { Request, Response } from "express";
import { Book, Borrow } from "../models/books.model";
import borrowInterface from "../interface/borrow.interface";

export const borrowRoutes = express.Router();

borrowRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body as borrowInterface;

    const book = await Book.findById(body.book)
    if(!book){
        res.status(404).json({
            message: "Book is not found",
            success: false
        })
        return
    }

    if(!book.available){
        res.status(400).json({
            message: "The book is not available",
            success: false
        })
        return
    }

    if(book.copies < body.quantity){
        res.status(400).json({
            message: "Limited quantity",
            success: false
        })
        return
    }

    book.copies -= body.quantity;
    if(book.copies === 0) book.available = false
    await book.save()


    const createdBorrow = await Borrow.create(body)

    res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data: createdBorrow
    })
  } catch (error) {
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
});
