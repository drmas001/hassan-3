import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import type { ReportData } from '../types/reports';

export function generatePDF(data: ReportData, dateRange: { startDate: Date; endDate: Date }) {
  const doc = new jsPDF();
  const dateFormat = 'MMM dd, yyyy';

  // Title
  doc.setFontSize(20);
  doc.text('ICU Performance Report', 20, 20);

  // Date Range
  doc.setFontSize(12);
  doc.text(
    `Period: ${format(dateRange.startDate, dateFormat)} - ${format(
      dateRange.endDate,
      dateFormat
    )}`,
    20,
    30
  );

  // Key Metrics
  doc.setFontSize(16);
  doc.text('Key Metrics', 20, 45);

  const metricsData = [
    ['Total Patients', data.metrics.totalPatients.toString()],
    ['Critical Cases', data.metrics.criticalCases.toString()],
    ['Average Stay Duration', `${data.metrics.averageStayDuration.toFixed(1)} days`],
    ['Bed Occupancy Rate', `${(data.metrics.bedOccupancyRate * 100).toFixed(1)}%`],
    ['Readmission Rate', `${(data.metrics.readmissionRate * 100).toFixed(1)}%`],
    ['Mortality Rate', `${(data.metrics.mortalityRate * 100).toFixed(1)}%`],
  ];

  autoTable(doc, {
    startY: 50,
    head: [['Metric', 'Value']],
    body: metricsData,
    theme: 'striped',
  });

  // Top Procedures
  doc.setFontSize(16);
  doc.text('Top Procedures', 20, doc.lastAutoTable.finalY + 20);

  const proceduresData = data.activities.topProcedures.map((proc) => [
    proc.name,
    proc.count.toString(),
  ]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 25,
    head: [['Procedure', 'Count']],
    body: proceduresData,
    theme: 'striped',
  });

  // Common Diagnoses
  doc.setFontSize(16);
  doc.text('Common Diagnoses', 20, doc.lastAutoTable.finalY + 20);

  const diagnosesData = data.activities.commonDiagnoses.map((diag) => [
    diag.name,
    diag.count.toString(),
  ]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 25,
    head: [['Diagnosis', 'Count']],
    body: diagnosesData,
    theme: 'striped',
  });

  // Comparative Analysis
  if (data.comparison) {
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Comparative Analysis', 20, 20);

    const comparisonData = [
      [
        'Metric',
        'Current Period',
        'Previous Period',
        'Change',
      ],
      [
        'Total Patients',
        data.metrics.totalPatients.toString(),
        data.comparison.previousPeriod.totalPatients.toString(),
        `${data.comparison.changes.totalPatients}%`,
      ],
      [
        'Critical Cases',
        data.metrics.criticalCases.toString(),
        data.comparison.previousPeriod.criticalCases.toString(),
        `${data.comparison.changes.criticalCases}%`,
      ],
      [
        'Average Stay',
        `${data.metrics.averageStayDuration.toFixed(1)} days`,
        `${data.comparison.previousPeriod.averageStayDuration.toFixed(1)} days`,
        `${data.comparison.changes.averageStayDuration}%`,
      ],
    ];

    autoTable(doc, {
      startY: 25,
      head: [comparisonData[0]],
      body: comparisonData.slice(1),
      theme: 'striped',
    });
  }

  // Save the PDF
  doc.save(`ICU-Report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}