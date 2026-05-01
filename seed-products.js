const mongoose = require('mongoose');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://soiladmin:soilguard2026@ac-7z1y29o-shard-00-00.4p7qzls.mongodb.net:27017,ac-7z1y29o-shard-00-01.4p7qzls.mongodb.net:27017,ac-7z1y29o-shard-00-02.4p7qzls.mongodb.net:27017/soilguard?ssl=true&replicaSet=atlas-2y4q1k-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true },
  stock: { type: Number, default: 100 },
  category: { type: String, default: 'Fertilizer' },
}, { timestamps: true });

// Avoid re-compiling schema if it exists
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const products = [
    { name: "Vermi compost", weight: "250 g", price: 30, img: "https://5.imimg.com/data5/SELLER/Default/2021/2/CU/UB/ZH/5050723/vermi-compost.jpg" },
    { name: "Horn and hoof meal", weight: "100 g", price: 20, img: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=400&auto=format&fit=crop" },
    { name: "Bone Rust", weight: "100 g", price: 20, img: "https://images.immediate.co.uk/production/volatile/sites/10/2019/04/2048x1365-How-to-plant-a-tree-in-a-pot-LI3554444-3e05a52.jpg?quality=90&fit=700,466" },
    { name: "NPK", weight: "250 g", price: 200, img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=400&auto=format&fit=crop" },
    { name: "Vegetable based plant food", weight: "500 g", price: 1000, img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=400&auto=format&fit=crop" },
    { name: "Neem Khali (Neem Cake)", weight: "500 g", price: 60, img: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=400&auto=format&fit=crop" },
    { name: "Epsom Salt (Magnesium)", weight: "400 g", price: 80, img: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=400&auto=format&fit=crop" },
    { name: "Perlite", weight: "500 g", price: 150, img: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=400&auto=format&fit=crop" },
    { name: "DAP Fertilizer", weight: "250 g", price: 40, img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=400&auto=format&fit=crop" },
    { name: "Urea Fertilizer", weight: "500 g", price: 50, img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=400&auto=format&fit=crop" },
    { name: "Cow Dung Manure", weight: "1 kg", price: 40, img: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=400&auto=format&fit=crop" },
    { name: "Humic Acid Liquid", weight: "250 ml", price: 120, img: "https://images.unsplash.com/photo-1599839619722-39751411ea53?q=80&w=400&auto=format&fit=crop" },
    { name: "Wood Ash", weight: "500 g", price: 60, img: "https://images.unsplash.com/photo-1595801931086-538dc660946d?q=80&w=400&auto=format&fit=crop" },
    { name: "Trichoderma Viride", weight: "250 g", price: 100, img: "https://images.unsplash.com/photo-1592982537447-6f2a6a0a4b86?q=80&w=400&auto=format&fit=crop" },
    { name: "Pseudomonas Fluorescens", weight: "250 g", price: 110, img: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=400&auto=format&fit=crop" },
    { name: "Mycorrhiza Powder", weight: "100 g", price: 80, img: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=400&auto=format&fit=crop" }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB...");
    
    await Product.deleteMany({});
    console.log("Cleared existing mock products.");

    await Product.insertMany(products);
    console.log("Successfully seeded", products.length, "native DB products into Atlas!");

    mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
