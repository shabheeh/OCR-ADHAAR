import { Eye, FileText, Upload } from "lucide-react";


interface ImageSelectProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  errorText: string | null;
}

export const ImageSelect: React.FC<ImageSelectProps> = ({ label, onFileSelect, selectedFile, errorText }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] || null;
    onFileSelect(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="mb-8">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {label}
      </label>
      <div
        className="relative border-2 border-dashed border-gray-400 rounded-xl p-8 text-center hover:border-gray-700 transition-colors bg-gradient-to-br from-blue-50 to-indigo-50"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Upload className="w-8 h-8 text-black" />
          </div>
          
          {selectedFile ? (
            <div className="flex items-center space-x-2 text-green-600">
              <FileText className="w-5 h-5" />
              <span className="font-medium">{selectedFile.name}</span>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-black font-medium">Click here to upload</p>
              <p className="text-sm text-gray-500">Drag and drop files or click to browse</p>
            </div>
          )}
        </div>
        
        {selectedFile && (
          <div className="absolute top-3 right-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
      <label className="block text-sm font-semibold text-red-700 mb-3">
        {errorText ? errorText : null}
      </label>
    </div>
  );
};