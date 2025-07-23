import React from 'react';

interface ShimmerProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'button';
  children?: React.ReactNode;
}

export default function Shimmer({
  className = '',
  width,
  height,
  rounded = 'lg',
  variant = 'default',
  children
}: ShimmerProps) {
  // Predefined variants for common use cases
  const getVariantStyles = () => {
    switch (variant) {
      case 'card':
        return 'h-48 w-full';
      case 'text':
        return 'h-4 w-3/4';
      case 'avatar':
        return 'h-12 w-12 rounded-full';
      case 'button':
        return 'h-10 w-24';
      default:
        return '';
    }
  };

  // Rounded corner options
  const getRoundedClass = () => {
    switch (rounded) {
      case 'none':
        return 'rounded-none';
      case 'sm':
        return 'rounded-sm';
      case 'md':
        return 'rounded-md';
      case 'lg':
        return 'rounded-lg';
      case 'xl':
        return 'rounded-xl';
      case 'full':
        return 'rounded-full';
      default:
        return 'rounded-lg';
    }
  };

  const baseStyles = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200';
  const variantStyles = getVariantStyles();
  const roundedStyles = getRoundedClass();
  const sizeStyles = width || height ? '' : variantStyles;
  
  const inlineStyles: React.CSSProperties = {
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height })
  };

  return (
    <>
      {/* CSS Animation Definition */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      
      <div 
        className={`${baseStyles} ${sizeStyles} ${roundedStyles} ${className}`}
        style={inlineStyles}
      >
        {children}
      </div>
    </>
  );
}

// Additional preset components for common patterns
export const ShimmerCard = ({ className = '', children }: { className?: string; children?: React.ReactNode }) => (
  <Shimmer variant="card" className={className}>
    {children}
  </Shimmer>
);

export const ShimmerText = ({ className = '', width }: { className?: string; width?: string }) => (
  <Shimmer variant="text" className={`${className}`} width={width} />
);

export const ShimmerAvatar = ({ className = '', size = 48 }: { className?: string; size?: number }) => (
  <Shimmer 
    variant="avatar" 
    className={className}
    width={size}
    height={size}
  />
);

export const ShimmerButton = ({ className = '' }: { className?: string }) => (
  <Shimmer variant="button" className={className} />
);

// Complex shimmer patterns
export const ShimmerProductCard = ({ className = '' }: { className?: string }) => (
  <div className={`p-4 border border-gray-200 rounded-lg ${className}`}>
    <Shimmer className="h-32 w-full mb-4" rounded="md" />
    <ShimmerText className="mb-2" />
    <ShimmerText width="60%" className="mb-2" />
    <div className="flex justify-between items-center">
      <ShimmerText width="40%" />
      <ShimmerButton />
    </div>
  </div>
);

export const ShimmerUserCard = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center space-x-3 p-3 ${className}`}>
    <ShimmerAvatar />
    <div className="flex-1">
      <ShimmerText className="mb-2" />
      <ShimmerText width="50%" />
    </div>
  </div>
);


// Alternative: Full Height Shimmer Table
export const FullHeightShimmerTable = ({ 
  className = '',
  cols = 10 
}: { 
  className?: string;
  cols?: number;
}) => (
  <div className={`h-screen-table ${className}`}>
    {/* Header */}
    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
      <div className="flex space-x-4">
        <Shimmer className="h-4 w-8" />
        {Array.from({ length: cols }).map((_, i) => (
          <Shimmer key={i} className="h-4 flex-1" />
        ))}
        <Shimmer className="h-4 w-16" />
      </div>
    </div>
    
    {/* Fill remaining space with rows */}
    <div className="flex-1 divide-y divide-gray-200">
      {Array.from({ length: 12 }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <Shimmer className="h-4 w-4 rounded" />
            <Shimmer className="h-10 w-10 rounded-lg" />
            {Array.from({ length: cols - 1 }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1">
                <Shimmer className="h-4 w-full" />
              </div>
            ))}
            <div className="flex space-x-2">
              <Shimmer className="h-8 w-8 rounded" />
              <Shimmer className="h-8 w-8 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);