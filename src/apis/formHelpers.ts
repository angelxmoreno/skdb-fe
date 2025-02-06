/**
 * Recursively checks if the given data contains a File instance.
 *
 * @param data - The data to inspect.
 * @returns True if a File instance is found; otherwise, false.
 */
function containsFile(data: unknown): boolean {
    if (data instanceof File) return true;
    if (data !== null && typeof data === 'object') {
        if (Array.isArray(data)) {
            return data.some((item) => containsFile(item));
        } else {
            return Object.values(data).some((value) => containsFile(value));
        }
    }
    return false;
}

/**
 * Recursively appends the provided data to a FormData instance.
 *
 * The parentKey parameter helps to build nested keys for objects or arrays.
 * If parentKey is provided, it represents the current path (using bracket notation)
 * to the data being appended.
 *
 * @param formData - The FormData object to append to.
 * @param data - The data to append.
 * @param parentKey - The key prefix for nested fields.
 */
function appendFormData(formData: FormData, data: unknown, parentKey: string | null = null): void {
    if (data instanceof File) {
        // Append the File, supplying its name so the backend can use it as an UploadFile.
        formData.append(parentKey as string, data, data.name);
    } else if (data instanceof Date) {
        // Convert Date objects to ISO strings.
        formData.append(parentKey as string, data.toISOString());
    } else if (data !== null && typeof data === 'object') {
        if (Array.isArray(data)) {
            data.forEach((item, index) => {
                const key = parentKey ? `${parentKey}[${index}]` : `${index}`;
                appendFormData(formData, item, key);
            });
        } else {
            Object.entries(data).forEach(([key, value]) => {
                const newKey = parentKey ? `${parentKey}[${key}]` : key;
                appendFormData(formData, value, newKey);
            });
        }
    } else if (parentKey) {
        // For primitive values, append them as strings (or empty string for null).
        formData.append(parentKey, data === null ? '' : String(data));
    }
}

const formHelpers = {containsFile, appendFormData}
export default formHelpers;