import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { ImageArea } from './ImageArea';

interface TextImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (images: string[]) => void;
  existingImages: string[];
  textIndex: number;
}

export const TextImagePopup: React.FC<TextImagePopupProps> = ({
  isOpen,
  onClose,
  onSave,
  existingImages,
  textIndex
}) => {
  const [images, setImages] = useState<string[]>(existingImages);

  useEffect(() => {
    if (isOpen) {
      setImages(existingImages);
    }
  }, [isOpen, existingImages]);

  if (!isOpen) return null;

  const addImage = () => {
    setImages([...images, '']);
  };

  const updateImage = (index: number, image: string) => {
    const newImages = [...images];
    newImages[index] = image;
    setImages(newImages);
  };

  const deleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSave = () => {
    onSave(images.filter(img => img.trim()));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">Manage Images for Text #{textIndex + 1}</h2>
          <div className="flex space-x-2">
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Done
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4 border-b">
          <button
            onClick={addImage}
            className="flex items-center justify-center mx-auto p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Plus size={16} className="mr-1" />
            Create Image
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          <div className="space-y-4">
            {images.map((image, index) => (
              <ImageArea
                key={index}
                image={image}
                onImageChange={(newImage) => updateImage(index, newImage)}
                onDelete={() => deleteImage(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
