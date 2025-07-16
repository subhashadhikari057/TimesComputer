import Image from "next/image";


export const CategoryCard = ({ image, title, onClick, className = "" }: { image: string, title: string, onClick: () => void, className?: string }) => {
    return (
        <div 
        className={`bg-muted-background rounded-lg md:rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 px-4 flex items-center gap-3 text-center group ${className}`}
        onClick={onClick}
      >
        <div className="overflow-hidden rounded-md bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Image 
            src={image} 
            alt={title}
            width={64}
            height={64}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const nextElement = (e.target as HTMLImageElement).nextSibling as HTMLElement;
              if (nextElement) {
                nextElement.style.display = 'flex';
              }
            }}
          />
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-md hidden items-center justify-center text-white font-bold text-base">
            {title.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <h3 className="text-gray-800 font-medium text-sm md:text-lg group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>
      </div>      
    );
  };