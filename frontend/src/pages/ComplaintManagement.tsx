// VillageVerse AI: Citizen Grievance Redressal & Complaint Management
import React, { useState, useEffect } from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import { api } from '../services/api';
import { Complaint } from '../types';
import { 
  MessageSquareWarning, PlusCircle, CheckCircle, Clock, AlertTriangle, 
  MapPin, Mic, Camera, Sparkles, Filter, ChevronRight, UserCheck 
} from 'lucide-react';

export const ComplaintManagement: React.FC = () => {
  const { activePanchayat } = usePanchayat();
  const gpDisplayName = activePanchayat.name.replace(/\s*(Rural\s*)?Gram\s*Panchayat/i, '').trim() || activePanchayat.name;
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeStatus, setActiveStatus] = useState<string>('All');

  // Form inputs
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Water Supply');
  const [address, setAddress] = useState('Ward 2, Cross 3');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceAttached, setVoiceAttached] = useState(false);
  const [imageAttached, setImageAttached] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'All', 'Water Supply', 'Road Damage', 'Electricity / Streetlight', 
    'Garbage & Sanitation', 'Healthcare / PHC', 'Agriculture'
  ];

  useEffect(() => {
    loadComplaints();

    // Supabase Realtime live sync
    const channel = api.supabase
      .channel('realtime:complaints')
      .on(
        'postgres_changes' as any,
        { event: '*', schema: 'public', table: 'complaints' },
        () => {
          loadComplaints();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [activeCategory, activeStatus]);

  const loadComplaints = async () => {
    setLoading(true);
    const cat = activeCategory === 'All' ? undefined : activeCategory;
    const st = activeStatus === 'All' ? undefined : activeStatus;
    const list = await api.getComplaints(cat, st);
    setComplaints(list);
    setLoading(false);
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const newComp = await api.submitComplaint({
      citizen_name: citizenName || `${gpDisplayName} Resident`,
      citizen_phone: citizenPhone || '9845012399',
      title: title || 'Reported Issue',
      description: description || 'No details given',
      category,
      location_address: address,
      image_url: imageAttached ? '/uploads/mock_pothole_photo.jpg' : null,
      audio_url: voiceAttached ? '/uploads/mock_voice_memo.mp3' : null,
      lat: 12.563,
      lng: 76.892
    });
    setSubmitting(false);
    setShowNewModal(false);
    // Reset form
    setTitle('');
    setDescription('');
    setImageAttached(false);
    setVoiceAttached(false);
    loadComplaints();
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await api.updateComplaintStatus(id, newStatus);
    loadComplaints();
  };

  if (loading && complaints.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <MessageSquareWarning className="w-6 h-6 text-amber-400" />
            Citizen Grievance Redressal & AI Auto-Triage System
          </h1>
          <p className="text-xs text-slate-400">
            Gram Swaraj Citizen Portal • Geotagged Image & Voice Support • SLA Tracking
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Lodge Citizen Grievance</span>
        </button>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-medium border transition shrink-0 ${
              activeCategory === cat
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Complaints List / Kanban */}
      <div className="space-y-4">
        {complaints.map((c) => (
          <div key={c.id} className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5">
                <span className="font-mono text-xs font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                  {c.id}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  c.priority === 'Urgent' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                  c.priority === 'High' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {c.priority} Priority
                </span>
                <span className="text-xs text-slate-400 font-semibold">{c.category}</span>
              </div>

              {/* Status Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Status:</span>
                <select
                  value={c.status}
                  onChange={(e) => handleUpdateStatus(c.id, e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-emerald-400 focus:outline-none"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{c.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{c.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs py-2 border-y border-slate-800 text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{c.location_address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>By: {c.citizen_name} ({c.citizen_phone})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Confidence: <strong className="text-emerald-400">{c.ai_category_confidence || 96}%</strong></span>
              </div>
            </div>

            {/* Timeline */}
            {c.timeline && c.timeline.length > 0 && (
              <div className="space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Resolution History</span>
                <div className="space-y-1">
                  {c.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">{step.time}</span>
                      <span className="text-slate-300 truncate">{step.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Complaint Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl glass-panel border border-slate-700 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Lodge Citizen Grievance</h3>
                <p className="text-xs text-slate-400">Will be automatically triaged and assigned via AI</p>
              </div>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitComplaint} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Citizen Name</label>
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="e.g. Basavaraju Gowda"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Mobile Number</label>
                  <input
                    type="tel"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    placeholder="e.g. 9845012399"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Department Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="Water Supply">Water Supply (ಕುಡಿಯುವ ನೀರು)</option>
                  <option value="Road Damage">Road Damage (ರಸ್ತೆ ದುರಸ್ತಿ)</option>
                  <option value="Electricity / Streetlight">Electricity / Streetlight (ವಿದ್ಯುತ್ / ಬೀದಿ ದೀಪ)</option>
                  <option value="Garbage & Sanitation">Garbage & Sanitation (ಘನತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ)</option>
                  <option value="Healthcare / PHC">Healthcare / PHC (ಆರೋಗ್ಯ ಸೇವೆ)</option>
                  <option value="Agriculture">Agriculture (ಕೃಷಿ ಸಹಾಯ)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Issue Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Broken water pipe leaking on main road"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Detailed Grievance Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the problem, severity and exact spot..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Location Address / Landmark</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ward number and landmark"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>

              {/* Media Attachments: Photo and Voice */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setImageAttached(!imageAttached)}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                    imageAttached ? 'bg-emerald-950 border-emerald-500 text-emerald-400 font-semibold' : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>{imageAttached ? 'Photo Attached ✓' : 'Attach Photo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVoiceAttached(!voiceAttached)}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                    voiceAttached ? 'bg-emerald-950 border-emerald-500 text-emerald-400 font-semibold' : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>{voiceAttached ? 'Voice Note Attached ✓' : 'Record Voice Memo'}</span>
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>GPS Location: <strong className="text-emerald-400">12.5623° N, 76.8921° E</strong></span>
                <span className="text-emerald-400">Auto-Tagged ✓</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-semibold shadow-lg transition"
              >
                {submitting ? 'Auto-Triaging with AI...' : 'Submit Grievance to Gram Panchayat'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
