import React, { useRef } from 'react';

interface ImageAreaProps {
  image?: string;
  onImageChange: (image: string) => void;
  onDelete: () => void;
}

export const ImageArea: React.FC<ImageAreaProps> = ({ image, onImageChange, onDelete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSelected, setIsSelected] = React.useState(false);

  const handleClick = () => {
    setIsSelected(true);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              onImageChange(e.target.result as string);
            }
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <div className="relative">
      <div
        className={`border-2 border-dashed p-4 min-h-48 md:min-h-64 flex flex-col items-center justify-center cursor-pointer touch-manipulation ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onClick={handleClick}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        tabIndex={0}
      >
        {image ? (
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={image} 
              alt="Uploaded" 
              className="max-w-full max-h-full object-contain rounded"
              style={{ 
                maxHeight: '400px',
                width: 'auto',
                height: 'auto'
              }}
            />
          </div>
        ) : (
          <div className="text-center p-4">
            {isSelected ? (
              <div className="space-y-4">
                <p className="text-gray-600 mb-4 text-sm md:text-base">Now you can paste an image or click upload button below</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileUpload();
                  }}
                  className="text-blue-500 underline text-lg py-2 px-4 touch-manipulation"
                >
                  Click to upload
                </button>
              </div>
            ) : (
              <p className="text-gray-600 text-sm md:text-base">Image - Click to select, then paste or upload</p>
            )}
          </div>
        )}
      </div>
      
      {image && (
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          Delete
        </button>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};