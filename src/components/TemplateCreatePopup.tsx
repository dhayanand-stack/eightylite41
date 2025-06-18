import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

interface TemplateCreatePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (texts: string[], selectedIndex: number) => void;
  existingTexts?: string[];
  existingSelectedIndex?: number;
}

export const TemplateCreatePopup: React.FC<TemplateCreatePopupProps> = ({
  isOpen,
  onClose,
  onSave,
  existingTexts = [],
  existingSelectedIndex = -1
}) => {
  const [texts, setTexts] = useState<string[]>(existingTexts.length > 0 ? existingTexts : ['']);
  const [selectedIndex, setSelectedIndex] = useState(existingSelectedIndex >= 0 ? existingSelectedIndex : -1);

  useEffect(() => {
    if (isOpen) {
      if (existingTexts.length > 0) {
        setTexts(existingTexts);
        setSelectedIndex(existingSelectedIndex);
      } else {
        setTexts(['']);
        setSelectedIndex(-1);
      }
    }
  }, [isOpen, existingTexts, existingSelectedIndex]);

  if (!isOpen) return null;

  const addText = () => {
    setTexts([...texts, '']);
  };

  const updateText = (index: number, value: string) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  const deleteText = (index: number) => {
    const newTexts = texts.filter((_, i) => i !== index);
    setTexts(newTexts);
    if (selectedIndex === index) {
      setSelectedIndex(-1);
    } else if (selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleSave = () => {
    if (selectedIndex >= 0 && texts[selectedIndex]?.trim()) {
      onSave(texts.filter(t => t.trim()), selectedIndex);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Create Template</h2>
          <button onClick={onClose} className="p-1">
            <X size={20} />
          </button>
        </div>
        
        <div className="text-center mb-4">
          <button
            onClick={addText}
            className="flex items-center justify-center mx-auto p-2 bg-blue-500 text-white rounded"
          >
            <Plus size={16} className="mr-1" />
            Add Text
          </button>
        </div>

        <div className="space-y-2">
          {texts.map((text, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-sm">{index + 1}.</span>
              <input
                type="text"
                value={text}
                onChange={(e) => updateText(index, e.target.value)}
                onClick={() => setSelectedIndex(index)}
                className={`flex-1 p-2 border rounded ${
                  selectedIndex === index ? 'border-green-500 bg-green-50' : 'border-gray-300'
                }`}
                placeholder="Enter text"
              />
              <button
                onClick={() => handleSave()}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                disabled={selectedIndex !== index || !text.trim()}
              >
                Done
              </button>
              <button
                onClick={() => deleteText(index)}
                className="p-1 text-red-500"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {selectedIndex >= 0 && (
          <div className="mt-4">
            <button
              onClick={handleSave}
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Save Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
