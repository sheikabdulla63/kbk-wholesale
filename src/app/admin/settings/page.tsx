'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Settings, MapPin, Phone, Mail, Globe, Upload, Zap } from 'lucide-react';
import Image from 'next/image';
import { getContactInfo, updateContactInfo, setContactInfo, getCompanySettings } from '@/lib/firestore';
import { uploadImage } from '@/lib/storage';
import type { ContactInfo, CompanySettings } from '@/types';
import toast from 'react-hot-toast';

const EMPTY_CONTACT: ContactInfo = {
  phone: '', whatsapp: '', email: '', address: '', mapLink: '',
  workingHours: 'Mon – Sat: 9 AM – 7 PM', facebook: '', instagram: '', twitter: '', youtube: '',
};

export default function AdminSettingsPage() {
  const [contact, setContact] = useState<ContactInfo>(EMPTY_CONTACT);
  const [contactId, setContactId] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [activeTab, setActiveTab] = useState<'contact' | 'company'>('contact');

  useEffect(() => {
    const load = async () => {
      try {
        const ci = await getContactInfo();
        if (ci) { setContact(ci); setContactId(ci.id || null); }
      } catch { /* no contact info yet */ }
    };
    load();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContact(true);
    try {
      if (contactId) {
        await updateContactInfo(contactId, contact);
      } else {
        const id = await setContactInfo(contact);
        setContactId(id);
      }
      toast.success('Contact information saved!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save. Check Supabase config.');
    } finally { setSavingContact(false); }
  };

  const tabs = [
    { id: 'contact' as const, label: 'Contact Info', icon: Phone },
    { id: 'company' as const, label: 'Company', icon: Settings },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-white">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your company information and contact details</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              <Icon size={15} /> {tab.label}
            </button>
          );
        })}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {activeTab === 'contact' && (
          <form onSubmit={handleSaveContact} className="max-w-2xl space-y-5">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Phone size={16} className="text-blue-400" /> Contact Details
              </h2>

              {[
                { label: 'Phone Number', key: 'phone', icon: Phone, placeholder: '+91 98765 43210' },
                { label: 'WhatsApp Number', key: 'whatsapp', icon: Phone, placeholder: '+91 98765 43210' },
                { label: 'Email Address', key: 'email', icon: Mail, placeholder: 'info@kbkwholesale.in' },
              ].map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.key}>
                    <label className="block text-xs text-gray-400 font-medium mb-1.5">{field.label}</label>
                    <div className="relative">
                      <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        value={contact[field.key as keyof ContactInfo] as string}
                        onChange={(e) => setContact({ ...contact, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 pl-9 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                );
              })}

              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">Business Address</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-3 text-gray-500" />
                  <textarea
                    rows={3}
                    value={contact.address}
                    onChange={(e) => setContact({ ...contact, address: e.target.value })}
                    placeholder="Full business address..."
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 pl-9 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">Google Maps Link</label>
                <div className="relative">
                  <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="url"
                    value={contact.mapLink}
                    onChange={(e) => setContact({ ...contact, mapLink: e.target.value })}
                    placeholder="https://maps.google.com/..."
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 pl-9 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">Working Hours</label>
                <input
                  type="text"
                  value={contact.workingHours}
                  onChange={(e) => setContact({ ...contact, workingHours: e.target.value })}
                  placeholder="Mon – Sat: 9 AM – 7 PM"
                  className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-semibold">Social Media Links</h2>
              {[
                { key: 'facebook', label: 'Facebook URL' },
                { key: 'instagram', label: 'Instagram URL' },
                { key: 'twitter', label: 'Twitter/X URL' },
                { key: 'youtube', label: 'YouTube URL' },
              ].map((s) => (
                <div key={s.key}>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">{s.label}</label>
                  <input
                    type="url"
                    value={contact[s.key as keyof ContactInfo] as string || ''}
                    onChange={(e) => setContact({ ...contact, [s.key]: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              ))}
            </div>

            <button type="submit" disabled={savingContact} className="btn-primary px-7 py-3 disabled:opacity-60">
              {savingContact ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : <><Save size={16} />Save Contact Info</>}
            </button>
          </form>
        )}

        {activeTab === 'company' && (
          <div className="max-w-2xl space-y-5">
            {/* Logo upload */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-4">Company Logo</h2>
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                  {logoPreview ? (
                    <Image src={logoPreview} alt="logo" width={80} height={80} className="object-contain" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" fill="white" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="btn-outline text-sm px-4 py-2 cursor-pointer inline-flex items-center gap-2">
                    <Upload size={14} />
                    Upload Logo
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  </label>
                  <p className="text-xs text-gray-600 mt-2">PNG or SVG recommended. Max 2MB.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-semibold">Company Details</h2>
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-blue-300 text-sm">
                  ℹ️ Company name and description are currently set to KBK defaults. Supabase integration allows you to change these dynamically.
                </p>
              </div>
              {[
                { label: 'Company Name', value: 'KBK', placeholder: 'KBK' },
                { label: 'Tagline', value: 'Wholesale', placeholder: 'Your Trusted Partner' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">{f.label}</label>
                  <input
                    type="text" defaultValue={f.value} placeholder={f.placeholder}
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              ))}
            </div>

            <button className="btn-primary px-7 py-3">
              <Save size={16} /> Save Company Info
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
