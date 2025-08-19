import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Plus, Calendar, Users, FileText, Trash2 } from 'lucide-react';
import EventCard from './EventCard';
import AnnouncementCard from './AnnouncementCard';
import ResourcesSection from './ResourcesSection';
import CreateEventModal from './CreateEventModal';
import CreateAnnouncementModal from './CreateAnnouncementModal';
import CreateResourceModal from './CreateResourceModal';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  date: string;
}

interface Resource {
  id: string;
  title: string;
  type: 'document' | 'link' | 'video';
  url: string;
  description: string;
}

const SeniorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Annual Tech Conference',
      date: '2024-02-15',
      time: '10:00 AM',
      location: 'Main Auditorium',
      description: 'Join us for our biggest tech event of the year!'
    },
    {
      id: '2',
      title: 'Workshop: React Best Practices',
      date: '2024-02-20',
      time: '2:00 PM',
      location: 'Lab 101',
      description: 'Learn advanced React patterns and best practices.'
    }
  ]);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'New Meeting Schedule',
      content: 'Weekly meetings will now be held on Wednesdays at 3 PM.',
      priority: 'high',
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'Project Deadline Extension',
      content: 'The deadline for the current project has been extended to next Friday.',
      priority: 'medium',
      date: '2024-01-14'
    },
    {
      id: '3',
      title: 'Welcome New Members',
      content: 'Please join us in welcoming our new team members who joined this week.',
      priority: 'low',
      date: '2024-01-13'
    },
    {
      id: '4',
      title: 'System Maintenance',
      content: 'Scheduled maintenance will occur this weekend. Expect brief downtime.',
      priority: 'high',
      date: '2024-01-12'
    }
  ]);

  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Society Guidelines',
      type: 'document',
      url: '#',
      description: 'Complete guide to society rules and regulations'
    },
    {
      id: '2',
      title: 'React Documentation',
      type: 'link',
      url: 'https://reactjs.org',
      description: 'Official React documentation and tutorials'
    }
  ]);

  const [showEventModal, setShowEventModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);

  const handleCreateEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString()
    };
    setEvents([...events, newEvent]);
    setShowEventModal(false);
  };

  const handleCreateAnnouncement = (announcementData: Omit<Announcement, 'id' | 'date'>) => {
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setShowAnnouncementModal(false);
  };

  const handleCreateResource = (resourceData: Omit<Resource, 'id'>) => {
    const newResource: Resource = {
      ...resourceData,
      id: Date.now().toString()
    };
    setResources([...resources, newResource]);
    setShowResourceModal(false);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter(announcement => announcement.id !== id));
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="animate-fade-in-up mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className={`text-lg transition-colors duration-300 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Senior Dashboard - Manage your society
          </p>
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-in-up animation-delay-200 mb-8">
          <h2 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => setShowEventModal(true)}
              className={`p-4 rounded-lg border-2 border-dashed transition-all duration-300 hover:scale-105 ${
                isDark 
                  ? 'border-gray-600 hover:border-blue-500 bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'border-gray-300 hover:border-blue-500 bg-white hover:bg-gray-50 text-gray-900'
              }`}
            >
              <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <span className="block font-medium">Create Event</span>
            </button>
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className={`p-4 rounded-lg border-2 border-dashed transition-all duration-300 hover:scale-105 ${
                isDark 
                  ? 'border-gray-600 hover:border-green-500 bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'border-gray-300 hover:border-green-500 bg-white hover:bg-gray-50 text-gray-900'
              }`}
            >
              <Users className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <span className="block font-medium">New Announcement</span>
            </button>
            <button
              onClick={() => setShowResourceModal(true)}
              className={`p-4 rounded-lg border-2 border-dashed transition-all duration-300 hover:scale-105 ${
                isDark 
                  ? 'border-gray-600 hover:border-purple-500 bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'border-gray-300 hover:border-purple-500 bg-white hover:bg-gray-50 text-gray-900'
              }`}
            >
              <FileText className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <span className="block font-medium">Add Resource</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Events Section */}
          <div className="animate-fade-in-up animation-delay-400 lg:col-span-2">
            <h2 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Upcoming Events
            </h2>
            <div className="space-y-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

          {/* Announcements Section */}
          <div className="animate-fade-in-up animation-delay-600">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Announcements ({announcements.length})
              </h2>
            </div>
            <div className={`rounded-lg p-4 h-80 sm:h-96 overflow-y-auto custom-scrollbar transition-colors duration-300 ${
              isDark ? 'bg-gray-800' : 'bg-white border border-gray-200'
            }`}>
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="relative group">
                    <AnnouncementCard announcement={announcement} />
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      className={`absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                        isDark 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                      title="Delete announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="animate-fade-in-up animation-delay-800 mt-8">
          <ResourcesSection resources={resources} />
        </div>

        {/* Modals */}
        {showEventModal && (
          <CreateEventModal
            onClose={() => setShowEventModal(false)}
            onSubmit={handleCreateEvent}
          />
        )}
        {showAnnouncementModal && (
          <CreateAnnouncementModal
            onClose={() => setShowAnnouncementModal(false)}
            onSubmit={handleCreateAnnouncement}
          />
        )}
        {showResourceModal && (
          <CreateResourceModal
            onClose={() => setShowResourceModal(false)}
            onSubmit={handleCreateResource}
          />
        )}
      </div>
    </div>
  );
};

export default SeniorDashboard;