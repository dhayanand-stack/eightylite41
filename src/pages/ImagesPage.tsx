
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
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Code: {code}</h1>
          <button
            onClick={() => navigate(`/background/${code}`)}
            className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
          >
            Go to Background
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={addImage}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Add Image
          </button>

          {showImageAreas && (
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
          )}
        </div>
      </div>
    </div>
  );
};
