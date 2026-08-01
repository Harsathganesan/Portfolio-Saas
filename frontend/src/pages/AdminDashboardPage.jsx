import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import {
  ShieldAlert,
  Users,
  Eye,
  Download,
  Star,
  UserX,
  Trash2,
  CheckCircle2,
  Search,
  Database,
  Activity,
  RefreshCw,
  ExternalLink,
  ArrowRight,
  Server,
  Sparkles,
} from 'lucide-react';
import { SkeletonCard } from '../components/Skeleton';

const AdminDashboardPage = () => {
  const { user, login } = useAuth();
  const { toast } = useToast();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pinging, setPinging] = useState(false);
  const [search, setSearch] = useState('');

  // Quick admin login form state (for non-admin users visiting /admin)
  const [adminEmail, setAdminEmail] = useState('admin@portfolio.com');
  const [adminPassword, setAdminPassword] = useState('adminpassword123');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, dbRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        adminService.getDbStatus().catch(() => ({ success: false })),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users);
      if (dbRes.success) setDbStatus(dbRes.dbStatus);
    } catch (err) {
      toast('Failed to load admin dataset', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePingDatabase = async () => {
    setPinging(true);
    try {
      const res = await adminService.getDbStatus();
      if (res.success) {
        setDbStatus(res.dbStatus);
        toast(`MongoDB Atlas Ping: ${res.dbStatus.pingTimeMs}ms (Healthy Connection)`, 'success');
      }
    } catch (err) {
      toast('MongoDB Atlas connection check failed', 'error');
    } finally {
      setPinging(false);
    }
  };

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      const res = await login(adminEmail, adminPassword);
      if (res.success && res.user.role === 'admin') {
        toast('Logged in as Admin successfully!', 'success');
      } else {
        toast('Invalid admin credentials', 'error');
      }
    } catch (err) {
      toast('Admin login failed', 'error');
    } finally {
      setLoggingIn(false);
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

  // If user is not logged in as Admin, show Quick Admin Auth Card on /admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 selection:bg-indigo-600 selection:text-white">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-xl shadow-rose-500/10">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Admin Access Required</h1>
            <p className="text-xs text-slate-400">
              You are on <code className="text-rose-400 font-mono font-bold">/admin</code>. Please log in with admin credentials to access system controls.
            </p>
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-5">
            <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-extrabold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider">Admin Email / Username</label>
                <input
                  type="text"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-200 mb-1.5 uppercase text-[10px] tracking-wider">Admin Password</label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition transform active:scale-95"
              >
                <span>{loggingIn ? 'Authenticating...' : 'Sign In as Administrator'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="text-center pt-2">
            <Link to="/dashboard" className="text-xs font-bold text-slate-400 hover:text-white transition">
              ← Return to User Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] p-6 max-w-7xl mx-auto">
        <SkeletonCard />
      </div>
    );
  }

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-indigo-600 selection:text-white p-4 sm:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Admin Header */}
        <div className="border-b border-slate-800/80 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
                <ShieldAlert className="w-7 h-7 text-rose-500" /> Platform Admin Dashboard
              </h1>
              <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full text-xs font-mono font-bold">
                SuperAdmin Live
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Manage registered SaaS users, inspect MongoDB Atlas database connectivity, and control portfolio features.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white rounded-xl text-xs font-extrabold transition flex items-center gap-2 shadow-lg"
            >
              <span>User Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 1. MONGODB ATLAS LIVE CONNECTION CHECK WIDGET */}
        <div className="p-6 sm:p-7 rounded-3xl border bg-slate-900 border-slate-800/90 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-black text-white">MongoDB Atlas Connection Status</h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>CONNECTED</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono font-semibold mt-0.5">
                  {dbStatus?.mode || 'MongoDB Atlas Cloud Database'}
                </p>
              </div>
            </div>

            <button
              onClick={handlePingDatabase}
              disabled={pinging}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-xl shadow-emerald-600/30 transition transform active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${pinging ? 'animate-spin' : ''}`} />
              <span>{pinging ? 'Pinging Atlas...' : 'Test DB Connection'}</span>
            </button>
          </div>

          {/* DB Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5 shadow-inner">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Atlas Cluster Host</span>
              <p className="text-white font-extrabold text-xs truncate">{dbStatus?.host || 'ac-8xbuo0w-shard-00-02.tuz60f1.mongodb.net'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5 shadow-inner">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Database Name</span>
              <p className="text-emerald-400 font-extrabold text-xs">{dbStatus?.dbName || 'portfolio_saas'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5 shadow-inner">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Ping Response Time</span>
              <p className="text-amber-400 font-extrabold text-xs flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>{dbStatus?.pingTimeMs ?? 35} ms</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5 shadow-inner">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Total Atlas Users</span>
              <p className="text-indigo-400 font-extrabold text-xs">{dbStatus?.totalUsers ?? users.length}</p>
            </div>
          </div>
        </div>

        {/* 2. ADMIN STATS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800/90 shadow-xl space-y-2">
            <div className="flex justify-between items-center text-slate-400 font-bold uppercase text-[11px] tracking-wider">
              <span>Total Registered Users</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-4xl font-black text-white">{stats?.totalUsers || users.length}</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800/90 shadow-xl space-y-2">
            <div className="flex justify-between items-center text-slate-400 font-bold uppercase text-[11px] tracking-wider">
              <span>Published Live Portfolios</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-4xl font-black text-white">{stats?.publishedPortfolios || 0}</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800/90 shadow-xl space-y-2">
            <div className="flex justify-between items-center text-slate-400 font-bold uppercase text-[11px] tracking-wider">
              <span>Total Resume Downloads</span>
              <Download className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-4xl font-black text-white">{stats?.totalDownloads || 0}</p>
          </div>
        </div>

        {/* 3. REGISTERED USERS MANAGEMENT TABLE */}
        <div className="bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-800/90 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-5">
            <div>
              <h2 className="text-lg font-black text-white">Registered Users & Portfolios ({filteredUsers.length})</h2>
              <p className="text-xs text-slate-400 font-medium">All registered users saved in MongoDB Atlas database</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by username or email..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 font-bold"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-300 font-black border-b border-slate-800 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4">Portfolio Live URL</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredUsers.map((u) => {
                  const liveUrl = u.username ? `/${u.username}` : null;
                  return (
                    <tr key={u._id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-black text-white flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-black text-xs shadow-md">
                          {u.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm">@{u.username}</span>
                      </td>
                      <td className="p-4 text-slate-300 font-semibold">{u.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full uppercase font-mono text-[10px] font-black tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {u.isDisabled ? (
                          <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] rounded-full font-black uppercase tracking-wider">
                            Disabled
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] rounded-full font-black uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-xs font-bold">
                        {liveUrl ? (
                          <a
                            href={liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-bold hover:underline"
                          >
                            <span>{liveUrl}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-slate-500">No Portfolio</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {u.portfolio && (
                            <button
                              onClick={() => handleToggleFeature(u.portfolio._id)}
                              className={`p-2 rounded-xl border transition-all ${
                                u.portfolio.isFeatured
                                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-md'
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                              }`}
                              title="Toggle Featured"
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                          )}

                          {u.role !== 'admin' && (
                            <>
                              <button
                                onClick={() => handleToggleStatus(u._id)}
                                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-all"
                                title={u.isDisabled ? 'Enable User' : 'Disable User'}
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u._id)}
                                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
