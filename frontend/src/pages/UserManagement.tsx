// VillageVerse AI: User & Role-Based Access Control Management
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, UserRole } from '../types';
import { 
  Users, ShieldCheck, UserCheck, PlusCircle, CheckCircle, 
  Clock, Shield, ArrowRight 
} from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { switchRole, role: currentActiveRole } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const list = await api.getUsers();
    setUsers(list);
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await api.supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    } catch {}
    await api.apiClient.put(`/users/${userId}/role`, { role: newRole }).catch(() => {});
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const rolesList: UserRole[] = [
    'Admin',
    'Panchayat Officer',
    'Engineer',
    'Agriculture Officer',
    'Healthcare Officer',
    'Citizen'
  ];

  if (loading) {
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
            <Users className="w-6 h-6 text-emerald-400" />
            Panchayat User Directory & Department Roles
          </h1>
          <p className="text-xs text-slate-400">
            Role-Based Access Control (RBAC) • Department Assignment • Audit Trail
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300">
          Currently Simulating: <strong className="text-emerald-400">{currentActiveRole}</strong>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card p-5 rounded-3xl">
        <h3 className="text-sm font-bold text-white mb-1">Authorized Department Personnel</h3>
        <p className="text-xs text-slate-400 mb-4">Click "Switch Session to Role" to test the UI under any profile!</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Officer Name</th>
                <th className="py-2.5 px-3">Official Email</th>
                <th className="py-2.5 px-3">Assigned Department</th>
                <th className="py-2.5 px-3">Current Role</th>
                <th className="py-2.5 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                        {u.full_name[0]}
                      </div>
                      <div>
                        <div>{u.full_name}</div>
                        <div className="text-[10px] text-slate-500">{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono">{u.email}</td>
                  <td className="py-2.5 px-3 text-slate-300">{u.department}</td>
                  <td className="py-2.5 px-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-emerald-400 focus:outline-none"
                    >
                      {rolesList.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() => switchRole(u.role)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 text-[11px] font-semibold transition"
                    >
                      Act as {u.role.split(' ')[0]}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
