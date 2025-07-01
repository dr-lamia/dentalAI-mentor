import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, Video, Globe, Plus, Edit, Trash2, Search, Filter, CheckCircle, X, Image, Link } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  type: 'webinar' | 'workshop' | 'lecture' | 'case-study';
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  capacity: number;
  attendees: number;
  image?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const EventManager: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Live Webinar: Digital Dentistry',
      type: 'webinar',
      date: 'June 15, 2025',
      startTime: '2:00 PM',
      endTime: '4:00 PM',
      description: 'Join us for an interactive webinar on the latest advancements in digital dentistry, including CAD/CAM technology and digital impressions.',
      capacity: 100,
      attendees: 42,
      image: 'https://images.pexels.com/photos/3845743/pexels-photo-3845743.jpeg?auto=compress&cs=tinysrgb&w=600',
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Case Study Discussion: Complex Restorations',
      type: 'case-study',
      date: 'June 18, 2025',
      startTime: '6:30 PM',
      endTime: '8:00 PM',
      description: 'An in-depth analysis of complex restoration cases with focus on treatment planning and material selection.',
      capacity: 50,
      attendees: 28,
      image: 'https://images.pexels.com/photos/4270367/pexels-photo-4270367.jpeg?auto=compress&cs=tinysrgb&w=600',
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Hands-on Workshop: Dental Photography',
      type: 'workshop',
      date: 'June 22, 2025',
      startTime: '9:00 AM',
      endTime: '12:00 PM',
      description: 'Learn professional dental photography techniques for documentation, case presentation, and marketing.',
      capacity: 30,
      attendees: 15,
      image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600',
      status: 'upcoming'
    },
    {
      id: '4',
      title: 'Lecture: Advanced Endodontic Techniques',
      type: 'lecture',
      date: 'May 28, 2025',
      startTime: '3:00 PM',
      endTime: '5:00 PM',
      description: 'Comprehensive lecture on advanced endodontic techniques including rotary instrumentation and warm vertical obturation.',
      capacity: 80,
      attendees: 65,
      image: 'https://images.pexels.com/photos/3845757/pexels-photo-3845757.jpeg?auto=compress&cs=tinysrgb&w=600',
      status: 'completed'
    }
  ]);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // New event form state
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id' | 'attendees' | 'status'>>({
    title: '',
    type: 'webinar',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    capacity: 50,
    image: ''
  });

  const handleCreateEvent = () => {
    const event: Event = {
      ...newEvent,
      id: Date.now().toString(),
      attendees: 0,
      status: 'upcoming'
    };
    
    setEvents(prev => [...prev, event]);
    setShowCreateModal(false);
    setNewEvent({
      title: '',
      type: 'webinar',
      date: '',
      startTime: '',
      endTime: '',
      description: '',
      capacity: 50,
      image: ''
    });
  };

  const handleUpdateEvent = () => {
    if (!editingEvent) return;
    
    setEvents(prev => prev.map(event => 
      event.id === editingEvent.id ? editingEvent : event
    ));
    
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'webinar':
        return <Video className="w-5 h-5 text-blue-600" />;
      case 'workshop':
        return <Users className="w-5 h-5 text-green-600" />;
      case 'lecture':
        return <Globe className="w-5 h-5 text-purple-600" />;
      case 'case-study':
        return <Search className="w-5 h-5 text-orange-600" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-600" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'webinar':
        return 'bg-blue-100 text-blue-700';
      case 'workshop':
        return 'bg-green-100 text-green-700';
      case 'lecture':
        return 'bg-purple-100 text-purple-700';
      case 'case-study':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'ongoing':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Management</h2>
          <p className="text-gray-600">Create and manage webinars, workshops, and other educational events</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium flex items-center space-x-2 sm:self-start"
        >
          <Plus className="w-5 h-5" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="webinar">Webinars</option>
              <option value="workshop">Workshops</option>
              <option value="lecture">Lectures</option>
              <option value="case-study">Case Studies</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {event.image && (
              <div className="h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getEventTypeColor(event.type)}`}>
                  {event.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{event.attendees} / {event.capacity} attendees</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setEditingEvent(event)}
                  className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm flex items-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create New Event
          </button>
        </div>
      )}

      {/* Create/Edit Event Modal */}
      <AnimatePresence>
        {(showCreateModal || editingEvent) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowCreateModal(false);
              setEditingEvent(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingEvent(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={editingEvent?.title || newEvent.title}
                    onChange={(e) => {
                      if (editingEvent) {
                        setEditingEvent({...editingEvent, title: e.target.value});
                      } else {
                        setNewEvent({...newEvent, title: e.target.value});
                      }
                    }}
                    placeholder="Enter event title"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Type & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Type
                    </label>
                    <select
                      value={editingEvent?.type || newEvent.type}
                      onChange={(e) => {
                        const value = e.target.value as Event['type'];
                        if (editingEvent) {
                          setEditingEvent({...editingEvent, type: value});
                        } else {
                          setNewEvent({...newEvent, type: value});
                        }
                      }}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="webinar">Webinar</option>
                      <option value="workshop">Workshop</option>
                      <option value="lecture">Lecture</option>
                      <option value="case-study">Case Study</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={editingEvent?.date || newEvent.date}
                      onChange={(e) => {
                        if (editingEvent) {
                          setEditingEvent({...editingEvent, date: e.target.value});
                        } else {
                          setNewEvent({...newEvent, date: e.target.value});
                        }
                      }}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Time & Capacity */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={editingEvent?.startTime || newEvent.startTime}
                      onChange={(e) => {
                        if (editingEvent) {
                          setEditingEvent({...editingEvent, startTime: e.target.value});
                        } else {
                          setNewEvent({...newEvent, startTime: e.target.value});
                        }
                      }}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={editingEvent?.endTime || newEvent.endTime}
                      onChange={(e) => {
                        if (editingEvent) {
                          setEditingEvent({...editingEvent, endTime: e.target.value});
                        } else {
                          setNewEvent({...newEvent, endTime: e.target.value});
                        }
                      }}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editingEvent?.capacity || newEvent.capacity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (editingEvent) {
                          setEditingEvent({...editingEvent, capacity: value});
                        } else {
                          setNewEvent({...newEvent, capacity: value});
                        }
                      }}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingEvent?.description || newEvent.description}
                    onChange={(e) => {
                      if (editingEvent) {
                        setEditingEvent({...editingEvent, description: e.target.value});
                      } else {
                        setNewEvent({...newEvent, description: e.target.value});
                      }
                    }}
                    placeholder="Enter event description"
                    rows={4}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={editingEvent?.image || newEvent.image}
                        onChange={(e) => {
                          if (editingEvent) {
                            setEditingEvent({...editingEvent, image: e.target.value});
                          } else {
                            setNewEvent({...newEvent, image: e.target.value});
                          }
                        }}
                        placeholder="Enter image URL"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Link className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use a URL from Pexels or other free stock photo sites
                  </p>
                </div>

                {/* Status (only for editing) */}
                {editingEvent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={editingEvent.status}
                      onChange={(e) => {
                        setEditingEvent({...editingEvent, status: e.target.value as Event['status']});
                      }}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingEvent(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
                    disabled={!editingEvent?.title && !newEvent.title}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventManager;