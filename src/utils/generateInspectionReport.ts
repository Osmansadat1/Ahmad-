import { jsPDF } from 'jspdf';
import { ReversibilityEvaluation } from './reversibilityScore';

export interface InspectionReportOptions {
  roomType: string;
  style: string;
  evaluation: ReversibilityEvaluation;
  presets: string[];
  landlordFilters: string[];
  confirmedClauses?: string[];
}

export function generateMoveOutInspectionReport(options: InspectionReportOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 22;

  // Header background banner
  doc.setFillColor(250, 248, 245); // Alabaster #FAF8F5
  doc.rect(margin, cursorY - 6, contentWidth, 24, 'F');

  // Brand title
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(74, 59, 50); // Deep Walnut #4A3B32
  doc.text('EDEN CANVAS BY WOLD EDEN', margin + 4, cursorY + 4);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(110, 120, 100); // Sage #6E7864
  doc.text('MOVE-OUT REVERSIBILITY & DEPOSIT PROTECTION INSPECTION GUIDE', margin + 4, cursorY + 11);

  cursorY += 28;

  // Metadata row
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(74, 59, 50);
  doc.text(`ROOM: ${options.roomType.toUpperCase()}`, margin, cursorY);
  doc.text(`AESTHETIC: ${options.style.toUpperCase()}`, margin + 60, cursorY);
  doc.text(`DATE GENERATED: ${today}`, margin + 120, cursorY);

  cursorY += 6;
  doc.setDrawColor(232, 226, 216); // Greige line
  doc.setLineWidth(0.5);
  doc.line(margin, cursorY, margin + contentWidth, cursorY);

  cursorY += 10;

  // Reversibility Score Box
  doc.setFillColor(240, 236, 225); // Soft Oat #F0ECE1
  doc.roundedRect(margin, cursorY, contentWidth, 22, 2, 2, 'F');

  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(74, 59, 50);
  doc.text(`LEASE SAFETY INDEX: ${options.evaluation.score} / 100`, margin + 6, cursorY + 9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(198, 156, 109); // Camel #C69C6D
  doc.text(options.evaluation.tierLabel.toUpperCase(), margin + 6, cursorY + 16);

  cursorY += 28;

  // Explanation
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(74, 59, 50);
  const expLines = doc.splitTextToSize(`Summary: ${options.evaluation.explanation}`, contentWidth);
  doc.text(expLines, margin, cursorY);
  cursorY += expLines.length * 4.5 + 4;

  // Tip to reach 100
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(110, 120, 100);
  const tipLines = doc.splitTextToSize(options.evaluation.howToReach100Tip, contentWidth);
  doc.text(tipLines, margin, cursorY);
  cursorY += tipLines.length * 4 + 6;

  // Section: Step-by-Step Removal Instructions
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(74, 59, 50);
  doc.text('Step-by-Step Move-Out Removal Instructions', margin, cursorY);
  cursorY += 6;

  options.evaluation.removalSteps.forEach((step, idx) => {
    if (cursorY > 245) {
      doc.addPage();
      cursorY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(74, 59, 50);
    doc.text(`${idx + 1}. ${step.item} [${step.category.toUpperCase()}]`, margin, cursorY);
    cursorY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 95, 90);
    const stepText = doc.splitTextToSize(step.instructions, contentWidth - 4);
    doc.text(stepText, margin + 4, cursorY);
    cursorY += stepText.length * 4 + 4;
  });

  // Additional detected lease constraints if present
  if (options.confirmedClauses && options.confirmedClauses.length > 0) {
    if (cursorY > 235) {
      doc.addPage();
      cursorY = 20;
    }

    cursorY += 4;
    doc.setFont('times', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(74, 59, 50);
    doc.text('Active Lease Constraints Enforced in Design', margin, cursorY);
    cursorY += 5;

    options.confirmedClauses.forEach((clause) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(110, 120, 100);
      const lines = doc.splitTextToSize(`• ${clause}`, contentWidth - 4);
      doc.text(lines, margin + 2, cursorY);
      cursorY += lines.length * 3.5 + 2;
    });
  }

  // Legal Disclaimer Box (Compulsory exact copy)
  cursorY = Math.max(cursorY + 6, 255);
  if (cursorY > 265) {
    doc.addPage();
    cursorY = 250;
  }

  doc.setDrawColor(198, 156, 109);
  doc.setLineWidth(0.4);
  doc.setFillColor(250, 248, 245);
  doc.roundedRect(margin, cursorY, contentWidth, 22, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(198, 156, 109);
  doc.text('IMPORTANT LEGAL & RENTAL NOTICE', margin + 4, cursorY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(74, 59, 50);
  const disclaimer =
    'Reference document only. It is not legal advice or a binding agreement. Check your lease and talk to your landlord.';
  doc.text(disclaimer, margin + 4, cursorY + 12);

  doc.setFontSize(6.5);
  doc.setTextColor(140, 130, 120);
  doc.text(
    'Eden Canvas by Wold Eden provides conceptual spatial visualizations. Physical removal results depend on wall paint quality and moisture.',
    margin + 4,
    cursorY + 17
  );

  const filename = `Eden-Canvas-Inspection-Report-${options.roomType.replace(/\s+/g, '-')}.pdf`;
  doc.save(filename);
}
