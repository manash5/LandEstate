import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color, change }) => {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 shadow-blue-100',
    green: 'bg-gradient-to-br from-green-50 to-green-100 text-green-600 shadow-green-100',
    red: 'bg-gradient-to-br from-red-50 to-red-100 text-red-600 shadow-red-100',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 shadow-purple-100'
  };

  const borderColors = {
    blue: 'border-blue-200',
    green: 'border-green-200',
    red: 'border-red-200',
    purple: 'border-purple-200'
  };

  // Parse change value to determine if it's positive or negative
  const isPositive = change && (change.includes('+') || (!change.includes('-') && parseFloat(change) > 0));
  const isNegative = change && change.includes('-');

  return (
    <div className={`
      bg-white rounded-2xl shadow-lg border border-gray-100 p-6 
      hover:shadow-xl hover:-translate-y-1 
      transition-all duration-300 ease-in-out
      relative overflow-hidden
      ${borderColors[color]}
    `}>
      {/* Subtle background pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className={`w-full h-full rounded-full ${colorClasses[color].split(' ')[0]} transform translate-x-16 -translate-y-16`}></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className={`
            p-4 rounded-xl shadow-md
            ${colorClasses[color]}
            transform hover:scale-110 transition-transform duration-200
          `}>
            <Icon className="w-7 h-7" />
          </div>
          
          {/* Optional trending indicator */}
          {change && (
            <div className={`
              px-3 py-1 rounded-full text-xs font-semibold
              ${isPositive ? 'bg-green-100 text-green-700' : 
                isNegative ? 'bg-red-100 text-red-700' : 
                'bg-gray-100 text-gray-600'}
            `}>
              {isPositive && '↗'} {isNegative && '↘'} {change}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
              {value}
            </h3>
          </div>
          
          <p className="text-gray-600 font-medium text-base leading-relaxed">
            {title}
          </p>
          
          {change && !isPositive && !isNegative && (
            <p className="text-sm text-gray-500 mt-3">
              {change}
            </p>
          )}
        </div>
      </div>
      
      {/* Subtle bottom accent line */}
      <div className={`
        absolute bottom-0 left-0 right-0 h-1 
        bg-gradient-to-r ${colorClasses[color].split(' ')[0]} opacity-20
      `}></div>
    </div>
  );
};

export default StatsCard;