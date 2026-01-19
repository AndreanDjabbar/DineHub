import React from "react";
import QRCode from "react-qr-code";
import { FiPrinter } from "react-icons/fi";

interface TableQRProps {
  tableId: string | number;
  tableName: string;
  baseUrl?: string; // e.g., "http://localhost:5173/menu"
}

const TableQR: React.FC<TableQRProps> = ({
  tableId,
  tableName,
  baseUrl = "http://localhost:5173/menu", // Default to local dev frontend
}) => {
  // Construct the URL: e.g., website.com/menu?table=clq2...
  const value = `${baseUrl}?table=${tableId}`;

  const handlePrint = () => {
    // Open a new window to print just the QR code
    const printWindow = window.open("", "", "width=600,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR - ${tableName}</title>
            <style>
              body { 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                height: 100vh; 
                font-family: sans-serif; 
              }
              h1 { margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <h1>${tableName}</h1>
            ${document.getElementById(`qr-svg-${tableId}`)?.outerHTML || ""}
            <p>${value}</p>
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-xl w-full animate-fade-in mt-6">
      <h3 className="text-lg font-bold mb-4 text-gray-800">{tableName}</h3>

      <div
        className="bg-white p-2 rounded shadow-sm border border-gray-100"
        id={`qr-wrapper-${tableId}`}
      >
        <QRCode
          id={`qr-svg-${tableId}`}
          size={150}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={value}
          viewBox={`0 0 256 256`}
        />
      </div>

      <p className="text-xs text-gray-400 mt-2 text-center break-all px-4">
        {value}
      </p>

      <button
        onClick={handlePrint}
        className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition active:scale-95 hover:cursor-pointer"
      >
        <FiPrinter />
        Print QR Code
      </button>
    </div>
  );
};

export default TableQR;
