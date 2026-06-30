'use client';

import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/services/api';
import PropertyCard from '@/components/PropertyCard';
import { useState } from 'react';

export default function Home() {
  const [filters, setFilters] = useState({
    city: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    sortBy: '',
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => {
      const params: any = { limit: 12 };
      if (filters.city) params.city = filters.city;
      if (filters.propertyType) params.propertyType = filters.propertyType;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.minBedrooms) params.minBedrooms = filters.minBedrooms;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      return propertyService.getAllProperties(params);
    },
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    setFilters({
      city: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      sortBy: '',
    });
  };

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

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Search by city"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Property Type</label>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="House">House</option>
              <option value="Studio">Studio</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Min Price</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min Price"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max Price"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Min Bedrooms</label>
            <input
              type="number"
              name="minBedrooms"
              value={filters.minBedrooms}
              onChange={handleFilterChange}
              placeholder="Min Bedrooms"
              min="1"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Sort By</label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Relevance</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="date-desc">Newest First</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleReset}
            className="text-blue-600 hover:underline mr-4"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.data?.properties?.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
