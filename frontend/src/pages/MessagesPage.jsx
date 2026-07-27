import React, { useState, useEffect } from 'react';
import { portfolioService } from '../services/portfolioService';
import { useToast } from '../components/Toast';
import { Mail, CheckCircle2, Clock, User, MailCheck } from 'lucide-react';
import { SkeletonCard } from '../components/Skeleton';

const MessagesPage = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Mail className="w-6 h-6 text-indigo-400" /> Visitor Messages Inbox ({messages.length})
        </h1>
        <p className="text-xs text-slate-400">Inquiries and messages sent via your portfolio contact form</p>
      </div>

      {messages.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Mail className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Your Inbox is Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When recruiters or clients send inquiries on your public portfolio, their messages will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`glass-card p-6 rounded-2xl border transition ${
                msg.isRead ? 'border-slate-800 bg-slate-950/40 opacity-80' : 'border-indigo-500/40 bg-slate-900/80 shadow-lg shadow-indigo-500/5'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase">
                    {msg.senderName?.charAt(0) || 'V'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{msg.senderName}</h3>
                    <p className="text-xs text-indigo-400">{msg.senderEmail}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                  {!msg.isRead && (
                    <button
                      onClick={() => handleMarkRead(msg._id)}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] flex items-center gap-1 transition"
                    >
                      <MailCheck className="w-3.5 h-3.5" />
                      <span>Mark Read</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 space-y-1">
                <p className="text-xs font-semibold text-slate-200">{msg.subject}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
