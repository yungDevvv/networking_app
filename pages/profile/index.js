// pages/profilePage/index.js
import { checkAuth } from '../../lib/check-auth';
import { createClient } from '../../lib/supabase/server-props';

export const getServerSideProps = async (ctx) => {
  return await checkAuth(ctx);
};

import { useState } from 'react';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    company: '',
    title: '',
    phone: '',
    address1: '',
    website: '',
    searching: '',
    offering: '',
    notice: '',
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({ ...prevData, profileImage: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет ваша логика для сохранения профиля
    console.log('Profile data:', formData);
  };

  return (
    <div className="container mx-auto my-4 p-4 bg-white border border-black shadow-xl rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Perustiedot</h2>
      <div onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Etunimi</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Sukunimi</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700">Sähköpostiosoite</label>
            <input
              id="emailAddress"
              name="emailAddress"
              type="email"
              value={formData.emailAddress}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">Yritys</label>
            <input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              placeholder="Yrityksen nimi"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titteli</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Titteli"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Puhelinnumero</label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address1" className="block text-sm font-medium text-gray-700">Sijainti</label>
            <input
              id="address1"
              name="address1"
              type="text"
              value={formData.address1}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="form-group">
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">WWW-osoite</label>
            <input
              id="website"
              name="website"
              type="text"
              value={formData.website}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="form-group col-span-2">
            <label htmlFor="searching" className="block text-sm font-medium text-gray-700">Etsimme</label>
            <textarea
              id="searching"
              name="searching"
              rows="5"
              value={formData.searching}
              onChange={handleChange}
              placeholder="Kirjoita tähän mitä etsitte ..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="form-group col-span-2">
            <label htmlFor="offering" className="block text-sm font-medium text-gray-700">Tarjoamme</label>
            <textarea
              id="offering"
              name="offering"
              rows="5"
              value={formData.offering}
              onChange={handleChange}
              placeholder="Kirjoita tähän mitä tarjoatte ..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="form-group col-span-2">
            <label htmlFor="notice" className="block text-sm font-medium text-gray-700">Kirjoita lyhyt esittely</label>
            <textarea
              id="notice"
              name="notice"
              rows="5"
              value={formData.notice}
              onChange={handleChange}
              placeholder="Kirjoita tähän esittelysi ..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="fileinput" className="block text-sm font-medium text-gray-700">Kuva</label>
            <input
              id="fileinput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:rounded-md file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {formData.profileImage && (
              <div className="mt-4">
                <img
                  src={formData.profileImage}
                  alt="Profile Preview"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Tallenna
          </button>
        </div>
      </div>
    </div>
  );
}
