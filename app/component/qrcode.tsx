// src/components/TableQRCode.js
import { Table } from '../model/table';
import { fetchTable } from '../service/table';
import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';


const TableList = () => {
    const [tables, setTables] = useState<Table[]>([]);
  
    useEffect(() => {
      async function loadTables() {
        try {
          const data = await fetchTable(); // Assuming fetchTable() returns the table data
          setTables(data.data); // Storing table data in state
        } catch (error) {
          console.log("Fetching error:", error);
        }
      }
      loadTables();
    }, []);
  
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Table List with QR Codes</h1>
        {tables.length === 0 ? (
          <p className="text-lg text-center text-gray-500">No tables available</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tables.map((table) => (
              <li key={table.id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
                <p className="text-lg font-semibold text-gray-700 mb-4">Table ID: {table.id}</p>
                <div className="flex justify-center">
                  <QRCodeCanvas
                    value={`${process.env.NEXT_PUBLIC_BASE_URL}/pages/menu_items?restaurant_id=${table.restaurant_id}&table_number=${table.table_no}&table_id=${table.id}`}
                    size={128}
                    className="mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">Scan to view menu for Table {table.table_no}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  export default TableList;
