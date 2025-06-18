import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateCodePopup } from '../components/CreateCodePopup';
import { getProjectData } from '../services/firestore';
import { toast } from 'sonner';

export const LandingPage: React.FC = () => {
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [enterCode, setEnterCode] = useState('');
  const [showEnterField, setShowEnterField] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  const handleCreateCode = (code: string) => {
    navigate(`/images/${code}`);
  };

  const handleEnterCode = async () => {
    if (!enterCode.trim()) return;
    
    setIsChecking(true);
    try {
      const data = await getProjectData(enterCode.trim());
      if (data.templates.length === 0) {
        // If the project exists but has no templates, it's a new project
        toast.error('This code does not exist. Please create a new code instead.');
        setShowEnterField(false);
        setEnterCode('');
      } else {
        navigate(`/images/${enterCode.trim()}`);
      }
    } catch (error) {
      toast.error('This code does not exist. Please create a new code instead.');
      setShowEnterField(false);
      setEnterCode('');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-4">
        <button
          onClick={() => setShowCreatePopup(true)}
          className="block w-48 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600"
        >
          Create Code
        </button>
        
        <button
          onClick={() => setShowEnterField(true)}
          className="block w-48 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600"
        >
          Enter Code
        </button>

        {showEnterField && (
          <div className="mt-4 space-y-2">
            <input
              type="text"
              value={enterCode}
              onChange={(e) => setEnterCode(e.target.value)}
              placeholder="Enter existing code"
              className="w-48 p-2 border rounded"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEnterCode();
                }
              }}
            />
            <button
              onClick={handleEnterCode}
              disabled={isChecking}
              className={`block w-48 bg-gray-500 text-white py-2 px-6 rounded ${
                isChecking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
              }`}
            >
              {isChecking ? 'Checking...' : 'Access Code'}
            </button>
          </div>
        )}
      </div>

      <CreateCodePopup
        isOpen={showCreatePopup}
        onClose={() => setShowCreatePopup(false)}
        onCreateCode={handleCreateCode}
      />
    </div>
  );
};
