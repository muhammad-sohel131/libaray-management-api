import mongoose, { Model } from "mongoose";

interface borrowInterface{
  book: mongoose.Schema.Types.ObjectId;
  quantity: number;
  dueDate: Date;
}

export interface BorrowModel extends Model<borrowInterface> {
  getBorrowSummary(): Promise<
    {
      book: {
        title: string;
        isbn: string;
      };
      totalQuantity: number;
    }[]
  >;
}

export default borrowInterface;
