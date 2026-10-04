'use client';

import { useQuery } from '@tanstack/react-query';
import { propertyService, inquiryService } from '@/services/api';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'properties' | 'inquiries'>('properties');

  const { data: propertiesData, isLoading: isLoadingProps } = useQuery({
    queryKey: ['myProperties'],
    queryFn: () => propertyService.getMyProperties(),
  });

  const { data: inquiriesData, isLoading: isLoadingInquiries } = useQuery({
    queryKey: ['myInquiries'],
    queryFn: () => inquiryService.getMyInquiries(),
  });

  const myProperties = propertiesData?.data?.properties || [];
  const myInquiries = inquiriesData?.data || [];

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* EXECUTIVE DASHBOARD HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Executive Panel</span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Seller & Buyer Dashboard</h1>
          </div>

          <Link
            href="/properties/create"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm px-5 py-3 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Post New Listing</span>
          </Link>
        </div>

        {/* OVERVIEW STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
              🏡
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{myProperties.length}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">My Listed Properties</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold">
              📩
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{myInquiries.length}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Sent Inquiries</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold">
              ✓
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">Active</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Status</p>
            </div>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex space-x-3 mb-8 border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
              activeTab === 'properties'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            My Listed Properties ({myProperties.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
              activeTab === 'inquiries'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            My Inquiries ({myInquiries.length})
          </button>
        </div>

        {/* TAB CONTENT */}
        {activeTab === 'properties' ? (
          isLoadingProps ? (
            <div className="text-center py-12 text-slate-500 font-semibold">Loading your properties...</div>
          ) : myProperties.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center max-w-md mx-auto">
              <p className="text-lg font-bold text-slate-800 mb-2">No Properties Listed Yet</p>
              <p className="text-sm text-slate-500 mb-6">Start offering your apartments, houses, or villas to thousands of active buyers.</p>
              <Link
                href="/properties/create"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl shadow transition hover:bg-blue-700"
              >
                List Your First Property
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.map((property: any) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )
        ) : (
          isLoadingInquiries ? (
            <div className="text-center py-12 text-slate-500 font-semibold">Loading your inquiries...</div>
          ) : myInquiries.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center max-w-md mx-auto">
              <p className="text-lg font-bold text-slate-800 mb-2">No Inquiries Sent Yet</p>
              <p className="text-sm text-slate-500 mb-6">Browse properties on the home page and contact property owners directly.</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl shadow transition hover:bg-blue-700"
              >
                Explore Properties
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myInquiries.map((inquiry: any) => (
                <div key={inquiry.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Inquiry #{inquiry.id}</span>
                    <h3 className="font-bold text-slate-900 text-base">{inquiry.property?.title}</h3>
                    <p className="text-slate-600 text-sm mt-1">"{inquiry.message}"</p>
                    <p className="text-xs text-slate-400 mt-2">
                      Sent on {new Date(inquiry.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  {inquiry.property?.id && (
                    <Link
                      href={`/properties/${inquiry.property.id}`}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl self-start md:self-center transition"
                    >
                      View Property
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
