export interface EditableRowProps {
    label: string;
    field: string;
    value: string | number | boolean;
    type?: string;
    onSave: (field: string, value: string) => Promise<void>;
}