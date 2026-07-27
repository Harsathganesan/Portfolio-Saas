import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useToast } from '../components/Toast';
import { ShieldAlert, Users, Eye, Download, Star, UserX, Trash2, CheckCircle2, Search } from 'lucide-react';
import { SkeletonCard } from '../components/Skeleton';

const AdminDashboardPage = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([adminService.getStats(), adminService.getUsers()]);
      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users);
    } catch (err) {
      toast('Failed to load admin dataset', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await adminService.toggleUserStatus(userId);
      if (res.success) {
        toast(res.message, 'info');
        fetchAdminData();
      }
    } catch (err) {
      toast('Action failed', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user and all associated portfolio data?')) return;
    try {
      const res = await adminService.deleteUser(userId);
      if (res.success) {
        toast('User permanently deleted', 'success');
        fetchAdminData();
      }
    } catch (err) {
      toast('Failed to delete user', 'error');
    }
  };

  const handleToggleFeature = async (portfolioId) => {
    if (!portfolioId) return;
    try {
      const res = await adminService.toggleFeaturePortfolio(portfolioId);
      if (res.success) {
        toast(res.message, 'success');
        fetchAdminData();
      }
    } catch (err) {
      toast('Action failed', 'error');
    }
  };

  if (loading) return <SkeletonCard />;

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in p-6 max-w-7xl mx-auto text-slate-100">
      <div className="border-b border-slate-800 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-400" /> Platform Admin Dashboard
          </h1>
          <p className="text-xs text-slate-400">Manage registered SaaS users, view system metrics, and feature portfolios</p>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Total Registered Users</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats?.totalUsers || 0}</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Published Portfolios</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats?.publishedPortfolios || 0}</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Platform Total Views</span>
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats?.totalViews || 0}</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Total Resume Downloads</span>
            <Download className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats?.totalDownloads || 0}</p>
        </div>
      </div>

      {/* Users Management Table */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-base font-bold text-white">Registered Users ({filteredUsers.length})</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user or email..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Portfolio Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-bold text-white flex items-center space-x-2">
                    <span>@{u.username}</span>
                    {u.isDisabled && <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 text-[9px] rounded font-semibold">Disabled</span>}
                  </td>
                  <td className="p-3 text-slate-400">{u.email}</td>
                  <td className="p-3 uppercase font-mono text-[10px] text-indigo-400 font-bold">{u.role}</td>
                  <td className="p-3">
                    {u.portfolio ? (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${u.portfolio.isPublished ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                        {u.portfolio.isPublished ? 'Published' : 'Draft'}
                      </span>
                    ) : (
                      <span className="text-slate-600">None</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      {u.portfolio && (
                        <button
                          onClick={() => handleToggleFeature(u.portfolio._id)}
                          className={`p-1.5 rounded-lg border transition ${
                            u.portfolio.isFeatured
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                          title="Toggle Featured"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                      )}

                      {u.role !== 'admin' && (
                        <>
                          <button
                            onClick={() => handleToggleStatus(u._id)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition"
                            title={u.isDisabled ? 'Enable User' : 'Disable User'}
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
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

export default AdminDashboardPage;
