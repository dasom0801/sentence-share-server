import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    uid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    provider: { type: String, required: true },
    email: { type: String },
    profileUrl: { type: String },
  },
  { timestamps: true }
);

const User = model('user', UserSchema);
export default User;
