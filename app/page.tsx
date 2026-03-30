'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Video {
  id: string;
  src: string;
  title: string;
}

const videos: Video[] = [
  {
    id: '1',
    src: '/videos/ET_Jaime_Tasha.mp4',
    title: 'Mini Doc'
  },
  {
    id: '2',
    src: '/videos/TashaBoue_MiniDoc_Pt1.mp4',
    title: 'Mini Doc Part 1'
  },
  {
    id: '3',
    src: '/videos/ET_Jaime_Tasha_Long_form.mp4',
    title: 'Long Form'
  }
];



// ReferralSection Component
const ReferralSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    totalReferrals: 247,
    bzyEarned: 1240,
    conversions: 128,
  });
  const referralLink = 'https://os.soundmoneyprotocol.xyz/profile/lefemme?ref=LEFEMME2024';

  useEffect(() => {
    // Fetch referral stats from API
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/referrals/track?code=lefemme');
        if (response.ok) {
          const data = await response.json();
          setStats({
            totalReferrals: data.data.totalReferrals || stats.totalReferrals,
            bzyEarned: Math.round(data.data.bzyEarned || stats.bzyEarned),
            conversions: data.data.conversions || stats.conversions,
          });
        }
      } catch (error) {
        console.error('Failed to fetch referral stats:', error);
      }
    };

    fetchStats();
  }, []);

  const conversionRate = stats.totalReferrals > 0 
    ? Math.round((stats.conversions / stats.totalReferrals) * 100)
    : 0;

  const handleCopy = async () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    
    // Track the copy/share action
    try {
      await fetch('/api/referrals/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrerCode: 'lefemme',
          eventType: 'click',
        }),
      });
    } catch (error) {
      console.error('Failed to track referral click:', error);
    }
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className='relative z-10 bg-gradient-to-b from-white via-green-50/50 to-white dark:from-black dark:via-green-900/10 dark:to-black py-20 px-6'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-12'>
          <h2 className='text-4xl md:text-5xl font-bold text-black dark:text-white mb-4 text-center'>Earn with SoundMoney</h2>
          <p className='text-lg text-gray-700 dark:text-gray-300 text-center'>Share your unique referral link and earn streaming rewards</p>
        </div>

        <div className='grid md:grid-cols-1 gap-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='bg-gradient-to-br from-green-50 to-white dark:from-green-900/30 dark:to-black border border-green-300 dark:border-green-500/30 rounded-2xl p-8 space-y-6'
          >
            {/* Referral Link Box */}
            <div className='space-y-3'>
              <p className='text-sm font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider'>Your Referral Link</p>
              <div className='relative'>
                <input
                  type='text'
                  value={referralLink}
                  readOnly
                  className='w-full bg-white dark:bg-neutral-900/50 border border-green-300 dark:border-green-500/30 rounded-lg px-4 py-3 text-black dark:text-white text-sm font-mono focus:outline-none'
                />
                <motion.button
                  onClick={handleCopy}
                  animate={{ backgroundColor: copied ? '#10b981' : '#16a34a' }}
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold transition'
                >
                  {copied ? 'Copied!' : 'Copy'}
                </motion.button>
              </div>
            </div>

            {/* Referral Stats */}
            <div className='border-t border-green-500/20 pt-6 space-y-3'>
              <p className='text-sm font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider'>Referral Stats</p>
              <div className='grid grid-cols-3 gap-4'>
                <div className='bg-green-50 dark:bg-neutral-900/50 border border-green-300 dark:border-green-500/20 rounded-lg p-4 text-center'>
                  <p className='text-2xl font-bold text-green-700 dark:text-green-400'>247</p>
                  <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>Total Referrals</p>
                </div>
                <div className='bg-green-50 dark:bg-neutral-900/50 border border-green-300 dark:border-green-500/20 rounded-lg p-4 text-center'>
                  <p className='text-2xl font-bold text-green-700 dark:text-green-400'>1,240</p>
                  <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>BZY Earned</p>
                </div>
                <div className='bg-green-50 dark:bg-neutral-900/50 border border-green-300 dark:border-green-500/20 rounded-lg p-4 text-center'>
                  <p className='text-2xl font-bold text-green-700 dark:text-green-400'>52%</p>
                  <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>Conversion Rate</p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className='border-t border-green-500/20 pt-6 space-y-3'>
              <p className='text-sm font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider'>Referral Benefits</p>
              <ul className='space-y-2 text-sm text-gray-300'>
                <li className='flex items-center gap-2'>
                  <span className='text-green-700 dark:text-green-400'>✓</span>
                  <span>Earn 10% of referred user's streaming earnings</span>
                </li>
                <li className='flex items-center gap-2'>
                  <span className='text-green-700 dark:text-green-400'>✓</span>
                  <span>Unlimited referral earning potential</span>
                </li>
                <li className='flex items-center gap-2'>
                  <span className='text-green-700 dark:text-green-400'>✓</span>
                  <span>Real-time tracking dashboard</span>
                </li>
                <li className='flex items-center gap-2'>
                  <span className='text-green-700 dark:text-green-400'>✓</span>
                  <span>Weekly BZY payouts to your wallet</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className='border-t border-green-500/20 pt-6'>
              <a
                href='https://os.soundmoneyprotocol.xyz/profile/lefemme'
                target='_blank'
                rel='noopener noreferrer'
                className='w-full bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-500 dark:to-emerald-600 hover:from-green-700 hover:to-emerald-800 dark:hover:from-green-600 dark:hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition text-center inline-block'
              >
                View Profile →
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


