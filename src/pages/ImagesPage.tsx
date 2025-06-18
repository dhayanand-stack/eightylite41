import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ImageArea } from '../components/ImageArea';
import { getProjectData, updateProjectImages } from '../services/firestore';

export const ImagesPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [showImageAreas, setShowImageAreas] = useState(false);

  useEffect(() => {
    if (code) {
      loadProjectData();
    }
  }, [code]);

  const loadProjectData = async () => {
    if (!code) return;
    try {
      const data = await getProjectData(code);
      setImages(data.images);
      setShowImageAreas(data.images.length > 0);
    } catch (error) {
      console.error('Error loading project data:', error);
    }
  };

  const addImage = () => {
    setShowImageAreas(true);
    const newImages = [...images, ''];
    setImages(newImages);
    updateProjectImages(code!, newImages);
  };

  const updateImage = (index: number, image: string) => {
    const newImages = [...images];
    newImages[index] = image;
    setImages(newImages);
    updateProjectImages(code!, newImages);
  };

  const deleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    updateProjectImages(code!, newImages);
    if (newImages.length === 0) {
      setShowImageAreas(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-xl md:text-2xl font-bold">Code: {code}</h1>
          <button
            onClick={() => navigate(`/background/${code}`)}
            className="w-full sm:w-auto bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-600 touch-manipulation"
          >
            Go to Background
          </button>
        </div>

        <div className="space-y-6">
          <button
            onClick={addImage}
            className="w-full sm:w-auto bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 touch-manipulation"
          >
            Add Image
          </button>

          {showImageAreas && (
            <div className="space-y-6">
              {images.map((image, index) => (
                <ImageArea
                  key={index}
                  image={image}
                  onImageChange={(newImage) => updateImage(index, newImage)}
                  onDelete={() => deleteImage(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};