import React, { useState, useEffect } from 'react';
import { portfolioService } from '../services/portfolioService';
import { usePortfolio } from '../context/PortfolioContext';
import { useToast } from '../components/Toast';
import { Mail, Phone, MapPin, Save, Loader2, Clock, MailCheck, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import SectionPublishBar from '../components/SectionPublishBar';
import { SkeletonCard } from '../components/Skeleton';



const MessagesPage = () => {

  const { portfolio, updatePortfolio, saving } = usePortfolio();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingContact, setUpdatingContact] = useState(false);

  const [contactForm, setContactForm] = useState({
    email: '',
    phone: '',
    location: '',
  });

  useEffect(() => {
    if (portfolio?.personalInfo) {
      setContactForm({
        email: portfolio.personalInfo.email || '',
        phone: portfolio.personalInfo.phone || '',
        location: portfolio.personalInfo.location || '',
      });
    }
  }, [portfolio]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await portfolioService.getMyMessages();
      if (res.success) {
        setMessages(res.messages);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContactInfo = async (e) => {
    e.preventDefault();
    setUpdatingContact(true);
    try {
      await updatePortfolio({
        personalInfo: {
          fullName: portfolio?.personalInfo?.fullName || '',
          title: portfolio?.personalInfo?.title || '',
          bio: portfolio?.personalInfo?.bio || '',
          avatar: portfolio?.personalInfo?.avatar || '',
          email: contactForm.email,
          phone: contactForm.phone,
          location: contactForm.location,
        },
        sectionsEnabled: {
          ...(portfolio?.sectionsEnabled || {}),
          inbox: true,
        },
      });
      toast('Contact details saved & published to portfolio live!', 'success');
    } catch (err) {
      toast('Failed to save contact details', 'error');
    } finally {
      setUpdatingContact(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await portfolioService.markMessageRead(id);
      toast('Message marked as read', 'info');
      fetchMessages();
    } catch (err) {
      toast('Failed to update message', 'error');
    }
  };

  if (loading) return <SkeletonCard />;

  return (
    <div className="space-y-8 animate-fade-in text-slate-900 font-sans pb-12">
      {/* Page Title */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" /> Contact Info & Messages Inbox
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage public contact details (Email, Phone, Location) and view visitor inquiries
          </p>
        </div>
      </div>

      <SectionPublishBar sectionId="inbox" title="Contact Info & Messages Section" />


      {/* 1. CONTACT DETAILS SETTINGS FORM CARD */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-2xs space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Send className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Portfolio Contact Information</h2>
            <p className="text-xs text-slate-500 font-medium">
              Enter the Email, Phone / WhatsApp, and Location to display on your portfolio's Contact section
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveContactInfo} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Email Field */}
            <div>
              <label className="block text-slate-700 mb-1.5 font-semibold flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Public Email</span>
              </label>
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="harsath137@gmail.com"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-600 font-medium transition"
              />
              <p className="text-[11px] text-slate-400 mt-1 font-medium">Displayed in Contact Me card</p>
            </div>

            {/* Phone / WhatsApp Field */}
            <div>
              <label className="block text-slate-700 mb-1.5 font-semibold flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Phone / WhatsApp Number</span>
              </label>
              <input
                type="text"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                placeholder="+91 6382245266"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-600 font-medium transition"
              />
              <p className="text-[11px] text-slate-400 mt-1 font-medium">Used for direct WhatsApp messaging</p>
            </div>

            {/* Location Field */}
            <div>
              <label className="block text-slate-700 mb-1.5 font-semibold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Location / Address</span>
              </label>
              <input
                type="text"
                value={contactForm.location}
                onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                placeholder="Pudukkottai, Tamil Nadu, India"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-600 font-medium transition"
              />
              <p className="text-[11px] text-slate-400 mt-1 font-medium">City, state, country</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updatingContact}
              className="gradient-btn px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition"
            >
              {updatingContact ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Contact Info...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Contact Info</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 2. VISITOR MESSAGES INBOX */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Received Visitor Messages ({messages.length})</span>
          </h2>
        </div>

        {messages.length === 0 ? (
          <div className="bg-white border border-slate-100 p-12 rounded-3xl text-center space-y-3 shadow-2xs">
            <Mail className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Your Inbox is Empty</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
              When recruiters or visitors fill out the Contact Me form on your public portfolio, their messages will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`p-6 rounded-2xl border transition shadow-2xs ${
                  msg.isRead
                    ? 'border-slate-100 bg-slate-50/50 text-slate-700'
                    : 'border-blue-200 bg-white ring-1 ring-blue-500/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs uppercase border border-blue-100">
                      {msg.senderName?.charAt(0) || 'V'}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{msg.senderName}</h3>
                      <p className="text-xs font-semibold text-blue-600">{msg.senderEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                    {!msg.isRead && (
                      <button
                        onClick={() => handleMarkRead(msg._id)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 transition"
                      >
                        <MailCheck className="w-3.5 h-3.5" />
                        <span>Mark Read</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1">
                  <p className="text-xs font-bold text-slate-800">{msg.subject || 'No Subject'}</p>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;

