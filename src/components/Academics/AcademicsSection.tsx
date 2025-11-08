import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, GraduationCap, Plus, ExternalLink, Trash2, Download } from 'lucide-react';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { AcademicMaterial } from '../../types';
import CreateMaterialModal from './CreateMaterialModal';

const AcademicsSection: React.FC = () => {
  const { currentUser } = useAuth();
  const [materials, setMaterials] = useState<AcademicMaterial[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'PYQ' | 'Solution' | 'Material'>('PYQ');
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [filterSemester, setFilterSemester] = useState<string>('All');

  const isUserSenior = currentUser?.role && ['EB', 'EC', 'Core'].includes(currentUser.role);

  const categories = [
    { name: 'PYQ' as const, icon: FileText, color: 'bg-gradient-to-br from-blue-500 to-blue-600', label: 'Previous Year Papers' },
    { name: 'Solution' as const, icon: BookOpen, color: 'bg-gradient-to-br from-green-500 to-green-600', label: 'Solutions' },
    { name: 'Material' as const, icon: GraduationCap, color: 'bg-gradient-to-br from-purple-500 to-purple-600', label: 'Study Materials' }
  ];

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const q = query(collection(db, 'academics'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const materialList: AcademicMaterial[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      }));
      setMaterials(materialList);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const handleCreateMaterial = (category: 'PYQ' | 'Solution' | 'Material') => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const getMaterialCount = (category: string) => {
    return materials.filter(material => material.category === category).length;
  };

  const getFilteredMaterials = (category: string) => {
    return materials.filter(material => {
      const matchesCategory = material.category === category;
      const matchesSubject = filterSubject === 'All' || material.subject === filterSubject;
      const matchesSemester = filterSemester === 'All' || material.semester === filterSemester;
      return matchesCategory && matchesSubject && matchesSemester;
    });
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await deleteDoc(doc(db, 'academics', materialId));
        fetchMaterials();
      } catch (error) {
        console.error('Error deleting material:', error);
      }
    }
  };

  const subjects = ['All', ...Array.from(new Set(materials.map(m => m.subject).filter(Boolean)))];
  const semesters = ['All', ...Array.from(new Set(materials.map(m => m.semester).filter(Boolean)))];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
      <div className="flex items-center space-x-3 mb-6 px-2 sm:px-0">
        <GraduationCap className="h-8 w-8 text-purple-500" />
        <h2 className="text-2xl sm:text-3xl font-bold text-white dark:text-white text-gray-900">Academics Hub</h2>
      </div>

      {/* Filter Section */}
      <div className="bg-gray-800 dark:bg-gray-800 bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-700 dark:border-gray-700 border-gray-200 mb-6 mx-2 sm:mx-0">
        <h3 className="text-lg font-semibold text-white dark:text-white text-gray-900 mb-4">Filter Materials</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 text-gray-700 mb-2">Subject</label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-700 bg-white border border-gray-600 dark:border-gray-600 border-gray-300 rounded-lg text-white dark:text-white text-gray-900 focus:ring-2 focus:ring-purple-500"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 text-gray-700 mb-2">Semester</label>
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-700 bg-white border border-gray-600 dark:border-gray-600 border-gray-300 rounded-lg text-white dark:text-white text-gray-900 focus:ring-2 focus:ring-purple-500"
            >
              {semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 sm:grid-cols-3 mb-8 px-2 sm:px-0">
        {categories.map(({ name, icon: Icon, color, label }) => {
          const materialCount = getMaterialCount(name);
          const filteredMaterials = getFilteredMaterials(name);

          return (
            <div key={name} className="group">
              {isUserSenior ? (
                <button
                  onClick={() => handleCreateMaterial(name)}
                  className={`w-full ${color} text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <Icon className="h-8 w-8 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-lg text-center">{label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm opacity-75">{materialCount} items</span>
                      <Plus className="h-5 w-5 opacity-75" />
                    </div>
                  </div>
                </button>
              ) : (
                <div className={`w-full ${color} text-white p-6 rounded-xl shadow-lg`}>
                  <div className="flex flex-col items-center space-y-3">
                    <Icon className="h-8 w-8" />
                    <span className="font-bold text-lg text-center">{label}</span>
                    <span className="text-sm opacity-75">{materialCount} items</span>
                  </div>
                </div>
              )}

              {/* Materials List */}
              {filteredMaterials.length > 0 && (
                <div className="mt-4">
                  <details className="group">
                    <summary className="cursor-pointer text-center p-2 bg-gray-700 dark:bg-gray-700 bg-gray-200 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-600 hover:bg-gray-300 transition-colors">
                      <span className="text-white dark:text-white text-gray-900 text-sm">
                        View {filteredMaterials.length} {label}
                      </span>
                    </summary>
                    <div className="mt-2 space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                      {filteredMaterials.map(material => (
                        <div key={material.id} className="bg-gray-800 dark:bg-gray-800 bg-white rounded-lg p-3 hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-50 transition-colors border border-gray-700 dark:border-gray-700 border-gray-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white dark:text-white text-gray-900 font-medium text-sm truncate">{material.title}</h4>
                              <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-xs truncate">{material.description}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {material.subject && (
                                  <span className="px-2 py-0.5 bg-blue-900/30 dark:bg-blue-900/30 bg-blue-100 text-blue-300 dark:text-blue-300 text-blue-700 rounded text-xs">
                                    {material.subject}
                                  </span>
                                )}
                                {material.semester && (
                                  <span className="px-2 py-0.5 bg-green-900/30 dark:bg-green-900/30 bg-green-100 text-green-300 dark:text-green-300 text-green-700 rounded text-xs">
                                    Sem {material.semester}
                                  </span>
                                )}
                                {material.year && (
                                  <span className="px-2 py-0.5 bg-purple-900/30 dark:bg-purple-900/30 bg-purple-100 text-purple-300 dark:text-purple-300 text-purple-700 rounded text-xs">
                                    {material.year}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-500 dark:text-gray-500 text-gray-400 text-xs mt-1">By {material.createdBy}</p>
                            </div>
                            <div className="flex items-center space-x-2 ml-2">
                              <a
                                href={material.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 dark:text-blue-400 text-blue-600 hover:text-blue-300 dark:hover:text-blue-300 hover:text-blue-800 transition-colors"
                                title="Open link"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                              {isUserSenior && (
                                <button
                                  onClick={() => handleDeleteMaterial(material.id)}
                                  className="text-red-400 dark:text-red-400 text-red-600 hover:text-red-300 dark:hover:text-red-300 hover:text-red-800 transition-colors"
                                  title="Delete material"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isUserSenior && (
        <CreateMaterialModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          category={selectedCategory}
          onMaterialCreated={() => {
            fetchMaterials();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AcademicsSection;
