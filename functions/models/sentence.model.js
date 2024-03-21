import { Schema, model } from 'mongoose';

const SentenceSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: 'book',
      required: true,
    },
    firestoreId: { type: String }, // temp value for migration
  },
  { timestamps: true }
);

const Sentence = model('sentence', SentenceSchema);
export default Sentence;
