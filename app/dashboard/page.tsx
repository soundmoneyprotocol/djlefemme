'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Mail, MessageSquare, Calendar, DollarSign } from 'lucide-react';

interface Booking {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  budget: string;
  details: string;
}

interface ChatMessage {
  email: string;
  message: string;
  timestamp: string;
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'chats'>('bookings');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('dashboardAuth');
    if (!auth) {
      router.push('/dashboard/login');
      return;
    }

    // Fetch data
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [bookingsRes, chatsRes] = await Promise.all([
        fetch('/api/booking/submit'),
        fetch('/api/booking/chat'),
      ]);

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.bookings || []);
      }

      if (chatsRes.ok) {
        const chatsData = await chatsRes.json();
        setChatHistory(chatsData.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dashboardAuth');
    router.push('/dashboard/login');
  };

  const handleExportCSV = (data: any[]) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header =>
          JSON.stringify(row[header] || '')
        ).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className='w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full'
        />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-purple-900 to-black'>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='sticky top-0 z-40 bg-black/80 backdrop-blur-sm border-b border-purple-500/20'
      >
        <div className='max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between'>
          <div>
            <h1 className='text-xl sm:text-2xl font-bold text-white'>Dashboard</h1>
            <p className='text-xs sm:text-sm text-gray-400'>Tasha Boué Admin Portal</p>
          </div>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 px-3 sm:px-4 py-2 rounded-lg transition text-sm'
          >
            <LogOut size={16} />
            <span className='hidden sm:inline'>Logout</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Tabs */}
      <div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8'>
        <div className='flex gap-2 sm:gap-4 mb-6 border-b border-purple-500/20'>
          <motion.button
            onClick={() => setActiveTab('bookings')}
            whileHover={{ scale: 1.05 }}
            className={`pb-2 px-3 sm:px-4 font-semibold transition ${
              activeTab === 'bookings'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <span className='flex items-center gap-2'>
              <Calendar size={18} />
              <span className='hidden sm:inline'>Bookings</span>
              <span className='sm:hidden text-xs'>({bookings.length})</span>
            </span>
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('chats')}
            whileHover={{ scale: 1.05 }}
            className={`pb-2 px-3 sm:px-4 font-semibold transition ${
              activeTab === 'chats'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <span className='flex items-center gap-2'>
              <MessageSquare size={18} />
              <span className='hidden sm:inline'>Messages</span>
              <span className='sm:hidden text-xs'>({chatHistory.length})</span>
            </span>
          </motion.button>
        </div>

        {/* Content */}
        <div className='space-y-4'>
          {/* Stats */}
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-gradient-to-br from-purple-900/30 to-black border border-purple-500/30 rounded-lg p-3 sm:p-4'
            >
              <p className='text-gray-400 text-xs sm:text-sm'>Total Bookings</p>
              <p className='text-2xl sm:text-3xl font-bold text-purple-400'>{bookings.length}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='bg-gradient-to-br from-blue-900/30 to-black border border-blue-500/30 rounded-lg p-3 sm:p-4'
            >
              <p className='text-gray-400 text-xs sm:text-sm'>Total Messages</p>
              <p className='text-2xl sm:text-3xl font-bold text-blue-400'>{chatHistory.length}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='bg-gradient-to-br from-green-900/30 to-black border border-green-500/30 rounded-lg p-3 sm:p-4 col-span-2 sm:col-span-1'
            >
              <p className='text-gray-400 text-xs sm:text-sm'>Total Budget</p>
              <p className='text-2xl sm:text-3xl font-bold text-green-400'>
                ${bookings.reduce((sum, b) => sum + (parseInt(b.budget) || 0), 0).toLocaleString()}
              </p>
            </motion.div>
          </div>

          {/* Export Button */}
          <motion.button
            onClick={() => handleExportCSV(activeTab === 'bookings' ? bookings : chatHistory)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg transition text-sm'
          >
            Export as CSV
          </motion.button>

          {/* Bookings Table */}
          {activeTab === 'bookings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='space-y-3 sm:space-y-4'
            >
              {bookings.length === 0 ? (
                <div className='text-center py-12 bg-neutral-900/30 border border-purple-500/20 rounded-lg'>
                  <Mail size={48} className='mx-auto text-gray-500 mb-4' />
                  <p className='text-gray-400'>No bookings yet</p>
                </div>
              ) : (
                bookings.map((booking, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className='bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-lg p-4 sm:p-6 space-y-3'
                  >
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                      <div>
                        <p className='text-xs text-gray-400'>Name</p>
                        <p className='text-white font-semibold'>{booking.name}</p>
                      </div>
                      <div>
                        <p className='text-xs text-gray-400'>Email</p>
                        <p className='text-white font-mono text-sm break-all'>{booking.email}</p>
                      </div>
                      <div>
                        <p className='text-xs text-gray-400'>Phone</p>
                        <p className='text-white'>{booking.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className='text-xs text-gray-400'>Event Type</p>
                        <p className='text-white capitalize'>{booking.eventType}</p>
                      </div>
                      <div>
                        <p className='text-xs text-gray-400'>Event Date</p>
                        <p className='text-white'>{booking.eventDate || 'TBD'}</p>
                      </div>
                      <div>
                        <p className='text-xs text-gray-400'>Budget</p>
                        <p className='text-green-400 font-semibold'>
                          ${parseInt(booking.budget) || 0}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className='text-xs text-gray-400 mb-1'>Details</p>
                      <p className='text-gray-300 text-sm bg-neutral-900/50 p-2 rounded line-clamp-2'>
                        {booking.details}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* Chat Messages */}
          {activeTab === 'chats' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='space-y-3 sm:space-y-4'
            >
              {chatHistory.length === 0 ? (
                <div className='text-center py-12 bg-neutral-900/30 border border-blue-500/20 rounded-lg'>
                  <MessageSquare size={48} className='mx-auto text-gray-500 mb-4' />
                  <p className='text-gray-400'>No messages yet</p>
                </div>
              ) : (
                chatHistory.map((chat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className='bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/30 rounded-lg p-4 sm:p-6 space-y-2'
                  >
                    <div className='flex items-start justify-between gap-4'>
                      <div>
                        <p className='text-xs text-gray-400'>From</p>
                        <p className='text-white font-mono text-sm break-all'>{chat.email}</p>
                      </div>
                      <div className='text-right'>
                        <p className='text-xs text-gray-400'>Time</p>
                        <p className='text-white text-xs'>
                          {new Date(chat.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className='text-xs text-gray-400 mb-1'>Message</p>
                      <p className='text-gray-300 text-sm bg-neutral-900/50 p-2 rounded'>
                        {chat.message}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
