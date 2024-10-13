export interface HistoryItemData {
    id: string;
    name: string;
    base64: string;
}

export interface HistoryProps {
    history: HistoryItemData[];
    onNameChange: (id: string, newName: string) => void;
    onPdfSelect: (base64: string) => void;
    selectedPdfUrl: string | null;
}
