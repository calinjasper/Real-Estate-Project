'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { propertyService } from '@/services/api';
import Link from 'next/link';

export default function CreatePropertyPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    state: '',
    country: 'India',
    address: '',
    propertyType: 'Apartment',
    bedrooms: '2',
    bathrooms: '2',
    area: '1200',
  });
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-100 shadow-xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl">
          🔒
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h2>
        <p className="text-sm text-slate-500 mb-6">Please log in to list a property on EstateHub.</p>
        <Link
          href="/auth/login"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      images.forEach((image) => {
        data.append('images', image);
      });

      await propertyService.createProperty(data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to list property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboard" className="text-xs font-bold text-slate-400 hover:text-blue-600 mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">List Your Property</h1>
          <p className="text-sm text-slate-500">Reach over 50,000+ active property seekers across India.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-sm font-semibold mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-8">
          {/* SECTION 1: BASIC DETAILS */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-black">1</span>
              <span>Property Overview</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 3 BHK Luxury Villa with Private Garden in Jubilee Hills"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Detailed Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe key features, floor plan, surroundings, and nearby connectivity..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Asking Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 7500000"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Property Category *
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="House">House</option>
                  <option value="Studio">Studio</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: LOCATION */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-black">2</span>
              <span>Location Details</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Hyderabad"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Telangana"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Road No. 36, Jubilee Hills"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: SPECIFICATIONS */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-black">3</span>
              <span>Property Specs</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.5"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Area (sqft)
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: IMAGES */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-black">4</span>
              <span>Photos Upload</span>
            </h2>

            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-blue-500 transition bg-slate-50">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer block">
                <svg className="w-12 h-12 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-bold text-blue-600">Click to upload property images</span>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP formats accepted</p>
              </label>
              {images.length > 0 && (
                <p className="text-xs font-bold text-emerald-600 mt-3">
                  ✓ {images.length} file(s) attached
                </p>
              )}
            </div>
          </div>

          {/* SUBMIT BUTTONS */}
          <div className="pt-4 flex items-center justify-end space-x-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing Listing...' : 'Publish Property Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
