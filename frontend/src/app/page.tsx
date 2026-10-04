'use client';

import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/services/api';
import PropertyCard from '@/components/PropertyCard';
import { useState } from 'react';

export default function Home() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    city: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    sortBy: '',
  });

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['properties', filters, page],
    queryFn: () => {
      const params: any = { page, limit: 12 };
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
    setPage(1); // Reset to page 1 on filter change
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
    setPage(1);
  };

  const pagination = data?.data?.pagination;
  const properties = data?.data?.properties || [];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* HERO SECTION */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-28">
        {/* Background Image with Dark Gradient Blur */}
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center filter blur-sm transform scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/90 to-slate-950 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>50,000+ Verified Real Estate Listings</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight mb-6">
            Discover Your Dream <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-200 bg-clip-text text-transparent">Home & Investment</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-normal">
            Explore apartments, luxury villas, and penthouses across premier Indian cities with verified direct seller details.
          </p>

          {/* SEARCH & FILTER OVERLAY CARD */}
          <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-800 border border-white/40">
            {/* Filter Category Quick Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6 pb-6 border-b border-slate-100">
              {['', 'Apartment', 'Villa', 'Penthouse', 'Studio', 'House'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, propertyType: type }));
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                    filters.propertyType === type
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type === '' ? 'All Properties' : type}
                </button>
              ))}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {/* City Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  City Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    placeholder="e.g. Mumbai, Delhi"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                  />
                  <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min Price"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max Price"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Sort Order
                </label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                >
                  <option value="">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="date-desc">Newest First</option>
                </select>
              </div>
            </div>

            {/* Filter Footer Controls */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {isFetching ? 'Updating results...' : `${pagination?.totalCount || 0} properties found`}
              </span>
              <button
                onClick={handleReset}
                className="text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STATS RIBBON */}
      <div className="bg-white border-b border-slate-100 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl font-extrabold text-blue-600">50,000+</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Properties Listed</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-indigo-600">12,000+</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Sellers</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-amber-500">99.4%</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Satisfaction Rate</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-emerald-600">24/7</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Direct Concierge</p>
          </div>
        </div>
      </div>

      {/* MAIN PROPERTY GRID SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Featured Properties
            </h2>
            <p className="text-sm text-slate-500">
              Browse top luxury real estate listings matching your criteria
            </p>
          </div>

          <div className="text-sm font-semibold text-slate-500">
            Page {page} of {pagination?.totalPages || 1}
          </div>
        </div>

        {/* LOADING SKELETON STATE */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse">
                <div className="h-48 bg-slate-200 rounded-xl mb-4" />
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-8 text-center max-w-lg mx-auto">
            <svg className="w-12 h-12 text-rose-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-bold text-lg mb-1">Failed to load properties</p>
            <p className="text-sm">Please make sure the backend server is connected.</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center max-w-md mx-auto">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Properties Found</h3>
            <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or city search.</p>
            <button
              onClick={handleReset}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* PAGINATION NAVIGATION */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            <span className="px-4 py-2 text-sm font-bold text-slate-700">
              {page} / {pagination.totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
              disabled={page === pagination.totalPages}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
