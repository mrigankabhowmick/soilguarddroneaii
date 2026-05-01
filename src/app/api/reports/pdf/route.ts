import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import PDFDocument from 'pdfkit';
import connectToDatabase from '@/lib/db';
import SoilReport from '@/models/SoilReport';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const reportId = url.searchParams.get('reportId');

    if (!reportId) {
      return NextResponse.json({ message: 'Missing reportId' }, { status: 400 });
    }

    await connectToDatabase();
    const report = await SoilReport.findById(reportId);

    if (!report) {
       return NextResponse.json({ message: 'Report not found' }, { status: 404 });
    }

    if (report.userId.toString() !== session.user.id && session.user.role !== 'Admin') {
       return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Generate PDF
    const doc = new PDFDocument();
    
    // Create a Promise to handle the stream
    const chunks: Uint8Array[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    
    doc.fontSize(25).text('Soil Guard Analysis Report', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(14).text(`Date: ${new Date(report.timestamp).toLocaleString()}`);
    doc.text(`Status: ${report.status}`);
    doc.moveDown();
    
    doc.fontSize(18).text('Input Metrics:');
    doc.fontSize(12).text(`Nitrogen (N): ${report.inputs.nitrogen}`);
    doc.text(`Phosphorus (P): ${report.inputs.phosphorus}`);
    doc.text(`Potassium (K): ${report.inputs.potassium}`);
    doc.text(`pH Level: ${report.inputs.ph}`);
    doc.text(`Temperature: ${report.inputs.temperature}°C`);
    doc.text(`Humidity: ${report.inputs.humidity}%`);
    doc.text(`Rainfall: ${report.inputs.rainfall} mm`);
    doc.moveDown();
    
    doc.fontSize(18).text('Results & Recommendations:');
    doc.fontSize(12).text(`Recommended Crop: ${report.results.recommendedCrop || 'N/A'}`);
    doc.text(`Health Score: ${report.results.healthScore || 'N/A'}/100`);
    doc.text(`Analysis Note: ${report.results.analysisNote || 'N/A'}`);
    
    doc.end();

    const pdfBuffer = await new Promise<Buffer>((resolve) => {
        doc.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
    });

    const response = new NextResponse(new Uint8Array(pdfBuffer));
    response.headers.set('Content-Type', 'application/pdf');
    response.headers.set('Content-Disposition', `attachment; filename=Soil_Report_${report._id}.pdf`);

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: 'Error generating PDF', error: error.message }, { status: 500 });
  }
}
