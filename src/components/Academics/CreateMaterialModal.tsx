import React, { useState } from 'react';
import { X } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';

interface CreateMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: 'PYQ' | 'Solution' | 'Material';
  onMaterialCreated: () => void;
}

const CreateMaterialModal: React.FC<CreateMaterialModalProps> = ({
  isOpen,
  onClose,
  category,
  onMaterialCreated
}) => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'academics'), {
        title,
        description,
        url,
        category,
        subject: subject || null,
        semester: semester || null,
        year: year || null,
        createdBy: currentUser.name,
        createdAt: new Date()
      });

      onMaterialCreated();
      onClose();

      setTitle('');
      setDescription('');
      setUrl('');
      setSubject('');
      setSemester('');
      setYear('');
    } catch (error) {
      console.error('Error creating material:', error);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  const getCategoryLabel = () => {
    switch (category) {
      case 'PYQ': return 'Previous Year Paper';
      case 'Solution': return 'Solution';
      case 'Material': return 'Study Material';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 dark:bg-gray-800 bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white dark:text-white text-gray-900">Add {getCategoryLabel()}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-400 text-gray-500 hover:text-white dark:hover:text-white hover:text-gray-900 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-700 bg-white border border-gray-600 dark:border-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white dark:text-white text-gray-900"
              placeholder="e.g., Mathematics Mid-Term 2023"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-700 bg-white border border-gray-600 dark:border-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white dark:text-white text-gray-900"
              placeholder="Brief description of the material"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 text-gray-700 mb-1">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-700 bg-white border border-gray-600 dark:border-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white dark:text-white text-gray-900"
              placeholder="https://drive.google.com/..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 text-gray-700 mb-1">
              Subject (Optional)
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-700 bg-white border border-gray-600 dark:border-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white dark:text-white text-gray-900"
              placeholder="e.g., Mathematics, Physics"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 text-gray-700 mb-1">
                Semester (Optional)
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-700 bg-white border border-gray-600 dark:border-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white dark:text-white text-gray-900"
                placeholder="e.g., 1, 2, 3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 text-gray-700 mb-1">
                Year (Optional)
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-700 bg-white border border-gray-600 dark:border-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white dark:text-white text-gray-900"
                placeholder="e.g., 2023, 2024"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-600 dark:border-gray-600 border-gray-300 text-gray-300 dark:text-gray-300 text-gray-700 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMaterialModal;
