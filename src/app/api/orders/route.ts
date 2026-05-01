import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const url = new URL(req.url);
    const limitParam = url.searchParams.get('limit');
    let query = Order.find({ user: session.user.id }).sort({ createdAt: -1 });
    
    if (limitParam) {
        query = query.limit(parseInt(limitParam, 10));
    }

    const orders = await query;

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("User orders fetching error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, action } = await req.json();

    if (!orderId || action !== 'cancel') {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if order exists and belongs to the user
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only allow cancellation if order belongs to user OR if user is Admin
    if (order.user.toString() !== session.user.id && session.user.role !== "Admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only allow cancelling if status is Processing
    if (order.status !== 'Processing') {
      return NextResponse.json({ error: "Order cannot be cancelled at this stage" }, { status: 400 });
    }

    order.status = 'Cancelled';
    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Order cancellation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
