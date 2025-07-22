import React from 'react';

interface AdPlaceholderProps {
  placement: 'slider' | 'box' | 'upper-banner' | 'lower-banner';
  className?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ placement, className = '' }) => {
  const getDimensions = () => {
    switch (placement) {
      case 'slider':
        return '800 x 500px';
      case 'box':
        return '400 x 250px';
      case 'upper-banner':
      case 'lower-banner':
        return '1200 x 300px';
      default:
        return '800 x 400px';
    }
  };

  const getTitle = () => {
    switch (placement) {
      case 'slider':
        return 'Slider Banner';
      case 'box':
        return 'Box Banner';
      case 'upper-banner':
        return 'Upper Banner';
      case 'lower-banner':
        return 'Lower Banner';
      default:
        return 'Advertisement';
    }
  };

  return (
    <div className={`w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 ${className}`}>
      <div className="text-center">
        <div className="mb-2">
          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="font-medium text-lg mb-1">Your Ad Here</div>
        <div className="text-sm text-gray-400 mb-1">{getTitle()}</div>
        <div className="text-xs text-gray-400">Recommended: {getDimensions()}</div>
      </div>
    </div>
  );
};

export default AdPlaceholder; 