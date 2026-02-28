'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createExperience, updateExperience, deleteExperience } from '@/app/admin/experience-actions';
import type { ExperienceFormData } from '@/app/admin/experience-actions';

interface Experience {
  id: string;
  role: string;
  org: string;
  period: string;
  is_current: boolean;
  side: 'left' | 'right';
  sort_order: number;
}

interface Props {
  experiences: Experience[];
  userEmail: string;
}

const emptyForm: ExperienceFormData = {
  role: '',
  org: '',
  period: '',
  is_current: false,
  side: 'left',
  sort_order: 0,
};

export default function ManageExperiencesClient({ experiences: initial, userEmail }: Props) {
  const [experiences, setExperiences] = useState<Experience[]>(initial);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState<ExperienceFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function openAdd() {
    setForm({ ...emptyForm, sort_order: experiences.length });
    setEditing(null);
    setModal('add');
    setError('');
  }

  function openEdit(exp: Experience) {
    setForm({
      role: exp.role,
      org: exp.org,
      period: exp.period,
      is_current: exp.is_current,
      side: exp.side,
      sort_order: exp.sort_order,
    });
    setEditing(exp);
    setModal('edit');
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (modal === 'add') {
      const result = await createExperience(form);
      if (result.error) { setError(result.error); setLoading(false); return; }
      setExperiences(prev => [...prev, result.data as Experience].sort((a, b) => a.sort_order - b.sort_order));
    } else if (modal === 'edit' && editing) {
      const result = await updateExperience(editing.id, form);
      if (result.error) { setError(result.error); setLoading(false); return; }
      setExperiences(prev =>
        prev.map(e => e.id === editing.id ? { ...e, ...form } : e)
          .sort((a, b) => a.sort_order - b.sort_order)
      );
    }

    setLoading(false);
    setModal(null);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this experience?')) return;
    const result = await deleteExperience(id);
    if (result.error) { alert(result.error); return; }
    setExperiences(prev => prev.filter(e => e.id !== id));
  }

  return (
    <div className="min-h-screen bg-customdarkgrey-100 text-offwhite-100">
      {/* Header */}
      <header className="w-full px-6 md:px-12 py-6 border-b border-customgrey-100">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-customdarkgrey-100 font-semibold hover:scale-110 transition-transform">
                JB
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Manage Experiences</h1>
              <p className="text-sm text-muted-100">{userEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-muted-100 hover:text-offwhite-100 transition-colors">
              ← Dashboard
            </Link>
            <button
              onClick={openAdd}
              className="px-4 py-2 bg-accent-100 hover:bg-accent-200 text-offwhite-100 rounded-lg text-sm font-medium transition-colors"
            >
              + Add Experience
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 md:px-12 py-8">
        {experiences.length === 0 ? (
          <div className="bg-customgrey-100 rounded-xl p-12 text-center">
            <p className="text-muted-100 mb-4">No experiences yet.</p>
            <button onClick={openAdd} className="px-6 py-3 bg-accent-100 hover:bg-accent-200 rounded-lg text-sm font-medium transition-colors">
              Add your first experience
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="bg-customgrey-100 rounded-xl p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-base font-bold text-offwhite-100">{exp.role}</span>
                    {exp.is_current && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent-100/20 text-accent-200">Current</span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-customdarkgrey-100 text-muted-100">{exp.side}</span>
                  </div>
                  <p className="text-accent-200 text-sm">{exp.org}</p>
                  <p className="text-muted-100 text-xs">{exp.period} · Order: {exp.sort_order}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(exp)}
                    className="px-3 py-1.5 bg-customdarkgrey-100 hover:bg-accent-100/20 rounded-lg text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-customgrey-100 rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-5">{modal === 'add' ? 'Add Experience' : 'Edit Experience'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-offwhite-100 mb-1">Role / Title</label>
                <input
                  required
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full px-3 py-2 bg-customdarkgrey-100 border border-customgrey-100 rounded-lg text-offwhite-100 text-sm focus:outline-none focus:border-accent-100"
                  placeholder="e.g. Graphics Designer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-offwhite-100 mb-1">Organization</label>
                <input
                  required
                  value={form.org}
                  onChange={e => setForm(f => ({ ...f, org: e.target.value }))}
                  className="w-full px-3 py-2 bg-customdarkgrey-100 border border-customgrey-100 rounded-lg text-offwhite-100 text-sm focus:outline-none focus:border-accent-100"
                  placeholder="e.g. JP Chronicles"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-offwhite-100 mb-1">Period</label>
                <input
                  required
                  value={form.period}
                  onChange={e => setForm(f => ({ ...f, period: e.target.value }))}
                  className="w-full px-3 py-2 bg-customdarkgrey-100 border border-customgrey-100 rounded-lg text-offwhite-100 text-sm focus:outline-none focus:border-accent-100"
                  placeholder="e.g. 2023 – 2024"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-offwhite-100 mb-1">Timeline Side</label>
                  <select
                    value={form.side}
                    onChange={e => setForm(f => ({ ...f, side: e.target.value as 'left' | 'right' }))}
                    className="w-full px-3 py-2 bg-customdarkgrey-100 border border-customgrey-100 rounded-lg text-offwhite-100 text-sm focus:outline-none focus:border-accent-100"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-offwhite-100 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-customdarkgrey-100 border border-customgrey-100 rounded-lg text-offwhite-100 text-sm focus:outline-none focus:border-accent-100"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="is_current"
                  type="checkbox"
                  checked={form.is_current}
                  onChange={e => setForm(f => ({ ...f, is_current: e.target.checked }))}
                  className="w-4 h-4 accent-accent-100"
                />
                <label htmlFor="is_current" className="text-sm text-offwhite-100">Currently active role</label>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-accent-100 hover:bg-accent-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : modal === 'add' ? 'Add Experience' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="px-4 py-2 bg-customdarkgrey-100 hover:bg-customdarkgrey-100/60 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