// BezyCounterWithVideo Component
const BezyCounterWithVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTimeRef = useRef(0);
  const accumulatedEarningsRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [baseBalance, setBaseBalance] = useState(2450.50);
  const [sessionEarnings, setSessionEarnings] = useState(0);
  const [earningsPerSecond] = useState(0.15); // Earnings per second during playback

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    
    const handlePlay = () => {
      setIsPlaying(true);
      if (videoRef.current) {
        lastTimeRef.current = videoRef.current.currentTime;
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      lastTimeRef.current = 0;
    };

    const handleTimeUpdate = () => {
      if (isPlaying && video.duration) {
        const currentTime = video.currentTime;
        const deltaTime = Math.max(0, currentTime - lastTimeRef.current);
        lastTimeRef.current = currentTime;
        
        const newEarnings = accumulatedEarningsRef.current + (deltaTime * earningsPerSecond);
        accumulatedEarningsRef.current = newEarnings;
        setSessionEarnings(newEarnings);
      }
    };

    const handleEnded = async () => {
      setIsPlaying(false);
      lastTimeRef.current = 0;
      // Track earnings when video ends
      try {
        await fetch('/api/earnings/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            trackTitle: 'Bestie - LeFemme',
            duration: Math.round(video.currentTime),
            earnings: sessionEarnings,
          }),
        });
      } catch (error) {
        console.error('Failed to track earnings:', error);
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isPlaying, earningsPerSecond]);

  const totalBalance = baseBalance + sessionEarnings;

  return (
    <section className='relative z-10 min-h-screen bg-gradient-to-b from-white via-purple-50/50 to-white dark:from-black dark:via-purple-900/10 dark:to-black py-20 px-6'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-16'>
          <h2 className='text-5xl md:text-7xl font-black text-black dark:text-white mb-4 text-center'>BadBoy | StickgonBang feat LeFemme</h2>
          <p className='text-lg text-gray-700 dark:text-gray-300 text-center'>Play and earn with real-time SoundMoneyOS counter</p>
        </div>

        <div className='grid md:grid-cols-1 gap-8'>
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-gradient-to-br from-gray-100 to-white dark:from-neutral-900/80 dark:to-neutral-950/80 border border-gray-300 dark:border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-sm'
          >
            <div className='relative bg-black'>
              <video
                ref={videoRef}
                className='w-full h-auto max-h-96 object-cover'
                controls
                playsInline
              >
                <source src='/videos/BadBoy-LeFemme.mp4' type='video/mp4' />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Counter Overlay */}
            <div className='p-6 space-y-4'>
              {/* Main Counter */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Zap className='text-[#FD7125]' size={20} />
                    <span className='text-xs font-semibold text-neutral-600 dark:text-neutral-400'>REAL-TIME EARNINGS</span>
                  </div>
                  {isPlaying && (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className='text-xs font-bold text-green-400'
                    >
                      ● EARNING
                    </motion.span>
                  )}
                </div>

                {/* BZY Balance */}
                <motion.div
                  key={totalBalance}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className='space-y-1'
                >
                  <p className='text-4xl font-bold text-black dark:text-white'>
                    {totalBalance.toFixed(2)} BZY
                  </p>
                  <p className='text-sm text-neutral-400'>
                    {baseBalance.toFixed(2)} BZY +{sessionEarnings.toFixed(2)} USD
                  </p>
                </motion.div>

                {/* Earnings Per Second */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className='flex items-center gap-2'
                >
                  <div className='w-full h-2 bg-neutral-700 rounded-full overflow-hidden'>
                    <motion.div
                      className='h-full bg-gradient-to-r from-[#FD7125] to-[#FF6B35]'
                      animate={{ width: isPlaying ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className='text-sm font-semibold text-[#FD7125] whitespace-nowrap'>
                    {earningsPerSecond.toFixed(2)} BZY/s
                  </span>
                </motion.div>
              </div>

              {/* Session Stats */}
              <div className='border-t border-gray-400 dark:border-neutral-700 pt-4 space-y-2'>
                <p className='text-xs font-bold text-orange-600 dark:text-[#FD7125] uppercase tracking-wider'>Session Stats</p>
                <div className='space-y-2 text-sm text-gray-700 dark:text-neutral-300'>
                  <div className='flex justify-between text-black dark:text-white'>
                    <span>Playback Time</span>
                    <span className='text-black dark:text-white font-semibold'>
                      {videoRef.current ? Math.floor(videoRef.current.currentTime / 60) : 0}:{String((videoRef.current ? Math.floor(videoRef.current.currentTime % 60) : 0)).padStart(2, '0')}
                    </span>
                  </div>
                  <div className='flex justify-between text-black dark:text-white'>
                    <span>Session Earnings</span>
                    <span className='text-green-400 font-semibold'>+${(sessionEarnings * 2.4).toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-black dark:text-white'>
                    <span>Video Status</span>
                    <span className='text-black dark:text-white font-semibold'>{isPlaying ? '▶ Playing' : '⏸ Paused'}</span>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <motion.div
                className='text-xs text-gray-600 dark:text-neutral-500 flex items-center gap-2 pt-2 border-t border-gray-400 dark:border-neutral-700'
              >
                <span>Powered by SoundMoney earn streaming rewards</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


// TalentBooking Component
const TalentBooking: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'wedding',
    eventDate: '',
    budget: '',
    details: '',
  });
  const [chatEmail, setChatEmail] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ email: string; message: string; timestamp: string; sender: "user" | "tasha" }>>([]);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingForm(true);
    setFormMessage('');

    try {
      const response = await fetch('/api/booking/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormMessage('Booking submitted successfully! Tasha will be in touch soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventType: 'wedding',
          eventDate: '',
          budget: '',
          details: '',
        });
        setTimeout(() => setFormMessage(''), 5000);
      } else {
        setFormMessage('Failed to submit booking. Please try again.');
      }
    } catch (error) {
      setFormMessage('Error submitting booking. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatEmail || !chatMessage) return;

    setIsSendingChat(true);

    try {
      const response = await fetch('/api/booking/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: chatEmail,
          message: chatMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatHistory(prev => [
          ...prev,
          data.userMessage,
          data.tashaResponse,
        ]);
        setChatMessage('');
      }
    } catch (error) {
      console.error('Chat send error:', error);
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <section className='relative z-10 min-h-screen bg-gradient-to-b from-white via-pink-50/50 to-white dark:from-black dark:via-pink-900/10 dark:to-black py-20 px-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-16 text-center'>
          <h2 className='text-5xl md:text-7xl font-black text-black dark:text-white mb-4'>Talent Booking</h2>
          <p className='text-lg text-gray-700 dark:text-gray-300'>Work with Tasha Boué for your next event</p>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='bg-gradient-to-br from-pink-100 to-white dark:from-pink-900/30 dark:to-black border border-pink-200 dark:border-pink-500/30 rounded-2xl p-8 space-y-4'
          >
            <h3 className='text-2xl font-bold text-black dark:text-white mb-6'>Send a Booking Request</h3>

            <form onSubmit={handleFormSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-pink-700 dark:text-pink-300 mb-2'>Name *</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder='Your name'
                  required
                  className='w-full bg-white dark:bg-neutral-900/50 border border-pink-300 dark:border-pink-500/30 rounded-lg px-4 py-2 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/60 transition'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-pink-700 dark:text-pink-300 mb-2'>Email *</label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder='your@email.com'
                  required
                  className='w-full bg-white dark:bg-neutral-900/50 border border-pink-300 dark:border-pink-500/30 rounded-lg px-4 py-2 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/60 transition'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-pink-700 dark:text-pink-300 mb-2'>Phone</label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder='(123) 456-7890'
                  className='w-full bg-white dark:bg-neutral-900/50 border border-pink-300 dark:border-pink-500/30 rounded-lg px-4 py-2 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/60 transition'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-pink-700 dark:text-pink-300 mb-2'>Event Type *</label>
                <select
                  name='eventType'
                  value={formData.eventType}
                  onChange={handleFormChange}
                  required
                  className='w-full bg-white dark:bg-neutral-900/50 border border-pink-300 dark:border-pink-500/30 rounded-lg px-4 py-2 text-black dark:text-white focus:outline-none focus:border-pink-500/60 transition'
                >
                  <option value='wedding'>Wedding</option>
                  <option value='corporate'>Corporate Event</option>
                  <option value='birthday'>Birthday Party</option>
                  <option value='private'>Private Event</option>
                  <option value='festival'>Festival/Concert</option>
                  <option value='other'>Other</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-semibold text-pink-700 dark:text-pink-300 mb-2'>Event Date</label>
                <input
                  type='date'
                  name='eventDate'
                  value={formData.eventDate}
                  onChange={handleFormChange}
                  className='w-full bg-white dark:bg-neutral-900/50 border border-pink-300 dark:border-pink-500/30 rounded-lg px-4 py-2 text-black dark:text-white focus:outline-none focus:border-pink-500/60 transition'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-pink-700 dark:text-pink-300 mb-2'>Budget</label>
                <input
                  type='number'
                  name='budget'
                  value={formData.budget}
                  onChange={handleFormChange}
                  placeholder='Enter budget in USD'
                  className='w-full bg-white dark:bg-neutral-900/50 border border-pink-300 dark:border-pink-500/30 rounded-lg px-4 py-2 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/60 transition'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-pink-700 dark:text-pink-300 mb-2'>Event Details *</label>
                <textarea
                  name='details'
                  value={formData.details}
                  onChange={handleFormChange}
                  placeholder='Tell us about your event...'
                  required
                  rows={4}
                  className='w-full bg-white dark:bg-neutral-900/50 border border-pink-300 dark:border-pink-500/30 rounded-lg px-4 py-2 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/60 transition resize-none'
                />
              </div>

              {formMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-3 rounded-lg text-sm ${
                    formMessage.includes('successfully')
                      ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                      : 'bg-red-500/20 border border-red-500/50 text-red-300'
                  }`}
                >
                  {formMessage}
                </motion.div>
              )}

              <motion.button
                type='submit'
                disabled={isSubmittingForm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50'
              >
                {isSubmittingForm ? 'Submitting...' : 'Send Booking Request'}
              </motion.button>
            </form>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='bg-gradient-to-br from-purple-100 to-white dark:from-purple-900/30 dark:to-black border border-purple-200 dark:border-purple-500/30 rounded-2xl p-8 space-y-4 flex flex-col h-[600px] md:h-auto'
          >
            <h3 className='text-2xl font-bold text-black dark:text-white mb-4'>Chat with Tasha</h3>

            {/* Chat History */}
            <div className='flex-1 space-y-3 overflow-y-auto mb-4 bg-gray-100 dark:bg-neutral-900/20 rounded-lg p-4'>
              {chatHistory.length === 0 ? (
                <p className='text-gray-600 dark:text-gray-400 text-sm text-center mt-4'>Start a conversation!</p>
              ) : (
                <>
                  {chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                          msg.sender === 'user'
                            ? 'bg-purple-500 text-white'
                            : 'bg-neutral-700 text-gray-200'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className='block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2'>Your Email</label>
              <input
                type='email'
                value={chatEmail}
                onChange={(e) => setChatEmail(e.target.value)}
                placeholder='your@email.com'
                className='w-full bg-white dark:bg-neutral-900/50 border border-purple-300 dark:border-purple-500/30 rounded-lg px-4 py-2 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 transition'
              />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className='flex gap-2'>
              <textarea
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder='Type your message...'
                rows={2}
                className='flex-1 bg-neutral-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 transition resize-none'
              />
              <motion.button
                type='submit'
                disabled={isSendingChat || !chatEmail || !chatMessage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2 dark:bg-purple-500 dark:hover:bg-purple-600'
              >
                <span>Send</span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


// BezyCounterWithVideo2 Component
const BezyCounterWithVideo2: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTimeRef = useRef(0);
  const accumulatedEarningsRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [baseBalance, setBaseBalance] = useState(1850.25);
  const [sessionEarnings, setSessionEarnings] = useState(0);
  const [earningsPerSecond] = useState(0.15); // Earnings per second during playback

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    
    const handlePlay = () => {
      setIsPlaying(true);
      if (videoRef.current) {
        lastTimeRef.current = videoRef.current.currentTime;
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      lastTimeRef.current = 0;
    };

    const handleTimeUpdate = () => {
      if (isPlaying && video.duration) {
        const currentTime = video.currentTime;
        const deltaTime = Math.max(0, currentTime - lastTimeRef.current);
        lastTimeRef.current = currentTime;
        
        const newEarnings = accumulatedEarningsRef.current + (deltaTime * earningsPerSecond);
        accumulatedEarningsRef.current = newEarnings;
        setSessionEarnings(newEarnings);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      lastTimeRef.current = 0;
      // Note: accumulatedEarningsRef is not reset - earnings persist until next session
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isPlaying, earningsPerSecond]);

  const totalBalance = baseBalance + sessionEarnings;

  return (
    <section className='relative z-10 min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-white dark:from-black dark:via-blue-900/10 dark:to-black py-20 px-6'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-16'>
          <h2 className='text-5xl md:text-7xl font-black text-black dark:text-white mb-4 text-center'>Bestie - LeFemme</h2>
          <p className='text-lg text-gray-700 dark:text-gray-300 text-center'>Stream Single to earn rewards</p>
        </div>

        <div className='grid md:grid-cols-1 gap-8'>
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-gradient-to-br from-gray-100 to-white dark:from-neutral-900/80 dark:to-neutral-950/80 border border-gray-300 dark:border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-sm'
          >
            <div className='relative bg-black'>
              <video
                ref={videoRef}
                className='w-full h-auto max-h-96 object-cover'
                controls
                playsInline
              >
                <source src='/videos/bestie-lefemme.MP4' type='video/mp4' />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Counter Overlay */}
            <div className='p-6 space-y-4'>
              {/* Main Counter */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Zap className='text-[#FD7125]' size={20} />
                    <span className='text-xs font-semibold text-neutral-600 dark:text-neutral-400'>REAL-TIME EARNINGS</span>
                  </div>
                  {isPlaying && (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className='text-xs font-bold text-green-400'
                    >
                      ● EARNING
                    </motion.span>
                  )}
                </div>

                {/* BZY Balance */}
                <motion.div
                  key={totalBalance}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className='space-y-1'
                >
                  <p className='text-4xl font-bold text-black dark:text-white'>
                    {totalBalance.toFixed(2)} BZY
                  </p>
                  <p className='text-sm text-neutral-400'>
                    {baseBalance.toFixed(2)} BZY +{sessionEarnings.toFixed(2)} USD
                  </p>
                </motion.div>

                {/* Earnings Per Second */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className='flex items-center gap-2'
                >
                  <div className='w-full h-2 bg-neutral-700 rounded-full overflow-hidden'>
                    <motion.div
                      className='h-full bg-gradient-to-r from-[#FD7125] to-[#FF6B35]'
                      animate={{ width: isPlaying ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className='text-sm font-semibold text-[#FD7125] whitespace-nowrap'>
                    {earningsPerSecond.toFixed(2)} BZY/s
                  </span>
                </motion.div>
              </div>

              {/* Session Stats */}
              <div className='border-t border-gray-400 dark:border-neutral-700 pt-4 space-y-2'>
                <p className='text-xs font-bold text-orange-600 dark:text-[#FD7125] uppercase tracking-wider'>Session Stats</p>
                <div className='space-y-2 text-sm text-gray-700 dark:text-neutral-300'>
                  <div className='flex justify-between text-black dark:text-white'>
                    <span>Playback Time</span>
                    <span className='text-black dark:text-white font-semibold'>
                      {videoRef.current ? Math.floor(videoRef.current.currentTime / 60) : 0}:{String((videoRef.current ? Math.floor(videoRef.current.currentTime % 60) : 0)).padStart(2, '0')}
                    </span>
                  </div>
                  <div className='flex justify-between text-black dark:text-white'>
                    <span>Session Earnings</span>
                    <span className='text-green-400 font-semibold'>+${(sessionEarnings * 2.4).toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Video Status</span>
                    <span className='text-black dark:text-white font-semibold'>{isPlaying ? '▶ Playing' : '⏸ Paused'}</span>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <motion.div
                className='text-xs text-gray-600 dark:text-neutral-500 flex items-center gap-2 pt-2 border-t border-gray-400 dark:border-neutral-700'
              >
                <span>Powered by SoundMoney earn streaming rewards</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};



export default function TashaBoue() {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!carouselRef.current || !titleRef.current) return;

    // Horizontal scroll animation for carousel
    gsap.registerPlugin(ScrollTrigger);

    const carousel = carouselRef.current;
    const scrollWidth = carousel.scrollWidth - carousel.clientWidth;

    // Animate carousel scroll
    gsap.to(carousel, {
      scrollLeft: scrollWidth,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        markers: false
      }
    });

    // Title animation - fade and scale in
    gsap.from(titleRef.current, {
      opacity: 0,
      y: 50,
      scale: 0.9,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 80%',
        end: 'top 50%',
        scrub: 0.5
      }
    });

    // Letter-by-letter animation for title
    const titleText = titleRef.current.querySelector('.title-text');
    if (titleText) {
      const letters = titleText.querySelectorAll('.letter');
      gsap.from(letters, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.05,
        ease: 'back.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 75%',
          end: 'top 55%',
          scrub: 1
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <main className='bg-white text-black dark:bg-black dark:text-white overflow-x-hidden transition-colors'>

      {/* Hero Section */}
      <section
        ref={containerRef}
        className='relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-black'
      >
        {/* Background gradient */}
        <div className='absolute inset-0 bg-gradient-to-b from-gray-100 via-white to-white dark:from-gray-900 dark:via-black dark:to-black opacity-60' />

        {/* Title Section */}
        <div
          ref={titleRef}
          className='relative z-10 mb-12 px-6 text-center'
        >
          <h1 className='title-text text-5xl md:text-7xl font-black tracking-tighter leading-tight'>
            {'Who Is...'.split('').map((char, i) => (
              <span key={`who-${i}`} className='letter inline-block'>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
            <br />
            {'Tasha Boue'.split('').map((char, i) => (
              <span
                key={`tasha-${i}`}
                className='letter inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent'
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
        </div>

        {/* Video Carousel */}
        <div className='relative z-20 w-full px-4 md:px-8'>
          <div
            ref={carouselRef}
            className='flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4'
            style={{ scrollBehavior: 'smooth' }}
          >
            {videos.map((video, index) => (
              <div
                key={video.id}
                className='flex-shrink-0 w-screen md:w-[80vw] h-[60vh] md:h-[70vh] snap-center'
              >
                <div className='relative w-full h-full rounded-2xl overflow-hidden shadow-2xl'>
                  {/* Video */}
                  <video
                    src={video.src}
                    className='w-full h-full object-cover'
                    controls
                    playsInline
                  />


                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
          <div className='flex flex-col items-center gap-2'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>Scroll to explore</p>
            <svg
              className='w-6 h-6 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 14l-7 7m0 0l-7-7m7 7V3'
              />
            </svg>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className='relative z-10 min-h-screen bg-white dark:bg-black py-20 px-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4 text-white'>
              Creative Director & Co-Founder
            </h2>
            <p className='text-xl md:text-2xl font-semibold text-white mb-2'>HouseDAO</p>
          </div>

          <div className='space-y-8 text-gray-300'>
            {/* Main Bio */}
            <div>
              <h3 className='text-2xl font-bold text-black dark:text-white mb-4'>Who is Tasha Boué</h3>
              <p className='text-lg leading-relaxed'>
                Tasha Boué is a renowned fashion stylist and entrepreneur who has been instrumental in crafting <span className='text-pink-400 font-semibold'>Jaime Foxx's iconic on-screen and red-carpet looks for over a decade.</span> She is best known for her work as Jaime Foxx's personal and film stylist, curating his looks for major projects, including:
              </p>
              <ul className='mt-4 space-y-2 ml-6'>
                <li className='flex items-start gap-3'>
                  <span className='text-pink-400 mt-1'>•</span>
                  <span><span className='text-black dark:text-white font-semibold'>Electro</span> in The Amazing Spider-Man 2</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-pink-400 mt-1'>•</span>
                  <span><span className='text-black dark:text-white font-semibold'>Django</span> in Django Unchained</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-pink-400 mt-1'>•</span>
                  <span><span className='text-black dark:text-white font-semibold'>President James Sawyer</span> in White House Down</span>
                </li>
              </ul>
            </div>

            {/* The Heart of Cool */}
            <div>
              <h3 className='text-2xl font-bold text-black dark:text-white mb-4'>The Heart of Cool</h3>
              <p className='text-lg leading-relaxed'>
                Tasha has curated and organized events at the world's most prestigious venues—Miami Art Basel, SXSW, Coachella, and many more—seamlessly blending music, fashion, and visual arts. Her strategic collaborations with luxury hotels and private jet companies have elevated exclusive experiences, making them accessible to a discerning global audience.
              </p>
            </div>

            {/* Fashion Media & Consulting */}
            <div>
              <h3 className='text-2xl font-bold text-black dark:text-white mb-4'>Fashion Media & Consulting</h3>
              <p className='text-lg leading-relaxed'>
                Featured on IMDb for her work in the wardrobe department of <span className='text-black dark:text-white font-semibold'>America's Next Top Model</span>, Tasha's expertise spans film, television, fashion curation, and high-level event production.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* HouseDAO Pitch Deck Section */}
      <section className='relative z-10 min-h-screen bg-white dark:bg-black py-20 px-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-4 text-center'>Explore the Vision</h2>
            <p className='text-lg text-gray-700 dark:text-gray-300 text-center'>luxury meets sovereignty</p>
          </div>
          
          <div className='flex justify-center'>
            <iframe 
              src="https://pitch.com/embed-link/dizj4v" 
              allow="fullscreen; clipboard-write" 
              allowFullScreen 
              width="560" 
              height="368" 
              style={{ border: 'none', borderRadius: '12px' }}
            />
          </div>
        </div>
      </section>

      {/* HouseDAO Dinners Section */}
      <section className='relative z-10 min-h-screen bg-gradient-to-b from-white via-purple-50/50 to-white dark:from-black dark:via-purple-900/10 dark:to-black py-20 px-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4 text-center'>HouseDAO Dinners</h2>
            <p className='text-lg text-gray-700 dark:text-gray-300 text-center'>Curated culinary experiences and strategic networking for founders & investors</p>
          </div>
          
          <div className='flex justify-center'>
            <iframe 
              src="https://luma.com/embed/calendar/cal-YjBaEbhdv11tv4G/events"
              width="600"
              height="450"
              frameBorder="0"
              style={{ border: '1px solid #bfcbda88', borderRadius: '4px' }}
              allowFullScreen
              aria-hidden="false"
              tabIndex={0}
            />
          </div>
        </div>
      </section>

      {/* Billionaires Row Section */}
      <section className='relative z-10 min-h-screen bg-gradient-to-b from-white via-yellow-50/50 to-white dark:from-black dark:via-yellow-900/10 dark:to-black py-20 px-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4 text-center'>Billionaires Row</h2>
            <p className='text-lg text-gray-700 dark:text-gray-300 text-center'>Exclusive experiences for the world's most discerning elite</p>
          </div>
          
          <div className='flex justify-center'>
            <iframe 
              src="https://luma.com/embed/calendar/cal-YjBaEbhdv11tv4G/events"
              width="600"
              height="450"
              frameBorder="0"
              style={{ border: '1px solid #bfcbda88', borderRadius: '4px' }}
              allowFullScreen
              aria-hidden="false"
              tabIndex={0}
            />
          </div>
        </div>
      </section>

      {/* Events Calendar Section */}
      <section className='relative z-10 min-h-screen bg-white dark:bg-black py-20 px-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-4 text-center'>VVS Flawless Experiences</h2>
            <p className='text-lg text-gray-700 dark:text-gray-300 text-center'>Explore VVS Flawless Experiences events and join our elite community</p>
          </div>
          
          <div className='flex justify-center'>
            <iframe 
              src="https://luma.com/embed/calendar/cal-sQpCrHGuw2VZD3O/events"
              width="600"
              height="450"
              frameBorder="0"
              style={{ border: '1px solid #bfcbda88', borderRadius: '4px' }}
              allowFullScreen
              aria-hidden="false"
              tabIndex={0}
            />
          </div>
        </div>
      </section>

      {/* VVS Flawless Experiences Section */}
      <section className='relative z-10 min-h-screen bg-gradient-to-b from-white via-purple-50/50 to-white dark:from-black dark:via-purple-900/10 dark:to-black py-20 px-6'>
        <div className='max-w-6xl mx-auto'>
          {/* Header */}
          <div className='mb-20 text-center'>
            <h2 className='text-5xl md:text-7xl font-black mb-4 text-black dark:text-white'>VVS</h2>
            <p className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-6'>
              Flawless Experiences
            </p>
            <p className='text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto'>
              "Cut, Color, Carat, Clarity"—An exclusive luxe event network redefining curated experiences
            </p>
          </div>

          {/* Three Pillars */}
          <div className='grid md:grid-cols-4 gap-8 mb-20'>
            {/* Pillar 1 */}
            <div className='bg-gradient-to-br from-purple-100 to-white dark:from-purple-900/30 dark:to-black border border-purple-200 dark:border-purple-500/30 rounded-2xl p-8 hover:border-purple-400/60 transition'>
              <h3 className='text-3xl font-bold text-black dark:text-white mb-4'>Cut</h3>
              <p className='text-gray-700 dark:text-gray-300 text-lg'>
                Cut above the rest
              </p>
              <p className='text-gray-600 dark:text-gray-400 text-sm mt-4'>
                Premium curation, elevated experiences, and strategic network positioning
              </p>
            </div>

            {/* Pillar 2 */}
            <div className='bg-gradient-to-br from-pink-100 to-white dark:from-pink-900/30 dark:to-black border border-pink-200 dark:border-pink-500/30 rounded-2xl p-8 hover:border-pink-400/60 transition'>
              <h3 className='text-3xl font-bold text-black dark:text-white mb-4'>Color</h3>
              <p className='text-gray-700 dark:text-gray-300 text-lg'>
                Color the Room Creatively
              </p>
              <p className='text-gray-600 dark:text-gray-400 text-sm mt-4'>
                Art curation, music experiences, and cultural fusion across global venues
              </p>
            </div>

            {/* Pillar 3 */}
            <div className='bg-gradient-to-br from-blue-100 to-white dark:from-blue-900/30 dark:to-black border border-blue-200 dark:border-blue-500/30 rounded-2xl p-8 hover:border-blue-400/60 transition'>
              <h3 className='text-3xl font-bold text-black dark:text-white mb-4'>Carat</h3>
              <p className='text-gray-700 dark:text-gray-300 text-lg'>
                Carats is the Heavy Weights in the Room
              </p>
              <p className='text-gray-600 dark:text-gray-400 text-sm mt-4'>
                Elite networks, investor dinners, and transformational partnerships
              </p>
            </div>
            {/* Pillar 4 */}
            <div className='bg-gradient-to-br from-emerald-100 to-white dark:from-emerald-900/30 dark:to-black border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-8 hover:border-emerald-400/60 transition'>
              <h3 className='text-3xl font-bold text-black dark:text-white mb-4'>Clarity</h3>
              <p className='text-gray-700 dark:text-gray-300 text-lg'>
                Clarity of Vision
              </p>
              <p className='text-gray-600 dark:text-gray-400 text-sm mt-4'>
                Strategic transparency, purpose-driven experiences, and authentic connections
              </p>
            </div>
          </div>

          {/* Tier Structure */}
          <div className='mb-20'>
            <h3 className='text-3xl font-bold text-black dark:text-white mb-12 text-center'>Membership Tiers</h3>
            <div className='grid md:grid-cols-4 gap-6'>
              {/* Flawless Tier */}
              <div className='bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-300 dark:border-yellow-500/50 rounded-xl p-6'>
                <h4 className='text-xl font-bold text-black dark:text-white mb-2'>Flawless</h4>
                <p className='text-sm text-yellow-700 dark:text-yellow-300 mb-4'>Global Elite</p>
                <ul className='text-sm text-gray-700 dark:text-gray-300 space-y-2'>
                  <li>Elite networking</li>
                  <li>Concierge network</li>
                  <li>Fractional Real Estate</li>
                </ul>
              </div>
              {/* VVS1 Tier */}
              <div className='bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-500/50 rounded-xl p-6'>
                <h4 className='text-xl font-bold text-black dark:text-white mb-2'>VVS</h4>
                <p className='text-sm text-purple-700 dark:text-purple-300 mb-4'>Network Stake</p>
                <ul className='text-sm text-gray-700 dark:text-gray-300 space-y-2'>
                  <li>Exclusive lounge</li>
                  <li>Early art access</li>
                  <li>Mixers & networking</li>
                </ul>
              </div>
              {/* VS Tier */}
              <div className='bg-gray-200 dark:bg-gray-900/50 border border-gray-400 dark:border-gray-700 rounded-xl p-6'>
                <h4 className='text-xl font-bold text-black dark:text-white mb-2'>VS</h4>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>Network Governance</p>
                <ul className='text-sm text-gray-700 dark:text-gray-300 space-y-2'>
                  <li>All area access</li>
                  <li>Private previews</li>
                  <li>Co-curation rights</li>
                </ul>
              </div>
              {/* Internally Flawless Tier */}
              <div className='bg-pink-100 dark:bg-pink-900/30 border border-pink-300 dark:border-pink-500/50 rounded-xl p-6'>
                <h4 className='text-xl font-bold text-black dark:text-white mb-2'>SI</h4>
                <p className='text-sm text-pink-700 dark:text-pink-300 mb-4'>Base Network</p>
                <ul className='text-sm text-gray-700 dark:text-gray-300 space-y-2'>
                  <li>General entry</li>
                  <li>QR access pass</li>
                  <li>Curated events</li>
                </ul>
              </div>
            </div>
          </div>

{/* Vision Statement */}
          <div className='bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border border-purple-300 dark:border-purple-500/40 rounded-2xl p-12 text-center'>
            <p className='text-xl md:text-2xl text-gray-800 dark:text-gray-200 leading-relaxed'>
              VVS Flawless Experiences represents the intersection of <span className='text-purple-300 font-semibold'>luxury curation</span>, <span className='text-pink-300 font-semibold'>creative excellence</span>, and <span className='text-orange-300 font-semibold'>elite networking</span>. Each event is a milestone in a global movement—where the world's most discerning audiences connect, create, and elevate together.
            </p>
          </div>
        </div>
      </section>




      {/* Talent Booking Section */}
      <TalentBooking />

      {/* Bestie SoundMoneyOS Counter */}
      <BezyCounterWithVideo2 />

      {/* Music Section with Video & Earnings */}
      <BezyCounterWithVideo />


      <ReferralSection />
      {/* Social Links Section */}
      <section className='relative z-10 bg-white dark:bg-black py-20 px-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold text-black dark:text-white mb-4 text-center'>Connect</h2>
            <p className='text-lg text-gray-700 dark:text-gray-300 text-center'>Follow the latest from Tasha Boué</p>
          </div>
          
          <div className='flex justify-center gap-8 flex-wrap'>
            <a href='https://www.instagram.com/lefemmeboue/' target='_blank' rel='noopener noreferrer' className='group'>
              <div className='bg-gradient-to-br from-pink-500 to-purple-600 p-6 rounded-xl hover:shadow-lg hover:shadow-pink-500/50 transition transform hover:scale-110'>
                <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z'/></svg>
              </div>
              <p className='text-center text-black dark:text-white mt-3 font-semibold'>Instagram</p>
            </a>
            
            <a href='https://x.com/LEFemmeBoue' target='_blank' rel='noopener noreferrer' className='group'>
              <div className='bg-gradient-to-br from-slate-600 to-slate-800 p-6 rounded-xl hover:shadow-lg hover:shadow-slate-500/50 transition transform hover:scale-110'>
                <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 24 24'><path d='M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9 0 9 0z'/></svg>
              </div>
              <p className='text-center text-black dark:text-white mt-3 font-semibold'>X (Twitter)</p>
            </a>
            
            <a href='https://www.facebook.com/lefemme.boue.9' target='_blank' rel='noopener noreferrer' className='group'>
              <div className='bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-110'>
                <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 24 24'><path d='M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z'/></svg>
              </div>
              <p className='text-center text-black dark:text-white mt-3 font-semibold'>Facebook</p>
            </a>
            
            <a href='https://www.tiktok.com/@lefemme11?_t=8hSaBTvow8p&_r=1' target='_blank' rel='noopener noreferrer' className='group'>
              <div className='bg-gradient-to-br from-black to-gray-800 p-6 rounded-xl hover:shadow-lg hover:shadow-gray-500/50 transition transform hover:scale-110 border border-gray-700'>
                <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 24 24'><path d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.08 1.61 2.88 2.88 0 0 1 4.07-4.09v-3.45a6.47 6.47 0 0 0-5.79 9.86 6.48 6.48 0 0 0 10.86-3.87V8.93a8.12 8.12 0 0 0 3.26.67Z'/></svg>
              </div>
              <p className='text-center text-black dark:text-white mt-3 font-semibold'>TikTok</p>
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
