import { FileText, Upload, X } from "lucide-react";
import { useState, useEffect } from "react";

interface ImageSelectProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  errorText: string | null;
}

export const ImageSelect: React.FC<ImageSelectProps> = ({ label, onFileSelect, selectedFile, errorText }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
    }
  }, [selectedFile]);

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

  const handleRemoveFile = (event: React.MouseEvent) => {
    event.stopPropagation();
    onFileSelect(null);
  };

  const isImage = selectedFile && selectedFile.type.startsWith('image/');
  const isPDF = selectedFile && selectedFile.type === 'application/pdf';

  return (
    <div className="mb-8">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {label}
      </label>
      <div
        className={`relative border-2 border-dashed rounded-xl text-center hover:border-gray-700 transition-colors ${
          selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-400 bg-gradient-to-br from-blue-50 to-indigo-50'
        } ${isImage ? 'p-2' : 'p-8'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        {isImage && imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Selected image"
              className="w-full h-auto max-h-96 object-contain rounded-lg"
            />
            <button
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors z-20"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {selectedFile.name}
            </div>
          </div>
        ) : selectedFile && isPDF ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <FileText className="w-5 h-5" />
              <span className="font-medium">{selectedFile.name}</span>
            </div>
            <button
              onClick={handleRemoveFile}
              className="absolute top-3 right-3 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors z-20"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Upload className="w-8 h-8 text-black" />
            </div>
            <div className="space-y-2">
              <p className="text-black font-medium">Click here to upload</p>
              <p className="text-sm text-gray-500">Drag and drop files or click to browse</p>
            </div>
          </div>
        )}
      </div>
      {errorText && (
        <label className="block text-sm font-semibold text-red-700 mt-2">
          {errorText}
        </label>
      )}
    </div>
  );
};