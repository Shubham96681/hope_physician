/**
 * Status Badge Component
 * Displays color-coded status badges
 */

const StatusBadge = ({ status, children, className = '' }) => {
  const getStatusColor = (status) => {
    const colorMap = {
      // Payment Status
      unpaid: 'bg-red-100 text-red-800 border-red-200',
      partial: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200',
      
      // Appointment Status
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      in_progress: 'bg-purple-100 text-purple-800 border-purple-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      rescheduled: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      
      // Lab Test Status
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      assigned: 'bg-blue-100 text-blue-800 border-blue-200',
      
      // Bed Status
      occupied: 'bg-red-100 text-red-800 border-red-200',
      reserved: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      available: 'bg-green-100 text-green-800 border-green-200',
      maintenance: 'bg-gray-100 text-gray-800 border-gray-200',
      
      // Order Status
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      ready: 'bg-green-100 text-green-800 border-green-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      
      // Alert Severity
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      critical: 'bg-red-100 text-red-800 border-red-200',
      
      // Medication Status
      active: 'bg-green-100 text-green-800 border-green-200',
      stopped: 'bg-red-100 text-red-800 border-red-200',
      missed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      
      // Alert Status
      acknowledged: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      resolved: 'bg-green-100 text-green-800 border-green-200',
      
      // Inventory Status
      in_use: 'bg-blue-100 text-blue-800 border-blue-200',
      damaged: 'bg-red-100 text-red-800 border-red-200',
      
      // Pharmacy Status
      low_stock: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      out_of_stock: 'bg-red-100 text-red-800 border-red-200',
      expired: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return colorMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const displayText = children || status;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)} ${className}`}
    >
      {displayText}
    </span>
  );
};

export default StatusBadge;

