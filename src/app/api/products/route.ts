import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

// Public route to fetch store products
export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Protected route to create a new store product
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "Admin") {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    const data = await req.json();
    await connectToDatabase();

    const product = await Product.create(data);
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Products POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
