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
    bedrooms: '',
    bathrooms: '',
    area: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-xl mb-4">Please login to create a property</p>
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Login here
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
      setError(err.response?.data?.message || 'Failed to create property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">List Your Property</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block mb-2 text-gray-700 font-semibold">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter property title"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-gray-700 font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter property description"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">Property Type</label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="House">House</option>
              <option value="Studio">Studio</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter city"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter state"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter country"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-gray-700 font-semibold">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter address"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter number of bedrooms"
              min="1"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter number of bathrooms"
              min="1"
              step="0.5"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">Area (sqft)</label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter area"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-semibold">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {images.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {images.length} image(s) selected
            </p>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Property'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
