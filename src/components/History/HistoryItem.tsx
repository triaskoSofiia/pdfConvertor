import React, {ChangeEvent, FC} from "react";
import { HistoryItemData } from "./interfaces/IHistory.ts";

const HistoryItem: FC<{ item: HistoryItemData }> = ({ item, onNameChange, onPdfSelect}) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onNameChange(item.id, e.target.value);
    };

    return (
        <li className="mb-2 flex items-center">
            <input
                type="text"
                value={item.name}
                onChange={handleChange}
                className="border rounded px-2 py-1 mr-2 flex-grow"
            />
            <button
                onClick={() => onPdfSelect(item.base64)}
                className="text-blue-500 hover:underline cursor-pointer"
            >
                Відкрити
            </button>
        </li>
    );
};

export default HistoryItem;
