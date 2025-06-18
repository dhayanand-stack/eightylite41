
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateCodePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCode: (code: string) => void;
}

export const CreateCodePopup: React.FC<CreateCodePopupProps> = ({
  isOpen,
  onClose,
  onCreateCode
}) => {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (code.trim()) {
      onCreateCode(code.trim());
      setCode('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Create Code</h2>
          <button onClick={onClose} className="p-1">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code (e.g., F78j87I)"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
