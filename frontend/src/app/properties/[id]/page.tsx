'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { propertyService, inquiryService } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';

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
      setInquiryError('Please login to send an inquiry');
      return;
    }

    setIsSubmitting(true);
    setInquiryError('');
    setInquirySuccess('');

    try {
      await inquiryService.createInquiry(id, message);
      setInquirySuccess('Inquiry sent successfully!');
      setMessage('');
    } catch (err: any) {
      setInquiryError(err.response?.data?.message || 'Failed to send inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (propertyLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-xl">Loading property details...</div>
      </div>
    );
  }

  if (propertyError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-xl text-red-600">Error loading property</div>
      </div>
    );
  }

  const property = propertyData?.data;
  if (!property) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{property.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
            {property.propertyImages.length > 0 ? (
              <img
                src={`http://localhost:5000${property.propertyImages[0].imageUrl}`}
                alt={property.title}
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-400 text-2xl">No Image</div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Details</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-gray-600">Price:</span>
                <span className="text-2xl font-bold text-blue-600 ml-2">
                  ₹{property.price.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="font-semibold ml-2">{property.propertyType}</span>
              </div>
              <div>
                <span className="text-gray-600">Bedrooms:</span>
                <span className="font-semibold ml-2">{property.bedrooms}</span>
              </div>
              <div>
                <span className="text-gray-600">Bathrooms:</span>
                <span className="font-semibold ml-2">{property.bathrooms}</span>
              </div>
              <div>
                <span className="text-gray-600">Area:</span>
                <span className="font-semibold ml-2">{property.area} sqft</span>
              </div>
            </div>
            <p className="text-gray-700">{property.description}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Similar Properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {similarData?.data?.slice(0, 3).map((prop) => (
                <div key={prop.id} className="border rounded p-4">
                  <h4 className="font-semibold">{prop.title}</h4>
                  <p className="text-blue-600 font-bold">₹{prop.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <h3 className="text-xl font-bold mb-4">Contact Owner</h3>
            <div className="mb-4">
              <p className="font-semibold">{property.owner.name}</p>
              <p className="text-gray-600">{property.owner.email}</p>
              {property.owner.phone && <p className="text-gray-600">{property.owner.phone}</p>}
            </div>
            <form onSubmit={handleInquiry} className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-700">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="I'm interested in this property..."
                  required
                />
              </div>
              {inquiryError && <div className="p-3 bg-red-100 text-red-700 rounded">{inquiryError}</div>}
              {inquirySuccess && <div className="p-3 bg-green-100 text-green-700 rounded">{inquirySuccess}</div>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
