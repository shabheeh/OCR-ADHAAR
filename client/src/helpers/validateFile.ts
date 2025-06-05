const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const validateFile = (file: File | null): string | null => {
  if (!file) return "image is missing.";
  if (!ALLOWED_TYPES.includes(file.type))
    return `must be a JPG, PNG, or WEBP image.`;
  if (file.size > MAX_FILE_SIZE) return "must be less than 5MB.";
  return null;
};
