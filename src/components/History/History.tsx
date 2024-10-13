import React, { FC, ChangeEvent } from 'react';
import { HistoryProps } from "./interfaces/IHistory.ts";
import HistoryItem from "./HistoryItem.tsx";

const History: FC<HistoryProps> = ({ history, onNameChange, onPdfSelect, selectedPdfUrl }) => {
    return (
        <div className="bg-gray-100 p-4 rounded-md shadow-lg mt-20">
            <h2 className="text-xl font-bold mb-4">Історія конвертацій PDF</h2>
            {history.length > 0 ? (
                <ul className="mb-4">
                    {history.map(pdf => (
                        <HistoryItem key={pdf.id} item={pdf} onNameChange={onNameChange} onPdfSelect={onPdfSelect}/>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">Немає конвертованих PDF</p>
            )}
            {selectedPdfUrl && (
                <div className="border rounded-md p-4">
                    <h3 className="text-lg font-bold mb-2">Вибраний PDF</h3>
                    <iframe
                        src={selectedPdfUrl}
                        title="PDF Preview"
                        width="100%"
                        height="600px"
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default History;
