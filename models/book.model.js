import { Schema, model } from 'mongoose';

const BookSchema = new Schema({
  title: { type: String, required: true },
  coverUrl: { type: String },
  publisher: { type: String, required: true },
  author: { type: [String], required: true },
  isbn: { type: String, unique: true },
  firestoreId: { type: String }, // temp value for migration
  sentence: [
    {
      type: Schema.Types.ObjectId,
      ref: 'sentence',
    },
  ],
});

const Book = model('book', BookSchema);
export default Book;
