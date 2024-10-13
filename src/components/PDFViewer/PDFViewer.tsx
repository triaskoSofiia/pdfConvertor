import React, { useState, useEffect, FC } from 'react';
import PDFViewer from 'pdf-viewer-reactjs';
import PDFViewerProps from "./interfaces/IPDFViewer.ts";
const PDFViewerComponent: FC<PDFViewerProps> = ({ pdfUrl }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
    }, [pdfUrl]);

    const handleLoadSuccess = () => {
        setLoading(false);
    };

    const handleLoadError = (error: any) => {
        setLoading(false);
        setError('Не вдалося завантажити PDF. Спробуйте ще раз.');
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full h-full relative">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                    <p>Завантаження PDF...</p>
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                    <p className="text-red-500">{error}</p>
                </div>
            )}
            <PDFViewer
                document={{ url: pdfUrl }}
                scale={1.5}
                style={{ overflow: 'auto', height: '100%' }}
                onDocumentLoad={handleLoadSuccess}
                onDocumentError={handleLoadError}
                navbarOnTop
            />
        </div>
    );
};

export default PDFViewerComponent;
