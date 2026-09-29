import { jsPDF } from 'jspdf';
import { ComicBook, ComicPanel } from '../types/comic';
import { ART_STYLES } from '../utils/comicStyles';

async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  if (!url) return null;
  if (url.startsWith('data:image/')) return url;

  try {
    // Attempt local backend proxy first to avoid CORS issues
    const res = await fetch('/api/comic/proxy-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.dataUrl) return data.dataUrl;
    }
  } catch (e) {
    console.warn('Proxy fetch failed, attempting direct fetch:', e);
  }

  try {
    const directRes = await fetch(url, { mode: 'cors' });
    if (!directRes.ok) return null;
    const blob = await directRes.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn('Failed to load image for PDF:', url, err);
    return null;
  }
}

/**
 * Format timestamp in YYYYMMDD_HHMMSS
 */
export function getTimestampString(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

export interface ExportResult {
  filename: string;
  blobUrl: string;
  pageCount: number;
  fileSizeBytes: number;
}

/**
 * Assembles and compiles the full comic into a publication-ready PDF document
 */
export async function exportComicToPdf(
  comic: ComicBook,
  onProgress?: (status: string, percent: number) => void
): Promise<ExportResult> {
  onProgress?.('Initializing comic PDF layout...', 10);

  // A4 dimensions in mm: 210 x 297
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;

  const styleObj = ART_STYLES.find((s) => s.id === comic.artStyle) || ART_STYLES[0];
  const sanitizedTitle = (comic.title || 'My_Comic')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 30);
  const timestamp = getTimestampString();
  const filename = `ComicCraft_${sanitizedTitle}_${timestamp}.pdf`;

  // Pre-load all panel images as data URLs
  onProgress?.('Fetching panel illustrations...', 25);
  const panelDataUrls: Record<string, string | null> = {};
  for (let i = 0; i < comic.panels.length; i++) {
    const p = comic.panels[i];
    onProgress?.(`Loading panel ${i + 1} of ${comic.panels.length}...`, 25 + Math.round((i / comic.panels.length) * 35));
    if (p.imageUrl) {
      panelDataUrls[p.id] = await fetchImageAsDataUrl(p.imageUrl);
    }
  }

  onProgress?.('Rendering Cover Page...', 65);

  // ----------------------------------------------------
  // COVER PAGE
  // ----------------------------------------------------
  // Background
  doc.setFillColor(254, 240, 138); // Yellow comic cover tone
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer framing
  doc.setDrawColor(17, 24, 39);
  doc.setLineWidth(1.8);
  doc.rect(margin - 4, margin - 4, pageWidth - (margin - 4) * 2, pageHeight - (margin - 4) * 2);

  // Header Banner
  doc.setFillColor(239, 68, 68); // Red top banner
  doc.rect(margin, margin, pageWidth - margin * 2, 24, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('COMICCRAFT PRESENTS', pageWidth / 2, margin + 11, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`SPECIAL EDITION • ISSUE #${comic.issue || 1} • ${styleObj.name.toUpperCase()}`, pageWidth / 2, margin + 19, { align: 'center' });

  // Comic Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(17, 24, 39);
  const titleLines = doc.splitTextToSize(comic.title.toUpperCase(), pageWidth - margin * 2 - 10);
  doc.text(titleLines, pageWidth / 2, margin + 42, { align: 'center' });

  if (comic.subtitle) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(75, 85, 99);
    doc.text(comic.subtitle, pageWidth / 2, margin + 54, { align: 'center' });
  }

  // Cover Feature Image (Panel 1 or First Available)
  const coverPanel = comic.panels[0];
  const coverImageData = coverPanel ? panelDataUrls[coverPanel.id] : null;
  const coverImgSize = 120;
  const coverImgX = (pageWidth - coverImgSize) / 2;
  const coverImgY = margin + 64;

  if (coverImageData) {
    try {
      doc.setFillColor(255, 255, 255);
      doc.rect(coverImgX - 2, coverImgY - 2, coverImgSize + 4, coverImgSize + 4, 'FD');
      doc.addImage(coverImageData, 'PNG', coverImgX, coverImgY, coverImgSize, coverImgSize, undefined, 'FAST');
      doc.setDrawColor(17, 24, 39);
      doc.setLineWidth(1.5);
      doc.rect(coverImgX, coverImgY, coverImgSize, coverImgSize);
    } catch (e) {
      console.warn('Cover image render error:', e);
    }
  }

  // Cover Credits & Blurb Box
  const blurbY = coverImgY + coverImgSize + 8;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(17, 24, 39);
  doc.setLineWidth(1.2);
  doc.rect(margin, blurbY, pageWidth - margin * 2, 42, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text(`STARRING: ${comic.characterName.toUpperCase()}`, margin + 6, blurbY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99);
  const promptLines = doc.splitTextToSize(`Premise: "${comic.storyPrompt}"`, pageWidth - margin * 2 - 12);
  doc.text(promptLines.slice(0, 3), margin + 6, blurbY + 16);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.text(`Setting: ${comic.setting} | Tone: ${comic.tone.toUpperCase()} | Generated with ComicCraft AI`, margin + 6, blurbY + 34);

  // ----------------------------------------------------
  // INTERIOR STORY PAGES (2 Panels per page for large readable art, or 4 panels)
  // ----------------------------------------------------
  onProgress?.('Compiling comic story panels...', 80);

  const panelsPerPage = 2; // High quality 2 large panels per interior page for crisp comics
  const totalPages = Math.ceil(comic.panels.length / panelsPerPage);

  for (let pg = 0; pg < totalPages; pg++) {
    doc.addPage();

    // Background
    doc.setFillColor(250, 247, 242);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Page Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(`${comic.title.toUpperCase()} • PAGE ${pg + 1} OF ${totalPages}`, margin, margin - 2);

    const pagePanels = comic.panels.slice(pg * panelsPerPage, (pg + 1) * panelsPerPage);
    const panelBoxHeight = 120;
    const panelBoxWidth = pageWidth - margin * 2;

    for (let pIdx = 0; pIdx < pagePanels.length; pIdx++) {
      const panel = pagePanels[pIdx];
      const panelY = margin + 4 + pIdx * (panelBoxHeight + 10);
      const imgData = panelDataUrls[panel.id];

      // Outer panel frame
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(17, 24, 39);
      doc.setLineWidth(1.5);
      doc.rect(margin, panelY, panelBoxWidth, panelBoxHeight, 'FD');

      // Left side: Illustration (square)
      const imgW = 104;
      const imgH = 104;
      const imgX = margin + 6;
      const imgY = panelY + 8;

      if (imgData) {
        try {
          doc.addImage(imgData, 'PNG', imgX, imgY, imgW, imgH, undefined, 'FAST');
          doc.setDrawColor(17, 24, 39);
          doc.setLineWidth(1.0);
          doc.rect(imgX, imgY, imgW, imgH);
        } catch (e) {
          console.warn('Panel image render error:', e);
        }
      } else {
        doc.setFillColor(243, 244, 246);
        doc.rect(imgX, imgY, imgW, imgH, 'F');
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        doc.setTextColor(156, 163, 175);
        doc.text('Illustration Preview', imgX + imgW / 2, imgY + imgH / 2, { align: 'center' });
      }

      // Panel Number Badge
      doc.setFillColor(239, 68, 68);
      doc.rect(margin, panelY, 12, 10, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`#${panel.panelNumber}`, margin + 6, panelY + 7, { align: 'center' });

      // Right side: Narration and Dialogue Box
      const rightX = imgX + imgW + 6;
      const rightW = panelBoxWidth - (imgW + 18);

      // Narration Box
      if (panel.narration) {
        doc.setFillColor(254, 240, 138); // Yellow comic caption
        doc.setDrawColor(17, 24, 39);
        doc.setLineWidth(0.8);
        doc.rect(rightX, imgY, rightW, 26, 'FD');

        doc.setFont('helvetica', 'bolditalic');
        doc.setFontSize(8.5);
        doc.setTextColor(17, 24, 39);
        const narrLines = doc.splitTextToSize(panel.narration, rightW - 6);
        doc.text(narrLines.slice(0, 3), rightX + 3, imgY + 7);
      }

      // Dialogues / Speech Bubbles
      let currentDiagY = imgY + 32;
      const dialogues = panel.dialogues || [];
      for (const diag of dialogues.slice(0, 2)) {
        // Speech Bubble Box
        const bubbleHeight = 28;
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(17, 24, 39);
        doc.setLineWidth(0.8);
        doc.roundedRect(rightX, currentDiagY, rightW, bubbleHeight, 3, 3, 'FD');

        // Speaker name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(220, 38, 38);
        doc.text(`${diag.speaker.toUpperCase()}:`, rightX + 4, currentDiagY + 6);

        // Text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(17, 24, 39);
        const diagLines = doc.splitTextToSize(`"${diag.text}"`, rightW - 8);
        doc.text(diagLines.slice(0, 3), rightX + 4, currentDiagY + 13);

        currentDiagY += bubbleHeight + 5;
      }

      // Sound Effect Callout if present
      if (panel.soundEffect) {
        doc.setFillColor(250, 204, 21);
        doc.setDrawColor(17, 24, 39);
        doc.setLineWidth(1.2);
        doc.rect(rightX, currentDiagY, rightW, 14, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(185, 28, 28);
        doc.text(panel.soundEffect.toUpperCase(), rightX + rightW / 2, currentDiagY + 9.5, { align: 'center' });
      }
    }
  }

  onProgress?.('Generating PDF file...', 95);

  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);
  const fileSizeBytes = pdfBlob.size;

  // Trigger download automatically
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  onProgress?.('Complete!', 100);

  return {
    filename,
    blobUrl,
    pageCount: totalPages + 1, // Cover + interior pages
    fileSizeBytes,
  };
}
