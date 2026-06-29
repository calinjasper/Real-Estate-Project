import Link from 'next/link';
import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          {property.propertyImages.length > 0 ? (
            <img
              src={`http://localhost:5000${property.propertyImages[0].imageUrl}`}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-gray-400">No Image</div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
          <p className="text-2xl font-bold text-blue-600 mb-2">
            ₹{property.price.toLocaleString()}
          </p>
          <p className="text-gray-600 mb-2">
            {property.bedrooms} Bed • {property.bathrooms} Bath • {property.area} sqft
          </p>
          <p className="text-gray-500">
            {property.address}, {property.city}
          </p>
        </div>
      </div>
    </Link>
  );
}
