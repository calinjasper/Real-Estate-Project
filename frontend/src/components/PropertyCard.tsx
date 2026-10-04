import Link from 'next/link';
import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
}

// Fallback high-resolution architectural images based on property type
const typeImageMap: Record<string, string> = {
  Villa: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
  Apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  House: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  Studio: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  Penthouse: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
};

const defaultFallbackImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
];

export default function PropertyCard({ property }: PropertyCardProps) {
  // Determine display image: 1st priority uploaded image, 2nd property type map, 3rd ID fallback
  let imageSrc = typeImageMap[property.propertyType] || defaultFallbackImages[property.id % defaultFallbackImages.length];
  if (property.propertyImages && property.propertyImages.length > 0) {
    imageSrc = `http://localhost:5000${property.propertyImages[0].imageUrl}`;
  }

  // Format price nicely
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
        {/* Card Header Image */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-100">
          <img
            src={imageSrc}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />

          {/* Property Type Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-800 rounded-full shadow-sm">
              {property.propertyType}
            </span>
          </div>

          {/* Price Tag Overlay */}
          <div className="absolute bottom-3 left-3">
            <span className="text-xl font-extrabold text-white tracking-tight drop-shadow-md">
              {formatPrice(property.price)}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col justify-between flex-grow">
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1.5">
              {property.title}
            </h3>

            <p className="text-xs text-slate-500 flex items-center mb-4 line-clamp-1">
              <svg className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{property.address ? `${property.address}, ` : ''}{property.city}</span>
            </p>
          </div>

          {/* Key Specs Ribbon */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-slate-600 text-xs font-medium">
            <div className="flex flex-col items-center justify-center p-1.5 bg-slate-50 rounded-xl">
              <span className="font-bold text-slate-900 text-sm">{property.bedrooms}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Beds</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1.5 bg-slate-50 rounded-xl">
              <span className="font-bold text-slate-900 text-sm">{property.bathrooms}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Baths</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1.5 bg-slate-50 rounded-xl">
              <span className="font-bold text-slate-900 text-sm">{property.area || '--'}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Sqft</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
