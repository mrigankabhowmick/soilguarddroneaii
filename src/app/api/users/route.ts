import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

// GET /api/users -> Admin fetches all users, or user fetches their own profile
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    if (session.user.role === 'Admin') {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return NextResponse.json({ users }, { status: 200 });
    } else {
      const user = await User.findById(session.user.id).select('-password');
      return NextResponse.json({ user }, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching users', error: error.message }, { status: 500 });
  }
}

// PUT /api/users -> Admin can update user role
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'Admin') {
      return NextResponse.json({ message: 'Unauthorized (Admin only)' }, { status: 403 });
    }

    await connectToDatabase();
    const data = await req.json();
    const { userId, role } = data;

    if (!userId || !role) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');

    return NextResponse.json({ message: 'User role updated', user: updatedUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error updating user role', error: error.message }, { status: 500 });
  }
}

// DELETE /api/users -> Admin deletes user
export async function DELETE(req: Request) {
  try {
      const session = await getServerSession(authOptions);

      if (!session || !session.user || session.user.role !== 'Admin') {
        return NextResponse.json({ message: 'Unauthorized (Admin only)' }, { status: 403 });
      }

      await connectToDatabase();
      const url = new URL(req.url);
      const userId = url.searchParams.get('userId');

      if (!userId) {
        return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
      }

      await User.findByIdAndDelete(userId);
      return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error: any) {
      return NextResponse.json({ message: 'Error deleting user', error: error.message }, { status: 500 });
  }
}
