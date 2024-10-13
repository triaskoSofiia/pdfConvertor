import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { TextConverter } from '../components/TextConverter/TextConverter';

describe('TextConverter Component', () => {
    let onPdfConverted: jest.Mock;

    beforeEach(() => {
        onPdfConverted = jest.fn();
        global.fetch = jest.fn();
        global.URL.createObjectURL = jest.fn(() => 'blob:mockedurl');
        global.URL.revokeObjectURL = jest.fn();
        window.alert = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
        delete global.fetch;
        delete global.URL.createObjectURL;
        delete global.URL.revokeObjectURL;
    });

    it('renders without crashing', () => {
        render(<TextConverter onPdfConverted={onPdfConverted} />);
        expect(screen.getByText('Конвертація тексту в PDF')).toBeInTheDocument();
    });

    it('updates textarea value when user types', () => {
        render(<TextConverter onPdfConverted={onPdfConverted} />);
        const textarea = screen.getByPlaceholderText('Введіть текст');
        fireEvent.change(textarea, { target: { value: 'Hello, world!' } });
        expect(textarea).toHaveValue('Hello, world!');
    });

    it('disables convert button when there is no text', () => {
        render(<TextConverter onPdfConverted={onPdfConverted} />);
        const button = screen.getByText('Конвертувати в PDF') as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    it('enables convert button when there is text', () => {
        render(<TextConverter onPdfConverted={onPdfConverted} />);
        const textarea = screen.getByPlaceholderText('Введіть текст');
        fireEvent.change(textarea, { target: { value: 'Test text' } });
        const button = screen.getByText('Конвертувати в PDF') as HTMLButtonElement;
        expect(button.disabled).toBe(false);
    });

    it('displays loading message when PDF is generating', async () => {
        (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Fetch never resolves

        render(<TextConverter onPdfConverted={onPdfConverted} />);
        const textarea = screen.getByPlaceholderText('Введіть текст');
        fireEvent.change(textarea, { target: { value: 'Test text' } });

        const button = screen.getByText('Конвертувати в PDF');
        fireEvent.click(button);

        expect(button).toHaveTextContent('Конвертація...');
        expect(button).toBeDisabled();
        expect(screen.getByText('Зачекайте, PDF генерується...')).toBeInTheDocument();
    });

    it('starts conversion process when button is clicked', async () => {
        const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            blob: () => Promise.resolve(mockBlob),
        });

        render(<TextConverter onPdfConverted={onPdfConverted} />);
        const textarea = screen.getByPlaceholderText('Введіть текст');
        fireEvent.change(textarea, { target: { value: 'Test text' } });

        const button = screen.getByText('Конвертувати в PDF');
        fireEvent.click(button);

        expect(button).toHaveTextContent('Конвертація...');
        expect(button).toBeDisabled();
        expect(screen.getByText('Зачекайте, PDF генерується...')).toBeInTheDocument();

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        await waitFor(() => expect(button).toHaveTextContent('Конвертувати в PDF'));
        expect(button).not.toBeDisabled();
        expect(screen.queryByText('Зачекайте, PDF генерується...')).not.toBeInTheDocument();

        expect(onPdfConverted).toHaveBeenCalledWith('blob:mockedurl');

        expect(screen.getByText('Відкрити PDF в новій вкладці')).toBeInTheDocument();
        expect(screen.getByTitle('PDF Preview')).toHaveAttribute('src', 'blob:mockedurl');
    });

    it('displays an error message when conversion fails', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
        });

        render(<TextConverter onPdfConverted={onPdfConverted} />);
        const textarea = screen.getByPlaceholderText('Введіть текст');
        fireEvent.change(textarea, { target: { value: 'Test text' } });

        const button = screen.getByText('Конвертувати в PDF');
        fireEvent.click(button);

        expect(button).toHaveTextContent('Конвертація...');
        expect(button).toBeDisabled();

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        await waitFor(() => expect(button).toHaveTextContent('Конвертувати в PDF'));
        expect(button).not.toBeDisabled();

        expect(window.alert).toHaveBeenCalledWith('Не вдалося створити PDF. Спробуйте ще раз.');
    });

    it('displays message when PDF is not ready', () => {
        render(<TextConverter onPdfConverted={onPdfConverted} />);
        expect(screen.getByText('PDF буде тут...')).toBeInTheDocument();
    });
});
