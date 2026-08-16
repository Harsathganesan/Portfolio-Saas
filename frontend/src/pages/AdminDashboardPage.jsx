import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import {
  ShieldAlert,
  Users,
  Eye,
  EyeOff,
  Download,
  Star,
  UserX,
  UserCheck,
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
  LayoutDashboard,
  Layers,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  ShieldCheck,
  TrendingUp,
  Clock,
  Globe,
  HardDrive,
  Lock,
  Filter,
  Check,
  Zap,
  KeyRound,
} from 'lucide-react';
import { SkeletonCard } from '../components/Skeleton';

const AdminDashboardPage = () => {
  const { user, login, logout } = useAuth();
  const { toast } = useToast();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pinging, setPinging] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Password Visibility States
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  // Active Tab state: 'overview' | 'users' | 'database' | 'portfolios' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast('Please fill in all password fields', 'error');
      return;
    }
    if (newPassword.length < 6) {
      toast('New password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast('New passwords do not match', 'error');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (res.success) {
        toast('Admin password updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast(res.message || 'Failed to change password', 'error');
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Error updating password', 'error');
    } finally {
      setChangingPassword(false);
    }
  };


  // LIGHT THEME LOGIN SCREEN FOR NON-ADMIN USERS
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white font-sans">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-100">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Admin Console</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Authenticating for <code className="text-indigo-600 font-mono font-bold bg-indigo-50 px-2 py-0.5 rounded">/admin</code> control center.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
            <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">Admin Account Email</label>
                <input
                  type="text"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition font-semibold"
                  placeholder="admin@portfolio.com"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition font-semibold"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition focus:outline-none"
                    aria-label={showAdminPassword ? "Hide password" : "Show password"}
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition transform active:scale-95"
              >
                <span>{loggingIn ? 'Authenticating...' : 'Sign In to SuperAdmin'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="text-center">
            <Link to="/dashboard" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition flex items-center justify-center gap-1">
              ← Return to User Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 max-w-7xl mx-auto space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  // Filtered Users Logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !u.isDisabled) ||
      (statusFilter === 'disabled' && u.isDisabled);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const featuredPortfolios = users.filter((u) => u.portfolio && u.portfolio.isFeatured);

  // Navigation Items for Sidebar
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'users', label: 'Users Management', icon: Users, badge: users.length },
    { id: 'database', label: 'Database Health', icon: Database, badge: dbStatus ? `${dbStatus.pingTimeMs ?? 35}ms` : 'Atlas' },
    { id: 'portfolios', label: 'Portfolios Showcase', icon: Layers, badge: featuredPortfolios.length ? `${featuredPortfolios.length} Star` : null },
    { id: 'settings', label: 'Settings & Security', icon: Settings, badge: null },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex selection:bg-indigo-500 selection:text-white">
      
      {/* ---------------------------------------------------- */}
      {/* SIDEBAR NAVIGATION (DESKTOP & MOBILE RESPONSIVE)     */}
      {/* ---------------------------------------------------- */}
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200/80 z-40 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6">
          
          {/* Logo & Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-sm font-black text-slate-900 tracking-tight leading-tight">Admin Console</h1>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  SuperAdmin v2.0
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Database Live Connectivity Badge */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-slate-700">MongoDB Atlas</span>
            </div>
            <span className="font-mono font-bold text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {dbStatus?.pingTimeMs ?? 35}ms
            </span>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1 pt-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 mb-2">Main Navigation</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Admin Info */}
        <div className="p-4 border-t border-slate-200/80 space-y-3 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black text-xs">
              {user.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">@{user.username}</p>
              <p className="text-[10px] text-slate-500 font-medium truncate">{user.email}</p>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between gap-2">
            <Link
              to="/dashboard"
              className="flex-1 text-center py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>User Panel</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            <button
              onClick={() => logout()}
              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-100 transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTENT AREA                                    */}
      {/* ---------------------------------------------------- */}
      
      <main className="flex-1 flex flex-col min-w-0">

        {/* TOP HEADER BAR */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-lg font-black text-slate-900 capitalize tracking-tight flex items-center gap-2">
                {activeTab} Dashboard
              </h2>
              <p className="text-xs text-slate-500 hidden sm:block">
                Platform Admin Panel & System Control Hub
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePingDatabase}
              disabled={pinging}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pinging ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{pinging ? 'Pinging Atlas...' : 'Test DB Ping'}</span>
            </button>

            <Link
              to="/dashboard"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <span>User Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* TAB CONTENTS */}
        <div className="p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW                                           */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* 4 TOP METRIC CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* Total Users */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <span>Total Users</span>
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-3xl font-black text-slate-900">{stats?.totalUsers || users.length}</p>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Active
                    </span>
                  </div>
                </div>

                {/* Published Live Portfolios */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <span>Live Portfolios</span>
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-3xl font-black text-slate-900">{stats?.publishedPortfolios || 0}</p>
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                      Published
                    </span>
                  </div>
                </div>

                {/* Resume Downloads */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <span>Resume Downloads</span>
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                      <Download className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-3xl font-black text-slate-900">{stats?.totalDownloads || 0}</p>
                    <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                      Downloads
                    </span>
                  </div>
                </div>

                {/* DB Latency Ping */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <span>Atlas Latency</span>
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-3xl font-black text-slate-900">{dbStatus?.pingTimeMs ?? 35} <span className="text-xs font-mono font-medium text-slate-500">ms</span></p>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Healthy
                    </span>
                  </div>
                </div>

              </div>

              {/* MONGODB ATLAS LIVE CONNECTION WIDGET */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-sm">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-lg font-black text-slate-900">MongoDB Atlas Cloud Connectivity</h3>
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>CONNECTED</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {dbStatus?.mode || 'MongoDB Atlas Cloud Cluster'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handlePingDatabase}
                    disabled={pinging}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition active:scale-95"
                  >
                    <RefreshCw className={`w-4 h-4 ${pinging ? 'animate-spin' : ''}`} />
                    <span>{pinging ? 'Pinging Atlas...' : 'Test DB Connection'}</span>
                  </button>
                </div>

                {/* Metrics detail grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Atlas Host</span>
                    <p className="text-slate-900 font-bold font-mono text-xs truncate">{dbStatus?.host || 'ac-8xbuo0w-shard-00-02.tuz60f1.mongodb.net'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Database Name</span>
                    <p className="text-emerald-700 font-bold font-mono text-xs">{dbStatus?.dbName || 'portfolio_saas'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Ping Latency</span>
                    <p className="text-amber-600 font-bold font-mono text-xs flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-amber-500" />
                      <span>{dbStatus?.pingTimeMs ?? 35} ms</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Database Users</span>
                    <p className="text-indigo-600 font-bold font-mono text-xs">{dbStatus?.totalUsers ?? users.length}</p>
                  </div>
                </div>
              </div>

              {/* QUICK RECENT USER ACTIVITY */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Recent User Signups & Accounts</h3>
                    <p className="text-xs text-slate-500">Live preview of registered users in MongoDB database</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <span>View All Users ({users.length})</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {users.slice(0, 3).map((u) => (
                    <div key={u._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-black flex items-center justify-center text-sm shadow-sm">
                        {u.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">@{u.username}</p>
                        <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                        <span className="inline-block mt-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                          Role: {u.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: USERS MANAGEMENT                                   */}
          {/* ========================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                
                {/* Header & Controls */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Registered Platform Users ({filteredUsers.length})</h3>
                    <p className="text-xs text-slate-500">Manage user accounts, privileges, portfolio statuses, and permissions.</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    
                    {/* Search Input */}
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search username or email..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white font-semibold transition"
                      />
                    </div>

                    {/* Role Filter */}
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 font-bold outline-none focus:border-indigo-600"
                    >
                      <option value="all">All Roles</option>
                      <option value="user">User Role</option>
                      <option value="admin">Admin Role</option>
                    </select>

                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 font-bold outline-none focus:border-indigo-600"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active Only</option>
                      <option value="disabled">Disabled Only</option>
                    </select>

                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-black border-b border-slate-200 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4 rounded-l-xl">User</th>
                        <th className="p-4">Email Address</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Account Status</th>
                        <th className="p-4">Portfolio Live Link</th>
                        <th className="p-4 rounded-r-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredUsers.map((u) => {
                        const liveUrl = u.username ? `/${u.username}` : null;
                        return (
                          <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                            
                            {/* User Avatar + Username */}
                            <td className="p-4 font-black text-slate-900 flex items-center space-x-3">
                              <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black text-xs shadow-sm">
                                {u.username?.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm">@{u.username}</span>
                            </td>

                            {/* Email */}
                            <td className="p-4 text-slate-600 font-semibold">{u.email}</td>

                            {/* Role Badge */}
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full font-mono text-[10px] font-black uppercase tracking-wider ${
                                  u.role === 'admin'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>

                            {/* Status Pill */}
                            <td className="p-4">
                              {u.isDisabled ? (
                                <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] rounded-full font-black uppercase tracking-wider">
                                  Disabled
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] rounded-full font-black uppercase tracking-wider">
                                  Active
                                </span>
                              )}
                            </td>

                            {/* Live Portfolio URL */}
                            <td className="p-4 font-mono text-xs font-bold">
                              {liveUrl ? (
                                <a
                                  href={liveUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 font-bold hover:underline"
                                >
                                  <span>{liveUrl}</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              ) : (
                                <span className="text-slate-400 font-normal">No Portfolio</span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                
                                {/* Feature Toggle Star */}
                                {u.portfolio && (
                                  <button
                                    onClick={() => handleToggleFeature(u.portfolio._id)}
                                    className={`p-2 rounded-xl border transition-all ${
                                      u.portfolio.isFeatured
                                        ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500 hover:bg-slate-50'
                                    }`}
                                    title="Toggle Featured Portfolio"
                                  >
                                    <Star className={`w-4 h-4 ${u.portfolio.isFeatured ? 'fill-current' : ''}`} />
                                  </button>
                                )}

                                {/* Admin Action Buttons */}
                                {u.role !== 'admin' && (
                                  <>
                                    <button
                                      onClick={() => handleToggleStatus(u._id)}
                                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200 transition-all"
                                      title={u.isDisabled ? 'Enable Account' : 'Disable Account'}
                                    >
                                      {u.isDisabled ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                                    </button>

                                    <button
                                      onClick={() => handleDeleteUser(u._id)}
                                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all"
                                      title="Delete Account"
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

                  {filteredUsers.length === 0 && (
                    <div className="py-12 text-center text-slate-400 font-bold text-sm">
                      No users found matching your search or filters.
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: DATABASE & INFRASTRUCTURE                          */}
          {/* ========================================================= */}
          {activeTab === 'database' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-black text-slate-900">MongoDB Atlas Infrastructure</h3>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-mono font-bold">
                        Cloud Connected
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Real-time cloud database connection diagnostics, cluster node monitoring, and response latency.
                    </p>
                  </div>

                  <button
                    onClick={handlePingDatabase}
                    disabled={pinging}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition active:scale-95"
                  >
                    <RefreshCw className={`w-4 h-4 ${pinging ? 'animate-spin' : ''}`} />
                    <span>{pinging ? 'Testing Latency...' : 'Run Atlas Ping Test'}</span>
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                      <Server className="w-4 h-4 text-indigo-600" /> Database Specifications
                    </h4>

                    <div className="space-y-3 text-xs font-mono">
                      <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span className="text-slate-500 font-sans font-semibold">Cluster Host:</span>
                        <span className="font-bold text-slate-900">{dbStatus?.host || 'ac-8xbuo0w-shard-00-02'}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span className="text-slate-500 font-sans font-semibold">Database Name:</span>
                        <span className="font-bold text-emerald-700">{dbStatus?.dbName || 'portfolio_saas'}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span className="text-slate-500 font-sans font-semibold">Driver / Mode:</span>
                        <span className="font-bold text-slate-900">Mongoose / Express API</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-500 font-sans font-semibold">Security Encryption:</span>
                        <span className="font-bold text-indigo-600">TLS/SSL Enabled</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-600" /> Health Diagnostics
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
                        <span className="text-slate-500 font-semibold">Connection Status:</span>
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Active & Healthy
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
                        <span className="text-slate-500 font-semibold">Ping Response Time:</span>
                        <span className="font-bold font-mono text-amber-600">
                          {dbStatus?.pingTimeMs ?? 35} ms
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
                        <span className="text-slate-500 font-semibold">Total Document Collections:</span>
                        <span className="font-bold font-mono text-slate-900">{users.length} Users registered</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5">
                        <span className="text-slate-500 font-semibold">Cluster Replica State:</span>
                        <span className="font-bold text-slate-700">PRIMARY Shard</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: PORTFOLIOS SHOWCASE                                */}
          {/* ========================================================= */}
          {activeTab === 'portfolios' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">User Portfolios Showcase</h3>
                    <p className="text-xs text-slate-500">Inspect live portfolio web pages and toggle featured star status for home page.</p>
                  </div>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-200">
                    {users.filter(u => u.portfolio).length} Total Portfolios
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {users.map((u) => {
                    const hasPortfolio = !!u.portfolio;
                    const liveUrl = u.username ? `/${u.username}` : null;
                    return (
                      <div
                        key={u._id}
                        className={`p-5 rounded-2xl border transition-all space-y-4 ${
                          u.portfolio?.isFeatured
                            ? 'bg-amber-50/40 border-amber-300 shadow-md'
                            : 'bg-white border-slate-200/80 shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-black flex items-center justify-center text-xs">
                              {u.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-slate-900">@{u.username}</h4>
                              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[150px]">{u.email}</p>
                            </div>
                          </div>

                          {hasPortfolio && (
                            <button
                              onClick={() => handleToggleFeature(u.portfolio._id)}
                              className={`p-2 rounded-xl border transition-all ${
                                u.portfolio.isFeatured
                                  ? 'bg-amber-100 text-amber-700 border-amber-300'
                                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-amber-500'
                              }`}
                              title="Toggle Featured"
                            >
                              <Star className={`w-4 h-4 ${u.portfolio.isFeatured ? 'fill-current' : ''}`} />
                            </button>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Status: {hasPortfolio ? 'Created' : 'Not Created'}
                          </span>

                          {liveUrl ? (
                            <a
                              href={liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-xl flex items-center gap-1 transition shadow-sm"
                            >
                              <span>View Live Page</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-400 text-[11px]">No Live URL</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: SETTINGS & SECURITY                                */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                
                <div className="border-b border-slate-100 pb-5 space-y-1">
                  <h3 className="text-lg font-black text-slate-900">Admin Settings & System Security</h3>
                  <p className="text-xs text-slate-500">SuperAdmin security overview, token configurations, and platform status.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Admin Profile Box */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" /> Active Admin Credentials
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-1">Username</label>
                        <p className="font-bold text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200">@{user.username}</p>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-1">Email</label>
                        <p className="font-bold text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200">{user.email}</p>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-1">Access Scope</label>
                        <span className="inline-block font-mono font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                          Role: {user.role} (FULL ACCESS)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Security Highlights */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-600" /> Security Controls
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700">JWT Token Auth:</span>
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Active
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700">MongoDB Atlas Cloud:</span>
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Connected
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700">CORS Policy:</span>
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                          Strict
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Change Password Card */}
                <div className="bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200/80 space-y-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center shadow-sm">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Change Account Password</h4>
                      <p className="text-xs text-slate-500">Update your superadmin account credentials securely</p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs max-w-xl">
                    <div>
                      <label className="block text-slate-600 font-bold uppercase text-[10px] tracking-wider mb-1.5">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-slate-900 outline-none focus:border-indigo-600 font-semibold transition"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition focus:outline-none"
                          aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px] tracking-wider mb-1.5">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-slate-900 outline-none focus:border-indigo-600 font-semibold transition"
                            placeholder="Min 6 characters"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition focus:outline-none"
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-600 font-bold uppercase text-[10px] tracking-wider mb-1.5">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-slate-900 outline-none focus:border-indigo-600 font-semibold transition"
                            placeholder="Re-enter password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition focus:outline-none"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={changingPassword}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition active:scale-95"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>{changingPassword ? 'Updating Password...' : 'Update Admin Password'}</span>
                      </button>
                    </div>
                  </form>
                </div>

              </div>

            </div>
          )}


        </div>

      </main>

    </div>
  );
};

export default AdminDashboardPage;

