import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Camera, Mail, Building, Clock, Edit3, Save, LogOut, ArrowLeft } from 'lucide-react';
import user_img from '../assets/user_img.jpg';
import { AppLayout, PageContainer, PageHeader } from '../components/layouts';
import { Card, Avatar, Input, Textarea, Button } from '../components/ui';

function UserProfile() {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Page States
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState(null);
  const [avatar, setAvatar] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const [joined, setJoined] = useState('');

  // Fetch Profile data
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/user/${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Could not fetch user profile details');
        return res.json();
      })
      .then((profileData) => {
        setData(profileData);
        setName(profileData.user.user_name || '');
        setEmail(profileData.user.user_email || '');
        setCompany(profileData.user.user_company || '');
        setBio(profileData.user.user_bio || '');
        setJoined(profileData.user.createdAt || '');
      })
      .catch((err) => {
        toast.error(err.message || 'Error loading profile settings');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user_id, token]);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(`http://localhost:3000/user/${user_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_name: name,
          user_email: email,
          user_company: company,
          user_bio: bio,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.user) {
        throw new Error(result.message || 'Failed to save changes');
      }

      setData({ user: result.user });
      setName(result.user.user_name || '');
      setEmail(result.user.user_email || '');
      setCompany(result.user.user_company || '');
      setBio(result.user.user_bio || '');
      setJoined(result.user.createdAt || '');

      toast.success('Profile updated successfully!', { toastId: 'profile-update-success' });
      setEditMode(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save profile changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <PageContainer narrow className="py-10 flex flex-col gap-6">
          <div className="h-10 bg-slate-800/30 rounded-xl animate-pulse w-1/3 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-[280px] bg-slate-800/30 rounded-2xl animate-pulse" />
            <div className="md:col-span-2 h-[450px] bg-slate-800/30 rounded-2xl animate-pulse" />
          </div>
        </PageContainer>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageContainer narrow className="py-10">
        {/* Modern Header with Breadcrumbs */}
        <PageHeader
          breadcrumbs={[
            { label: 'Dashboard', onClick: () => navigate(`/${user_id}/dashboard`) },
            { label: 'User Profile' },
          ]}
          title="Account Settings"
          subtitle="Configure your freelance account metrics, biography, and professional identity credentials."
          gradientTitle
        />

        {/* 2-Column responsive profile grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Avatar & Meta Card */}
          <div className="flex flex-col gap-6">
            <Card 
              variant="default"
              className="flex flex-col items-center p-6 text-center bg-[#111119]/60 border border-white/[0.05] shadow-xl rounded-2xl relative overflow-hidden"
            >
              {/* Subtle accent line inside the card */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-violet-600 to-indigo-600" />
              
              {/* Avatar upload wrapper */}
              <div className="relative group mt-4">
                <Avatar
                  src={avatar || user_img}
                  name={name}
                  className="!w-24 !h-24 !text-2xl ring-4 ring-violet-500/20 group-hover:ring-violet-500/40 group-hover:scale-105 transition-all duration-300"
                />
                {editMode && (
                  <label className="absolute bottom-0 right-0 bg-violet-600 text-white p-2 rounded-full shadow-lg border border-[#0a0a0f] cursor-pointer hover:bg-violet-500 transition-colors duration-150">
                    <Camera size={15} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarChange} 
                    />
                  </label>
                )}
              </div>

              {/* Bio summary names */}
              <h3 className="mt-5 text-xl font-bold text-slate-100 truncate w-full px-2">
                {name}
              </h3>
              {company && (
                <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-violet-400">
                  <Building size={12} className="flex-shrink-0" />
                  <span className="truncate max-w-[150px]">{company}</span>
                </div>
              )}

              {/* Joined Date & Email */}
              <div className="w-full mt-6 pt-5 border-t border-white/[0.04] space-y-3 text-xs font-semibold text-slate-400 text-left">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-500 flex-shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-slate-500 flex-shrink-0" />
                  <span>
                    Joined {joined && new Date(joined).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>

              {/* Logout inside Left Sidebar Card */}
              <div className="w-full mt-6 pt-5 border-t border-white/[0.04]">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  fullWidth
                  className="!border-red-500/30 !text-red-400 hover:!bg-red-500/10 hover:!border-red-500/50"
                >
                  <LogOut size={14} className="mr-2" />
                  Log Out Account
                </Button>
              </div>
            </Card>

            {/* Back action */}
            <Button
              onClick={() => navigate(`/${user_id}/dashboard`)}
              variant="secondary"
              className="font-semibold shadow-inner"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Right Column: Editable Profile Fields Form */}
          <div className="md:col-span-2">
            <Card
              variant="default"
              className="p-6 bg-[#111119]/60 border border-white/[0.05] shadow-xl rounded-2xl"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.04]">
                <h3 className="text-base font-bold text-slate-100">
                  Profile Details
                </h3>
                {!editMode && (
                  <Button
                    onClick={() => setEditMode(true)}
                    variant="secondary"
                    size="sm"
                    className="font-semibold"
                  >
                    <Edit3 size={14} className="mr-1.5" />
                    Edit Details
                  </Button>
                )}
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!editMode || isSaving}
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    disabled // Email editing is disallowed by API contract
                    title="Account email addresses cannot be altered directly."
                    icon={Mail}
                  />
                </div>

                <Input
                  label="Company Name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={!editMode || isSaving}
                  required
                />

                <Textarea
                  label="Biography"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={!editMode || isSaving}
                  rows={4}
                  placeholder="Share a short bio summarizing your professional freelance achievements..."
                />

                {/* Form Save Button Actions */}
                {editMode && (
                  <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/[0.04]">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setEditMode(false);
                        // Reset forms to original data
                        if (data) {
                          setName(data.user.user_name || '');
                          setCompany(data.user.user_company || '');
                          setBio(data.user.user_bio || '');
                        }
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSaving}
                      className="font-semibold shadow-lg shadow-violet-500/20"
                    >
                      <Save size={14} className="mr-1.5" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </Card>
          </div>

        </div>

        {/* Elegant Minimal Footer */}
        <footer className="py-12 mt-12 text-center text-xs text-slate-600 border-t border-white/[0.03]">
          © {new Date().getFullYear()} SoloFlow. All rights reserved. Powered by premium management frameworks.
        </footer>
      </PageContainer>
    </AppLayout>
  );
}

export default UserProfile;
