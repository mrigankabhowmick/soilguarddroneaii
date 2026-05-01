import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISoilReport extends Document {
  userId: mongoose.Types.ObjectId;
  inputs: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    temperature: number;
    humidity: number;
    ph: number;
    rainfall: number;
    crop?: string;
  };
  results: {
    recommendedCrop?: string;
    analysisNote?: string;
    healthScore?: number;
  };
  fileUrl?: string; // Optional URL if user uploaded an image/file
  timestamp: Date;
  status: 'Pending' | 'Completed' | 'Failed';
}

const SoilReportSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    inputs: {
      nitrogen: { type: Number, default: 0 },
      phosphorus: { type: Number, default: 0 },
      potassium: { type: Number, default: 0 },
      temperature: { type: Number, default: 0 },
      humidity: { type: Number, default: 0 },
      ph: { type: Number, default: 0 },
      rainfall: { type: Number, default: 0 },
      crop: { type: String },
    },
    results: {
      recommendedCrop: { type: String },
      analysisNote: { type: String },
      healthScore: { type: Number },
    },
    fileUrl: { type: String },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Completed', 'Failed'] },
  },
  { timestamps: true }
);

const SoilReport: Model<ISoilReport> = mongoose.models.SoilReport || mongoose.model<ISoilReport>('SoilReport', SoilReportSchema);

export default SoilReport;
