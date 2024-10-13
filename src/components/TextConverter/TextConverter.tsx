import React, { useState, useRef } from 'react';
import TextConverterProps from "./interfaces/IPDFViewer";
import { mainUrl } from "../../costants/general";

export const TextConverter: React.FC<TextConverterProps> = ({ onPdfConverted }) => {
    const [text, setText] = useState<string>('');
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const previousBlobUrl = useRef<string>('');

    const convertToPDF = async (inputText: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(
                mainUrl,
                {
                    method: 'POST',
                    body: JSON.stringify({ text: inputText }),
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const pdfBlob = await response.blob();
            const blobUrl = URL.createObjectURL(pdfBlob);

            if (previousBlobUrl.current) {
                URL.revokeObjectURL(previousBlobUrl.current);
            }

            previousBlobUrl.current = blobUrl;
            setPdfBlobUrl(blobUrl);
            onPdfConverted(blobUrl);
        } catch (error) {
            alert('Не вдалося створити PDF. Спробуйте ще раз.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConvertClick = () => {
        if (!isLoading && text.trim()) {
            convertToPDF(text);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
                <h2 className="text-5xl font-bold mb-8 text-center">Конвертація тексту в PDF</h2>
                <textarea
                    className="w-full h-64 p-4 mb-6 border-2 border-transparent rounded-lg text-black focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
                    placeholder="Введіть текст"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button
                    className={`w-full bg-gradient-to-r from-green-500 to-teal-500 text-black font-semibold py-3 rounded-lg hover:shadow-xl transform transition duration-300 hover:scale-105 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handleConvertClick}
                    disabled={isLoading || !text.trim()}
                >
                    {isLoading ? 'Конвертація...' : 'Конвертувати в PDF'}
                </button>
            </div>
            <div className="w-full">
                {isLoading ? (
                    <p>Зачекайте, PDF генерується...</p>
                ) : pdfBlobUrl ? (
                    <>
                        <a href={pdfBlobUrl} target="_blank" rel="noopener noreferrer" className="text-red-500">
                            Відкрити PDF в новій вкладці
                        </a>

                        <iframe
                            src={pdfBlobUrl}
                            title="PDF Preview"
                            width="100%"
                            height="600px"
                            onLoad={() => console.log('PDF loaded successfully')}
                        ></iframe>
                    </>
                ) : (
                    <p>PDF буде тут...</p>
                )}
            </div>
        </div>
    );
};
