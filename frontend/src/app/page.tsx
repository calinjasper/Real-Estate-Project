'use client';

import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/services/api';
import PropertyCard from '@/components/PropertyCard';

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyService.getAllProperties({ limit: 12 }),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-xl">Loading properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-xl text-red-600">Error loading properties</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Find Your Dream Home</h1>
        <p className="text-xl text-gray-600">
          Discover the perfect property for you and your family
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.data?.properties?.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
