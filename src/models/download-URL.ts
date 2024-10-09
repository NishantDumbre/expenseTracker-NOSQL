import mongoose, { Schema, Document, Model } from "mongoose"


interface IDownloadURL extends Document {
  url: string;
  date: Date;
  user_id: string;
}

const DownloadURLSchema: Schema<IDownloadURL> = new Schema({
  url: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
});


const DownloadURL: Model<IDownloadURL> = mongoose.model<IDownloadURL>("download_url", DownloadURLSchema);
export default DownloadURL
