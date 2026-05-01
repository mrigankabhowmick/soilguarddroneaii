import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { items, totalAmount, customerInfo, shippingAddress } = body;

    await connectToDatabase();

    // If user is logged in, attach to user. If guest, you could handle it differently.
    // For now, let's assume they MUST be logged in, or we attach it to a default Guest object.
    // To keep it simple, if no session, we return 401. Or we can just allow Guest checkouts.
    // Let's enforce login for checkout to map strictly to Admin orders.
    if (!session || !session.user?.id) {
       return NextResponse.json({ error: "You must be logged in to checkout" }, { status: 401 });
    }

    const newOrder = await Order.create({
      user: session.user.id,
      items: items.map((item: any) => ({
         productId: item.id.toString(),
         name: item.name,
         quantity: item.quantity,
         price: item.price
      })),
      totalAmount,
      customerInfo,
      shippingAddress,
      status: 'Processing'
    });

    return NextResponse.json({ success: true, orderId: newOrder._id });

  } catch (error: any) {
    console.error("Checkout processing error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
