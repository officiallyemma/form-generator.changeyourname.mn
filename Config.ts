import { PDFDocument, PDFForm } from "pdf-lib";

export interface FormGeneratorConfig {
    name: string;
    version: string;
    form: (FormSectionConfig | CommentConfig | FooterConfig)[]
    documents: DocumentConfig[];
    demo?: boolean;
    onload?: () => void;
    onGenerate?: (form: PDFDocument) => void;
}

export interface FooterConfig {
    type: 'footer';
    html: string;
}

export interface CommentConfig {
    type: 'comment';
    html: string;
}

export interface FormSectionConfig {
    type?: 'section'
    headerText: string;
    headerIcon: string;
    fields: Field[];
}

export interface Field {
    id: string;
    label: string | null;
    supportingText: string;
    type: 'text' | 'date' | 'select' | 'tel' | 'email';
    options?: { value: string; label: string }[]; // for select fields
    value?: string; // for pre-filled fields
}

export interface DocumentConfig {
    path: string;
    name: string;
    btnText: string;
    btnIcon: string;
    inputFields: string[];
    pdfFields: { [key: string]: 'text' | 'checkbox' };
    build: (data: { [key: string]: any }) => { [key: string]: any };
}

