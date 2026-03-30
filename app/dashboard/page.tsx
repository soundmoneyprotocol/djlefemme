'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Mail, MessageSquare, Calendar, DollarSign } from 'lucide-react';
import { getSession, signOut } from '../../lib/supabase';
import { isAdminUser } from '../../lib/adminConfig';

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
  const [earningsData, setEarningsData] = useState<any>(null);
  const [earningsLoading, setEarningsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookings' | 'chats' | 'earnings'>('bookings');
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load dashboard data (temporarily no auth required)
    const initializeDashboard = async () => {
      try {
        // Skip authentication check for now
        setUserEmail('Admin User');
        setIsAdmin(true);
        await fetchData();
      } catch (error) {
        console.error('Dashboard init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, chatsRes, earningsRes] = await Promise.all([
        fetch('/api/booking/submit'),
        fetch('/api/booking/chat'),
        fetch('/api/earnings/track'),
      ]);

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.bookings || []);
      }

      if (chatsRes.ok) {
        const chatsData = await chatsRes.json();
        setChatHistory(chatsData.messages || []);
      }

      if (earningsRes.ok) {
        const data = await earningsRes.json();
        setEarningsData(data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/dashboard/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 dark:from-black dark:via-purple-900 dark:to-black flex items-center justify-center'>
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
            <p className='text-xs sm:text-sm text-gray-400'>{userEmail}</p>
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
          <motion.button
            onClick={() => setActiveTab('earnings')}
            whileHover={{ scale: 1.05 }}
            className={`pb-2 px-3 sm:px-4 font-semibold transition ${
              activeTab === 'earnings'
                ? 'text-green-400 border-b-2 border-green-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <span className='flex items-center gap-2'>
              <DollarSign size={18} />
              <span className='hidden sm:inline'>Earnings</span>
              <span className='sm:hidden text-xs'>Earnings</span>
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
                  <p className='text-gray-600 dark:text-gray-400'>No bookings yet</p>
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
                        <p className='text-black dark:text-white font-semibold'>{booking.name}</p>
                      </div>
                      <div>
                        <p className='text-xs text-gray-400'>Email</p>
                        <p className='text-black dark:text-white font-mono text-sm break-all'>{booking.email}</p>
                      </div>
                      <div>
                        <p className='text-xs text-gray-400'>Phone</p>
                        <p className='text-black dark:text-white'>{booking.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className='text-xs text-gray-400'>Event Type</p>
                        <p className='text-white capitalize'>{booking.eventType}</p>
                      </div>
                      <div>
                        <p className='text-xs text-gray-400'>Event Date</p>
                        <p className='text-black dark:text-white'>{booking.eventDate || 'TBD'}</p>
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
                  <p className='text-gray-600 dark:text-gray-400'>No messages yet</p>
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
                        <p className='text-black dark:text-white font-mono text-sm break-all'>{chat.email}</p>
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

          {/* Earnings Section */}
          {activeTab === 'earnings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='space-y-4'
            >
              {!earningsData ? (
                <div className='text-center py-12 bg-neutral-900/30 border border-green-500/20 rounded-lg'>
                  <DollarSign size={48} className='mx-auto text-gray-500 mb-4' />
                  <p className='text-gray-600 dark:text-gray-400'>No earnings data yet</p>
                </div>
              ) : (
                <>
                  {/* Summary Stats */}
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='bg-gradient-to-br from-green-900/30 to-black border border-green-500/30 rounded-lg p-4'
                    >
                      <p className='text-gray-400 text-xs sm:text-sm'>Total Plays</p>
                      <p className='text-2xl sm:text-3xl font-bold text-green-400'>{earningsData.summary?.totalPlays || 0}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className='bg-gradient-to-br from-yellow-900/30 to-black border border-yellow-500/30 rounded-lg p-4'
                    >
                      <p className='text-gray-400 text-xs sm:text-sm'>Total Earnings</p>
<div className='space-y-1'>
                        <p className='text-2xl sm:text-3xl font-bold text-yellow-400'>{(earningsData.summary?.totalEarnings || 0).toFixed(2)} BZY</p>
                        <p className='text-lg sm:text-xl font-semibold text-green-400'>${((earningsData.summary?.totalEarnings || 0) * 2.4).toFixed(2)} USD</p>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className='bg-gradient-to-br from-blue-900/30 to-black border border-blue-500/30 rounded-lg p-4'
                    >
                      <p className='text-gray-400 text-xs sm:text-sm'>Avg per Play</p>
                      <p className='text-2xl sm:text-3xl font-bold text-blue-400'>{(earningsData.summary?.averageEarningsPerPlay || 0).toFixed(4)} BZY</p>
                    </motion.div>
                  </div>

                  {/* Track Stats */}
                  {earningsData.tracks?.map((track: any, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className='bg-gradient-to-br from-green-900/20 to-black border border-green-500/30 rounded-lg p-4 sm:p-6 space-y-3'
                    >
                      <div className='flex items-start justify-between gap-4'>
                        <div>
                          <p className='text-xs text-gray-400'>Track</p>
                          <p className='text-black dark:text-white font-semibold'>{track.trackTitle}</p>
                        </div>
                        <div className='text-right'>
                          <p className='text-xs text-gray-400'>Last Played</p>
                          <p className='text-white text-xs'>{track.lastPlayed ? new Date(track.lastPlayed).toLocaleString() : 'Never'}</p>
                        </div>
                      </div>
                      <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                        <div>
                          <p className='text-xs text-gray-400'>Play Count</p>
                          <p className='text-lg font-bold text-green-400'>{track.playCount}</p>
                        </div>
                        <div>
                          <p className='text-xs text-gray-400'>Total Earned</p>
                          <p className='text-lg font-bold text-yellow-400'>{track.totalEarnings.toFixed(2)} BZY</p>
                        </div>
                        <div>
                          <p className='text-xs text-gray-400'>Avg Earnings</p>
                          <p className='text-lg font-bold text-blue-400'>
                            {track.playCount > 0 ? (track.totalEarnings / track.playCount).toFixed(4) : '0.0000'} BZY
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
