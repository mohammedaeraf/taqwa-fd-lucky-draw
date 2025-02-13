import React, { useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";

interface Winner {
  slNo: number;
  name: string;
  accountNo: string;
  token: number;
}

export default function CSVToJson() {
  const [data, setData] = useState<Winner[]>([]);

  // Function to handle CSV file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const formattedData = result.data.map((row: any, index: number) => ({
          slNo: Number(row["slNo"]) || index + 1, // Assign index if Sl No is missing
          name: row["name"],
          accountNo: row["accountNo"],
          token: Number(row["token"]),
        }));
        setData(formattedData);
      },
    });
  };

  // Function to export JSON file
  const exportToJson = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    saveAs(blob, "winners.json");
  };

  return (
    <div className="container mt-4">
      <h2>Upload CSV & Export as JSON</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="form-control mb-3"
      />

      {data.length > 0 && (
        <>
          <button onClick={exportToJson} className="btn btn-success">
            Download JSON
          </button>
          <pre className="mt-3">{JSON.stringify(data, null, 2)}</pre>
        </>
      )}
    </div>
  );
}
