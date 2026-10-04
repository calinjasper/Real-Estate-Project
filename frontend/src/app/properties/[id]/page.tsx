'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { propertyService, inquiryService } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import Link from 'next/link';

const typeImageMap: Record<string, string> = {
  Villa: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
  Apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  House: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  Studio: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
  Penthouse: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
};

export default function PropertyDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { isAuthenticated } = useAuthStore();
  const [message, setMessage] = useState('');
  const [inquiryError, setInquiryError] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: propertyData,
    isLoading: propertyLoading,
    error: propertyError,
  } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getPropertyById(id),
  });

  const { data: similarData } = useQuery({
    queryKey: ['similarProperties', id],
    queryFn: () => propertyService.getSimilarProperties(id),
    enabled: !!id,
  });

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setInquiryError('Please login to contact the property owner.');
      return;
    }

    setIsSubmitting(true);
    setInquiryError('');
    setInquirySuccess('');

    try {
      await inquiryService.createInquiry(id, message);
      setInquirySuccess('Your inquiry has been delivered directly to the owner!');
      setMessage('');
    } catch (err: any) {
      setInquiryError(err.response?.data?.message || 'Failed to send inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (propertyLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-semibold">Loading luxury property details...</p>
      </div>
    );
  }

  if (propertyError || !propertyData?.data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-8 max-w-md mx-auto">
          <p className="font-bold text-lg mb-2">Property Not Found</p>
          <Link href="/" className="text-blue-600 hover:underline font-semibold text-sm">
            ← Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const property = propertyData.data;
  let imageSrc = typeImageMap[property.propertyType] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
  if (property.propertyImages && property.propertyImages.length > 0) {
    imageSrc = `http://localhost:5000${property.propertyImages[0].imageUrl}`;
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lakh`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/" className="hover:text-blue-600">Properties</Link>
          <span>/</span>
          <span className="text-slate-700 truncate">{property.title}</span>
        </nav>

        {/* Title & Price Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200/80 gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase rounded-full tracking-wider">
                {property.propertyType}
              </span>
              <span className="text-xs font-semibold text-slate-400">ID #{property.id}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {property.title}
            </h1>
            <p className="text-slate-500 text-sm flex items-center mt-2">
              <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{property.address ? `${property.address}, ` : ''}{property.city}, {property.state || 'India'}</span>
            </p>
          </div>

          <div className="text-left md:text-right">
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Offered Price</p>
            <p className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">
              {formatPrice(property.price)}
            </p>
            {property.area && (
              <p className="text-xs text-slate-400 mt-1">
                ≈ ₹{Math.round(property.price / property.area).toLocaleString('en-IN')} / sqft
              </p>
            )}
          </div>
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT CONTENT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative h-96 sm:h-[480px] rounded-3xl overflow-hidden shadow-xl bg-slate-900">
              <img
                src={imageSrc}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                Verified Listing
              </div>
            </div>

            {/* Quick Specs Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Bedrooms</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{property.bedrooms}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Bathrooms</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{property.bathrooms}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Built-up Area</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{property.area || '--'} <span className="text-xs font-semibold">sqft</span></p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Property Type</span>
                <p className="text-xl font-extrabold text-blue-600 mt-1 truncate">{property.propertyType}</p>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About this Property</h2>
              <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                {property.description || 'This premium real-estate listing offers exceptional living space, modern amenities, and prime connectivity in a high-demand residential neighborhood.'}
              </p>
            </div>

            {/* Features & Amenities Grid */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Property Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { icon: '🚗', name: 'Reserved Parking' },
                  { icon: '🏊', name: 'Swimming Pool' },
                  { icon: '🏋️', name: 'Fitness Gym' },
                  { icon: '🔒', name: '24/7 Security' },
                  { icon: '⚡', name: 'Power Backup' },
                  { icon: '🌿', name: 'Landscaped Garden' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs font-bold text-slate-700">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Properties Section */}
            {similarData?.data && similarData.data.length > 0 && (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Similar Properties in {property.city}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {similarData.data.slice(0, 3).map((prop) => (
                    <Link key={prop.id} href={`/properties/${prop.id}`} className="group block border border-slate-100 rounded-2xl p-4 hover:shadow-lg transition">
                      <h3 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 line-clamp-1 mb-1">
                        {prop.title}
                      </h3>
                      <p className="text-blue-600 font-extrabold text-sm mb-2">{formatPrice(prop.price)}</p>
                      <p className="text-xs text-slate-400">{prop.bedrooms} Bed • {prop.area} sqft</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT CONTACT STICKY SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl sticky top-24">
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-black shadow-md shadow-blue-500/20">
                  {property.owner?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Listed by Owner</span>
                  <h3 className="text-lg font-bold text-slate-900">{property.owner?.name}</h3>
                  <p className="text-xs text-slate-500">{property.owner?.email}</p>
                </div>
              </div>

              <form onSubmit={handleInquiry} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Send Direct Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                    placeholder="Hello, I am interested in this property. Please contact me with more details..."
                    required
                  />
                </div>

                {/* Quick Preset Prompt Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {['Is price negotiable?', 'Schedule site visit', 'Request video tour'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setMessage((prev) => (prev ? `${prev} ${chip}` : chip))}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[11px] font-semibold transition"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>

                {inquiryError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
                    {inquiryError}
                  </div>
                )}
                {inquirySuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-semibold">
                    {inquirySuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Delivering Message...' : 'Contact Owner Now'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
