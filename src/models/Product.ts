import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    weight: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
    stock: { type: Number, default: 100 },
    category: { type: String, default: 'Fertilizer' },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', productSchema);
