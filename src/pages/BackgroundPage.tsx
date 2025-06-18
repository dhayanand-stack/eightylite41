import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Edit, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import { TemplateCreatePopup } from '../components/TemplateCreatePopup';
import { TextImagePopup } from '../components/TextImagePopup';
import { getProjectData, updateProjectTemplates, deleteProject } from '../services/firestore';
import { Template } from '../types';

export const BackgroundPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<number | null>(null);
  const [selectedTemplateForImages, setSelectedTemplateForImages] = useState<number | null>(null);
  const [selectedTextIndex, setSelectedTextIndex] = useState<number | null>(null);
  const [insertionIndex, setInsertionIndex] = useState<number | null>(null);

  useEffect(() => {
    if (code) {
      loadProjectData();
    }
  }, [code]);

  const loadProjectData = async () => {
    if (!code) return;
    try {
      const data = await getProjectData(code);
      // Initialize textImages if not present
      const templatesWithImages = data.templates.map(template => ({
        ...template,
        textImages: template.textImages || {}
      }));
      setTemplates(templatesWithImages);
    } catch (error) {
      console.error('Error loading project data:', error);
    }
  };

  const saveTemplate = (texts: string[], selectedIndex: number) => {
    if (editingTemplate !== null) {
      // Edit existing template
      const newTemplates = [...templates];
      newTemplates[editingTemplate] = {
        ...newTemplates[editingTemplate],
        texts,
        selectedIndex,
        textImages: newTemplates[editingTemplate].textImages || {}
      };
      setTemplates(newTemplates);
      updateProjectTemplates(code!, newTemplates);
    } else {
      // Create new template
      const newTemplate: Template = {
        id: templates.length + 1,
        texts,
        selectedIndex,
        textImages: {}
      };
      let newTemplates;
      if (insertionIndex !== null) {
        newTemplates = [
          ...templates.slice(0, insertionIndex + 1),
          newTemplate,
          ...templates.slice(insertionIndex + 1)
        ];
      } else {
        newTemplates = [...templates, newTemplate];
      }
      // Renumber templates
      const renumberedTemplates = newTemplates.map((template, i) => ({
        ...template,
        id: i + 1
      }));
      setTemplates(renumberedTemplates);
      updateProjectTemplates(code!, renumberedTemplates);
    }
    setEditingTemplate(null);
    setInsertionIndex(null);
  };

  const deleteTemplate = (index: number) => {
    const newTemplates = templates.filter((_, i) => i !== index);
    // Renumber templates
    const renumberedTemplates = newTemplates.map((template, i) => ({
      ...template,
      id: i + 1
    }));
    setTemplates(renumberedTemplates);
    updateProjectTemplates(code!, renumberedTemplates);
  };

  const navigateText = (templateIndex: number, direction: 'prev' | 'next') => {
    const template = templates[templateIndex];
    let newIndex = template.selectedIndex;
    
    if (direction === 'prev') {
      newIndex = newIndex > 0 ? newIndex - 1 : 0;
    } else {
      newIndex = newIndex < template.texts.length - 1 ? newIndex + 1 : template.texts.length - 1;
    }

    const newTemplates = [...templates];
    newTemplates[templateIndex] = { ...template, selectedIndex: newIndex };
    setTemplates(newTemplates);
    updateProjectTemplates(code!, newTemplates);
  };

  const editTemplate = (index: number) => {
    setEditingTemplate(index);
    setShowCreatePopup(true);
  };

  const createNewTemplate = (afterIndex?: number) => {
    setEditingTemplate(null);
    setShowCreatePopup(true);
    if (afterIndex !== undefined) {
      setInsertionIndex(afterIndex);
    } else {
      setInsertionIndex(null);
    }
  };

  const openImageManager = (templateIndex: number, textIndex: number) => {
    setSelectedTemplateForImages(templateIndex);
    setSelectedTextIndex(textIndex);
    setShowImagePopup(true);
  };

  const saveTemplateImages = (images: string[]) => {
    if (selectedTemplateForImages !== null && selectedTextIndex !== null) {
      const newTemplates = [...templates];
      const template = newTemplates[selectedTemplateForImages];
      template.textImages = {
        ...template.textImages,
        [selectedTextIndex]: images
      };
      setTemplates(newTemplates);
      updateProjectTemplates(code!, newTemplates);
    }
    setSelectedTemplateForImages(null);
    setSelectedTextIndex(null);
  };

  const handleDeleteProject = async () => {
    if (!code) return;
    try {
      await deleteProject(code);
      navigate('/'); // Navigate back to home page after deletion
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Background Templates - Code: {code}</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate(`/images/${code}`)}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Back to Images
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 flex items-center"
            >
              <Trash2 size={20} className="mr-2" />
              Delete Project
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <button
              onClick={() => createNewTemplate()}
              className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600"
            >
              <Plus size={24} />
            </button>
          </div>

          {templates.map((template, templateIndex) => (
            <div key={template.id} className="space-y-2">
              <div className="flex items-center space-x-4 p-4 border rounded bg-gray-50">
                <span className="font-bold">#{template.id}</span>
                <button
                  onClick={() => openImageManager(templateIndex, template.selectedIndex)}
                  className="flex-1 text-left p-2 bg-white border rounded hover:bg-gray-100"
                >
                  {template.texts[template.selectedIndex] || 'Empty text'}
                </button>
                <button
                  onClick={() => navigateText(templateIndex, 'prev')}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  onClick={() => navigateText(templateIndex, 'next')}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => deleteTemplate(templateIndex)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => editTemplate(templateIndex)}
                  className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  <Edit size={16} />
                </button>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => createNewTemplate(templateIndex)}
                  className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Delete Project</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this project? This will permanently delete all templates, texts, and images associated with code: <span className="font-bold">{code}</span>. This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        )}

        <TemplateCreatePopup
          isOpen={showCreatePopup}
          onClose={() => {
            setShowCreatePopup(false);
            setEditingTemplate(null);
          }}
          onSave={saveTemplate}
          existingTexts={editingTemplate !== null ? templates[editingTemplate]?.texts : []}
          existingSelectedIndex={editingTemplate !== null ? templates[editingTemplate]?.selectedIndex : -1}
        />

        <TextImagePopup
          isOpen={showImagePopup}
          onClose={() => {
            setShowImagePopup(false);
            setSelectedTemplateForImages(null);
            setSelectedTextIndex(null);
          }}
          onSave={saveTemplateImages}
          existingImages={
            selectedTemplateForImages !== null && selectedTextIndex !== null
              ? templates[selectedTemplateForImages]?.textImages[selectedTextIndex] || []
              : []
          }
          textIndex={selectedTextIndex || 0}
        />
      </div>
    </div>
  );
};
