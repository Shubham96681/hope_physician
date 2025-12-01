import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/portal/DashboardLayout';
import Card from '../../components/shared/Card';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import { 
  FaCalendarAlt, 
  FaClock,
  FaStethoscope,
  FaNotesMedical,
  FaFilter,
  FaSearch
} from 'react-icons/fa';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all appointments
    setTimeout(() => {
      setAppointments([
        { 
          id: 1, 
          patient: 'John Doe', 
          time: '10:00 AM', 
          date: '2024-01-20',
          status: 'scheduled',
          type: 'Follow-up',
          notes: 'Regular checkup'
        },
        { 
          id: 2, 
          patient: 'Jane Smith', 
          time: '11:00 AM',
          date: '2024-01-20',
          status: 'in-progress',
          type: 'Consultation',
          notes: 'New patient'
        },
        { 
          id: 3, 
          patient: 'Mike Johnson', 
          time: '02:00 PM',
          date: '2024-01-20',
          status: 'scheduled',
          type: 'Follow-up',
          notes: 'Post-surgery review'
        },
        { 
          id: 4, 
          patient: 'Sarah Brown', 
          time: '03:30 PM',
          date: '2024-01-20',
          status: 'scheduled',
          type: 'Consultation',
          notes: 'Annual physical'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusBadge = (status) => {
    const variants = {
      'scheduled': 'primary',
      'in-progress': 'info',
      'completed': 'success',
      'cancelled': 'danger'
    };
    return variants[status] || 'default';
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesFilter = filter === 'all' || apt.status === filter;
    const matchesSearch = apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Appointments</h1>
          <p className="text-gray-600 mt-1">Manage and view all your appointments</p>
        </div>

        {/* Filters and Search */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by patient name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            {/* Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Appointments List */}
        <Card>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No appointments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((apt) => (
                <div 
                  key={apt.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-l-4 border-primary"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <FaStethoscope className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{apt.patient}</p>
                        <p className="text-sm text-gray-600">{apt.type}</p>
                      </div>
                      <Badge variant={getStatusBadge(apt.status)}>
                        {apt.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="w-3 h-3" />
                        {apt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        {apt.time}
                      </span>
                      {apt.notes && (
                        <span className="flex items-center gap-1">
                          <FaNotesMedical className="w-3 h-3" />
                          {apt.notes}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                    {apt.status === 'scheduled' && (
                      <Button size="sm">
                        Accept
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;

