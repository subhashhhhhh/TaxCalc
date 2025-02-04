"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TaxDetails } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, Download, RotateCcw } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface TaxResultsProps {
  results: TaxDetails;
  onReset: () => void;
}

export function TaxResults({ results, onReset }: TaxResultsProps) {
  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Set document properties
    doc.setProperties({
      title: 'TaxCalc - Tax Calculation Report',
      subject: 'Tax Calculation Summary',
      author: 'TaxCalc',
      creator: 'TaxCalc'
    });
    
    // Add title - centered
    doc.setFontSize(24);
    const titleText = "TaxCalc";
    const titleWidth = doc.getStringUnitWidth(titleText) * doc.getFontSize() / doc.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(titleText, titleX, 20);
    
    // Subtitle - centered
    doc.setFontSize(14);
    const subtitleText = "Tax Calculation Report";
    const subtitleWidth = doc.getStringUnitWidth(subtitleText) * doc.getFontSize() / doc.internal.scaleFactor;
    const subtitleX = (pageWidth - subtitleWidth) / 2;
    doc.text(subtitleText, subtitleX, 30);
    
    // Add basic information - centered
    doc.setFontSize(12);
    const incomeText = `Gross Income: ${formatCurrency(results.grossIncome).replace(/[₹,]/g, '')}`;
    const incomeWidth = doc.getStringUnitWidth(incomeText) * doc.getFontSize() / doc.internal.scaleFactor;
    const incomeX = (pageWidth - incomeWidth) / 2;
    doc.text(incomeText, incomeX, 45);
    
    // New Regime Table
    const newRegimeTitle = "New Regime (2025)";
    const newRegimeTitleWidth = doc.getStringUnitWidth(newRegimeTitle) * doc.getFontSize() / doc.internal.scaleFactor;
    const newRegimeTitleX = (pageWidth - newRegimeTitleWidth) / 2;
    doc.text(newRegimeTitle, newRegimeTitleX, 60);

    const newRegimeData = [
      ...results.newRegimeSlabs.map(slab => [
        `${formatCurrency(slab.start).replace(/[₹,]/g, '')} - ${slab.end ? formatCurrency(slab.end).replace(/[₹,]/g, '') : 'Above'}`,
        `${slab.rate}%`,
        formatCurrency(slab.tax).replace(/[₹,]/g, '')
      ]),
      ['Total Tax', '', formatCurrency(results.newRegimeTax).replace(/[₹,]/g, '')]
    ];
    
    (doc as any).autoTable({
      startY: 65,
      head: [["Income Range", "Rate", "Tax"]],
      body: newRegimeData,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 10,
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30 },
        2: { cellWidth: 40 }
      }
    });
    
    // Old Regime Table
    const oldRegimeTitle = "Old Regime (2024)";
    const oldRegimeTitleWidth = doc.getStringUnitWidth(oldRegimeTitle) * doc.getFontSize() / doc.internal.scaleFactor;
    const oldRegimeTitleX = (pageWidth - oldRegimeTitleWidth) / 2;
    doc.text(oldRegimeTitle, oldRegimeTitleX, doc.lastAutoTable.finalY + 20);

    const oldRegimeData = [
      ...results.oldRegimeSlabs.map(slab => [
        `${formatCurrency(slab.start).replace(/[₹,]/g, '')} - ${slab.end ? formatCurrency(slab.end).replace(/[₹,]/g, '') : 'Above'}`,
        `${slab.rate}%`,
        formatCurrency(slab.tax).replace(/[₹,]/g, '')
      ]),
      ['Total Tax', '', formatCurrency(results.oldRegimeTax).replace(/[₹,]/g, '')]
    ];
    
    (doc as any).autoTable({
      startY: doc.lastAutoTable.finalY + 25,
      head: [["Income Range", "Rate", "Tax"]],
      body: oldRegimeData,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 10,
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30 },
        2: { cellWidth: 40 }
      }
    });
    
    // Summary - centered
    const betterRegime = getBetterRegime();
    const recommendationText = `Recommendation: Choose ${betterRegime.regime} Regime to save ${formatCurrency(betterRegime.savings).replace(/[₹,]/g, '')}`;
    const recommendationWidth = doc.getStringUnitWidth(recommendationText) * doc.getFontSize() / doc.internal.scaleFactor;
    const recommendationX = (pageWidth - recommendationWidth) / 2;
    doc.text(recommendationText, recommendationX, doc.lastAutoTable.finalY + 20);
    
    // Add website link - centered
    doc.setTextColor(0, 0, 255);
    doc.setFontSize(10);
    const ctaText = 'Calculate your tax amount at TaxCalc';
    const ctaWidth = doc.getStringUnitWidth(ctaText) * doc.getFontSize() / doc.internal.scaleFactor;
    const ctaX = (pageWidth - ctaWidth) / 2;
    doc.textWithLink(
      ctaText,
      ctaX,
      doc.lastAutoTable.finalY + 30,
      { url: 'https://tax.subhashh.tech' }
    );
    
    doc.save("taxcalc-report.pdf");
  };

  const getBetterRegime = () => {
    if (results.newRegimeTax < results.oldRegimeTax) {
      return {
        regime: "New",
        savings: results.oldRegimeTax - results.newRegimeTax,
      };
    } else {
      return {
        regime: "Old",
        savings: results.newRegimeTax - results.oldRegimeTax,
      };
    }
  };

  const betterRegime = getBetterRegime();

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">New Regime (2025)</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Income Range</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead className="text-right">Tax</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.newRegimeSlabs.map((slab, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {formatCurrency(slab.start)} - {slab.end ? formatCurrency(slab.end) : 'Above'}
                  </TableCell>
                  <TableCell>{slab.rate}%</TableCell>
                  <TableCell className="text-right">{formatCurrency(slab.tax)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} className="font-semibold">Total Tax</TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(results.newRegimeTax)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Old Regime (2024)</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Income Range</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead className="text-right">Tax</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.oldRegimeSlabs.map((slab, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {formatCurrency(slab.start)} - {slab.end ? formatCurrency(slab.end) : 'Above'}
                  </TableCell>
                  <TableCell>{slab.rate}%</TableCell>
                  <TableCell className="text-right">{formatCurrency(slab.tax)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} className="font-semibold">Total Tax</TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(results.oldRegimeTax)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="rounded-lg bg-muted p-6">
        <h3 className="text-lg font-semibold mb-4">Recommendation</h3>
        <div className="flex items-center gap-4 text-lg">
          <span>Choose the</span>
          <span className="font-bold text-primary">{betterRegime.regime} Regime</span>
          <ArrowRight className="h-5 w-5" />
          <span>Save {formatCurrency(betterRegime.savings)} annually</span>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Start New Calculation
        </Button>
        <Button onClick={downloadPDF}>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>
    </div>
  );
}