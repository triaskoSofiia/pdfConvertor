import React, { useState, useEffect } from 'react';
import { TextConverter } from '../components/TextConverter/TextConverter';
import History from '../components/History/History';
import { LOCAL_STORAGE_KEY}  from "../costants/general.ts";

interface HistoryItemData {
    id: string;
    name: string;
    base64: string;
}

const HomePage: React.FC = () => {
    const getStoredHistory = (): HistoryItemData[] => {
        const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedHistory ? JSON.parse(storedHistory) : [];
    };

    const [history, setHistory] = useState<HistoryItemData[]>(getStoredHistory);
    const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);

    useEffect(() => {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
    }, [history]);

    const handlePdfConverted = (pdfBlobUrl: string) => {
        fetch(pdfBlobUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result as string;
                    const newHistoryItem: HistoryItemData = {
                        id: new Date().toISOString(),
                        name: `PDF-${history.length + 1}`,
                        base64: base64data,
                    };
                    setHistory((prevHistory) => [...prevHistory, newHistoryItem]);
                };
                reader.readAsDataURL(blob);
            })
            .catch((error) => console.error('Error processing PDF:', error));
    };

    const handleNameChange = (id: string, newName: string) => {
        setHistory((prevHistory) =>
            prevHistory.map((item) =>
                item.id === id ? { ...item, name: newName } : item
            )
        );
    };

    const handlePdfSelect = (base64: string) => {
        setSelectedPdfUrl(base64);
    };

    return (
        <div className="container mx-auto p-4">
            <TextConverter onPdfConverted={handlePdfConverted} />
            <History
                history={history}
                onNameChange={handleNameChange}
                onPdfSelect={handlePdfSelect}
                selectedPdfUrl={selectedPdfUrl}
            />
        </div>
    );
};

export default HomePage;
