import mongoose, { Schema, Document, Model } from "mongoose";

interface IForgotPwdReq extends Document {
  user_id: string;
  is_active: boolean;
}

const ForgotPwdReqSchema: Schema<IForgotPwdReq> = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  is_active: {
    type: Boolean,
  },
});

const ForgotPwdReq: Model<IForgotPwdReq> = mongoose.model<IForgotPwdReq>(
  "forgot_pwd_req",
  ForgotPwdReqSchema
);
export default ForgotPwdReq;
