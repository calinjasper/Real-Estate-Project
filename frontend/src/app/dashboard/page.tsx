'use client';

import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/services/api';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myProperties'],
    queryFn: () => propertyService.getMyProperties(),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-xl">Loading your properties...</div>
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Properties</h1>
        <Link
          href="/properties/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Add New Property
        </Link>
      </div>

      {data?.data?.properties?.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-4">You haven't listed any properties yet</p>
          <Link
            href="/properties/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            List Your First Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.properties?.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
