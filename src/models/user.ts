import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document {
  username: string;
  name: string;
  password: string;
  email: string;
  premium: boolean;
  total_expense: number;
}

const UserSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  total_expense: {
    type: Number,
    default: 0,
  },
});

const User: Model<IUser> = mongoose.model<IUser>("user", UserSchema);
export default User