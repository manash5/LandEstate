import React, { useState } from 'react';
import { Search, AlertTriangle, Clock, CheckCircle, User, MapPin, X } from 'lucide-react';
import { issues } from '../data/mockdata';

const Issues = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [issuesList, setIssuesList] = useState(issues);

  const handleStatusUpdate = (issueId, newStatus) => {
    setIssuesList(currentIssues =>
      currentIssues.map(issue =>
        issue.id === issueId
          ? { ...issue, status: newStatus }
          : issue
      )
    );
    setShowStatusModal(false);
  };

  const filteredIssues = issuesList.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.tenant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return AlertTriangle;
      case 'in-progress':
        return Clock;
      case 'resolved':
        return CheckCircle;
      default:
        return AlertTriangle;
    }
  };

  const IssueDetailsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Issue Details</h2>
          <button
            onClick={() => setShowDetailsModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{selectedIssue.title}</h3>
              <p className="text-gray-600">{selectedIssue.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Property: {selectedIssue.property}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span>Room: {selectedIssue.room}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>Reported by: {selectedIssue.tenant}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Reported: {new Date(selectedIssue.reportedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedIssue.priority)}`}>
                    Priority: {selectedIssue.priority.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedIssue.status)}`}>
                    Status: {selectedIssue.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const UpdateStatusModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Update Issue Status</h2>
          <button
            onClick={() => setShowStatusModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Status: {selectedIssue.status.replace('-', ' ').toUpperCase()}
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => handleStatusUpdate(selectedIssue.id, e.target.value)}
                defaultValue={selectedIssue.status}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
        <div className="bg-slate-100 p-6 rounded-xl relative overflow-hidden">
      <div className="relative z-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent mb-1">
          Issues Raised
        </h1>
        <p className="text-gray-600 text-lg font-medium">
          Track and manage all reported issues
        </p>
        
        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2"></div>
      </div>
    </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search issues, properties, or tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredIssues.map((issue) => {
            const StatusIcon = getStatusIcon(issue.status);
            
            return (
              <div key={issue.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <StatusIcon className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-800">{issue.title}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                      {issue.priority.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{issue.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{issue.property} - Room {issue.room}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>Reported by: {issue.tenant}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Reported: {new Date(issue.reportedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedIssue(issue);
                      setShowStatusModal(true);
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Update Status
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedIssue(issue);
                      setShowDetailsModal(true);
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredIssues.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No issues found matching your criteria.</p>
          </div>
        )}
      </div>

      {showDetailsModal && selectedIssue && <IssueDetailsModal />}
      {showStatusModal && selectedIssue && <UpdateStatusModal />}
    </div>
  );
};

export default Issues;