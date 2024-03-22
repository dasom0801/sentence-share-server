import { Schema, model } from 'mongoose';

const BookSchema = new Schema({
  title: { type: String, required: true },
  coverUrl: { type: String },
  publisher: { type: String, required: true },
  author: { type: [String], required: true },
  isbn: { type: String, required: true, unique: true },
  publishedAt: { type: Date },
  firestoreId: { type: String }, // temp value for migration
});

const Book = model('book', BookSchema);
export default Book;
