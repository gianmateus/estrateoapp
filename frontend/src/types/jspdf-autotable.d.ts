import { jsPDF } from 'jspdf';

export interface AutoTableOptions {
  startY?: number;
  head?: string[][];
  body?: string[][];
  theme?: string;
}

export interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: AutoTableOptions) => void;
  lastAutoTable: {
    finalY: number;
  };
}

declare module 'jspdf-autotable' {
  export { AutoTableOptions, jsPDFWithAutoTable };
} 