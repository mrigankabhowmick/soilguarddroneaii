import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import connectToDatabase from '@/lib/db';
import SoilReport from '@/models/SoilReport';
import User from '@/models/User'; // needed to populate user ref

// GET /api/reports -> Fetch all reports for the logged in user, or all if Admin
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const url = new URL(req.url);
    const filterUserId = url.searchParams.get('userId');

    let query: any = {};
    
    // If Admin, they can view all, or filter by a specific user
    if (session.user.role === 'Admin') {
      if (filterUserId) query.userId = filterUserId;
    } else {
      // Normal Customers only see their own reports
      query.userId = session.user.id;
    }

    const reports = await SoilReport.find(query).sort({ createdAt: -1 }).populate('userId', 'name email');

    return NextResponse.json({ reports }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching reports', error: error.message }, { status: 500 });
  }
}

// POST /api/reports -> Create a new soil report
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await req.json();

    const { inputs, results, fileUrl } = data;

    const newReport = await SoilReport.create({
      userId: session.user.id,
      inputs: inputs || {},
      results: results || {},
      fileUrl,
      status: 'Completed', 
    });

    return NextResponse.json({ message: 'Report created successfully', report: newReport }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error creating report', error: error.message }, { status: 500 });
  }
}
