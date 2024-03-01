import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    uid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    provider: { type: String, required: true },
    email: { type: String },
    profileUrl: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'sentence ' }], // 좋아요한 문장
    sentence: [{ type: Schema.Types.ObjectId, ref: 'sentence' }], // 작성한 문장
  },
  { timestamps: true }
);

const User = model('user', UserSchema);
export default User;
