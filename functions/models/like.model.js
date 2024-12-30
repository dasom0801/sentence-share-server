import { Schema, model } from 'mongoose';

const LikeSchema = new Schema({
  category: { type: String, required: true, default: 'sentence' },
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  target: {
    type: Schema.Types.ObjectId,
    ref: function () {
      return this.category; // sentence | user | book
    },
  },
});

const Like = model('like', LikeSchema);
export default Like;
