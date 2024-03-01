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
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: 'book',
    },
    firestoreId: { type: String }, // temp value for migration
  },
  { timestamps: true }
);

const Sentence = model('sentence', SentenceSchema);
export default Sentence;
