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
    src: '/videos/ET_Tash_Jaime_MiniDoc.mp4',
    title: 'Mini Doc'
  },
  {
    id: '2',
    src: '/videos/ET_Jaime_Tasha_Long_form.mp4',
    title: 'Long Form'
  },
  {
    id: '3',
    src: '/videos/TashaBoue_MiniDoc_Pt1.mp4',
    title: 'Mini Doc Part 1'
  }
];

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
    <main className='bg-black text-white overflow-x-hidden'>
      {/* Hero Section */}
      <section
        ref={containerRef}
        className='relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden'
      >
        {/* Background gradient */}
        <div className='absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black opacity-60' />

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
            <p className='text-sm text-gray-400'>Scroll to explore</p>
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
      <section className='relative z-10 min-h-screen bg-black py-20 px-6'>
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
              <h3 className='text-2xl font-bold text-white mb-4'>Who is Tasha Boué</h3>
              <p className='text-lg leading-relaxed'>
                Tasha Boué is a renowned fashion stylist and entrepreneur who has been instrumental in crafting <span className='text-pink-400 font-semibold'>Jaime Foxx's iconic on-screen and red-carpet looks for over a decade.</span> She is best known for her work as Jaime Foxx's personal and film stylist, curating his looks for major projects, including:
              </p>
              <ul className='mt-4 space-y-2 ml-6'>
                <li className='flex items-start gap-3'>
                  <span className='text-pink-400 mt-1'>•</span>
                  <span><span className='text-white font-semibold'>Electro</span> in The Amazing Spider-Man 2</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-pink-400 mt-1'>•</span>
                  <span><span className='text-white font-semibold'>Django</span> in Django Unchained</span>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-pink-400 mt-1'>•</span>
                  <span><span className='text-white font-semibold'>President James Sawyer</span> in White House Down</span>
                </li>
              </ul>
            </div>

            {/* The Heart of Cool */}
            <div>
              <h3 className='text-2xl font-bold text-white mb-4'>The Heart of Cool</h3>
              <p className='text-lg leading-relaxed'>
                Tasha has curated and organized events at the world's most prestigious venues—Miami Art Basel, SXSW, Coachella, and many more—seamlessly blending music, fashion, and visual arts. Her strategic collaborations with luxury hotels and private jet companies have elevated exclusive experiences, making them accessible to a discerning global audience.
              </p>
            </div>

            {/* Fashion Media & Consulting */}
            <div>
              <h3 className='text-2xl font-bold text-white mb-4'>Fashion Media & Consulting</h3>
              <p className='text-lg leading-relaxed'>
                Featured on IMDb for her work in the wardrobe department of <span className='text-white font-semibold'>America's Next Top Model</span>, Tasha's expertise spans film, television, fashion curation, and high-level event production.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* HouseDAO Pitch Deck Section */}
      <section className='relative z-10 min-h-screen bg-black py-20 px-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-4 text-center'>Explore the Vision</h2>
            <p className='text-lg text-gray-300 text-center'>HouseDAO Strategic Blueprint</p>
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
      <section className='relative z-10 min-h-screen bg-gradient-to-b from-black via-purple-900/10 to-black py-20 px-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4 text-center'>HouseDAO Dinners</h2>
            <p className='text-lg text-gray-300 text-center'>Curated culinary experiences and strategic networking for community leaders</p>
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
      <section className='relative z-10 min-h-screen bg-gradient-to-b from-black via-yellow-900/10 to-black py-20 px-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4 text-center'>Billionaires Row</h2>
            <p className='text-lg text-gray-300 text-center'>Exclusive experiences for the world's most discerning elite</p>
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
      <section className='relative z-10 min-h-screen bg-black py-20 px-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-4 text-center'>VVS Flawless Experiences</h2>
            <p className='text-lg text-gray-300 text-center'>Explore VVS Flawless Experiences events and join our elite community</p>
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
      <section className='relative z-10 min-h-screen bg-gradient-to-b from-black via-purple-900/10 to-black py-20 px-6'>
        <div className='max-w-6xl mx-auto'>
          {/* Header */}
          <div className='mb-20 text-center'>
            <h2 className='text-5xl md:text-7xl font-black mb-4 text-white'>VVS</h2>
            <p className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-6'>
              Flawless Experiences
            </p>
            <p className='text-lg text-gray-300 max-w-2xl mx-auto'>
              "Cut, Color, Carat, Clarity"—An exclusive luxury event network redefining curated experiences
            </p>
          </div>

          {/* Three Pillars */}
          <div className='grid md:grid-cols-4 gap-8 mb-20'>
            {/* Pillar 1 */}
            <div className='bg-gradient-to-br from-purple-900/30 to-black border border-purple-500/30 rounded-2xl p-8 hover:border-purple-400/60 transition'>
              <h3 className='text-3xl font-bold text-white mb-4'>Cut</h3>
              <p className='text-gray-300 text-lg'>
                Cut above the rest
              </p>
              <p className='text-gray-400 text-sm mt-4'>
                Premium curation, elevated experiences, and strategic network positioning
              </p>
            </div>

            {/* Pillar 2 */}
            <div className='bg-gradient-to-br from-pink-900/30 to-black border border-pink-500/30 rounded-2xl p-8 hover:border-pink-400/60 transition'>
              <h3 className='text-3xl font-bold text-white mb-4'>Color</h3>
              <p className='text-gray-300 text-lg'>
                Color the Room Creatively
              </p>
              <p className='text-gray-400 text-sm mt-4'>
                Art curation, music experiences, and cultural fusion across global venues
              </p>
            </div>

            {/* Pillar 3 */}
            <div className='bg-gradient-to-br from-blue-900/30 to-black border border-blue-500/30 rounded-2xl p-8 hover:border-blue-400/60 transition'>
              <h3 className='text-3xl font-bold text-white mb-4'>Carat</h3>
              <p className='text-gray-300 text-lg'>
                Carats is the Heavy Weights in the Room
              </p>
              <p className='text-gray-400 text-sm mt-4'>
                Elite networks, investor dinners, and transformational partnerships
              </p>
            </div>
            {/* Pillar 4 */}
            <div className='bg-gradient-to-br from-emerald-900/30 to-black border border-emerald-500/30 rounded-2xl p-8 hover:border-emerald-400/60 transition'>
              <h3 className='text-3xl font-bold text-white mb-4'>Clarity</h3>
              <p className='text-gray-300 text-lg'>
                Clarity of Vision
              </p>
              <p className='text-gray-400 text-sm mt-4'>
                Strategic transparency, purpose-driven experiences, and authentic connections
              </p>
            </div>
          </div>

          {/* Tier Structure */}
          <div className='mb-20'>
            <h3 className='text-3xl font-bold text-white mb-12 text-center'>Membership Tiers</h3>
            <div className='grid md:grid-cols-4 gap-6'>
              {/* Flawless Tier */}
              <div className='bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/50 rounded-xl p-6'>
                <h4 className='text-xl font-bold text-white mb-2'>Flawless</h4>
                <p className='text-sm text-yellow-300 mb-4'>Global Elite</p>
                <ul className='text-sm text-gray-300 space-y-2'>
                  <li>Elite networking</li>
                  <li>Concierge network</li>
                  <li>Fractional Real Estate</li>
                </ul>
              </div>
              {/* VVS1 Tier */}
              <div className='bg-purple-900/30 border border-purple-500/50 rounded-xl p-6'>
                <h4 className='text-xl font-bold text-white mb-2'>VVS</h4>
                <p className='text-sm text-purple-300 mb-4'>Network Stake</p>
                <ul className='text-sm text-gray-300 space-y-2'>
                  <li>Exclusive lounge</li>
                  <li>Early art access</li>
                  <li>Mixers & networking</li>
                </ul>
              </div>
              {/* VS Tier */}
              <div className='bg-gray-900/50 border border-gray-700 rounded-xl p-6'>
                <h4 className='text-xl font-bold text-white mb-2'>VS</h4>
                <p className='text-sm text-gray-400 mb-4'>Network Governance</p>
                <ul className='text-sm text-gray-300 space-y-2'>
                  <li>All area access</li>
                  <li>Private previews</li>
                  <li>Co-curation rights</li>
                </ul>
              </div>
              {/* Internally Flawless Tier */}
              <div className='bg-pink-900/30 border border-pink-500/50 rounded-xl p-6'>
                <h4 className='text-xl font-bold text-white mb-2'>SI</h4>
                <p className='text-sm text-pink-300 mb-4'>Base Network</p>
                <ul className='text-sm text-gray-300 space-y-2'>
                  <li>General entry</li>
                  <li>QR access pass</li>
                  <li>Curated events</li>
                </ul>
              </div>
            </div>
          </div>

{/* Vision Statement */}
          <div className='bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/40 rounded-2xl p-12 text-center'>
            <p className='text-xl md:text-2xl text-gray-200 leading-relaxed'>
              VVS Flawless Experiences represents the intersection of <span className='text-purple-300 font-semibold'>luxury curation</span>, <span className='text-pink-300 font-semibold'>creative excellence</span>, and <span className='text-orange-300 font-semibold'>elite networking</span>. Each event is a milestone in a global movement—where the world's most discerning audiences connect, create, and elevate together.
            </p>
          </div>
        </div>
      </section>


      {/* Music Section */}
      <section className='relative z-10 min-h-screen bg-gradient-to-b from-black via-purple-900/10 to-black py-20 px-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-16'>
            <h2 className='text-5xl md:text-7xl font-black text-white mb-4 text-center'>Music</h2>
            <p className='text-lg text-gray-300 text-center'>Discover the sounds that define the culture</p>
          </div>
          
          <div className='grid md:grid-cols-1 gap-8'>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 border border-neutral-800 rounded-2xl p-6 backdrop-blur-sm space-y-4'
            >
              {/* Main Counter */}
              <div className='space-y-3'>
                <div className='flex items-center gap-2 mb-2'>
                  <Zap className='text-[#FD7125]' size={20} />
                  <span className='text-xs font-semibold text-neutral-400'>BZY EARNINGS</span>
                </div>

                {/* BZY Balance */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className='space-y-1'
                >
                  <p className='text-3xl font-bold text-white'>
                    2,450.50 BZY
                  </p>
                  <p className='text-sm text-neutral-400'>Total Balance</p>
                </motion.div>

                {/* Daily Earnings */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className='flex items-center gap-2'
                >
                  <div className='w-full h-2 bg-neutral-700 rounded-full overflow-hidden'>
                    <motion.div
                      className='h-full bg-gradient-to-r from-[#FD7125] to-[#FF6B35]'
                      animate={{ width: '45%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className='text-sm font-semibold text-[#FD7125] whitespace-nowrap'>
                    +$45.25 today
                  </span>
                </motion.div>
              </div>

              {/* Features List */}
              <div className='border-t border-neutral-700 pt-4 space-y-2'>
                <p className='text-xs font-bold text-[#FD7125] uppercase tracking-wider'>Live Earnings</p>
                <div className='space-y-2 text-sm text-neutral-300'>
                  <div className='flex justify-between'>
                    <span>Streams</span>
                    <span className='text-white font-semibold'>15,420</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Monthly Revenue</span>
                    <span className='text-white font-semibold'>+18% boost</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Active Listeners</span>
                    <span className='text-white font-semibold'>3,421</span>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <motion.div
                className='text-xs text-neutral-500 flex items-center gap-2 pt-2 border-t border-neutral-700'
              >
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ● Live
                </motion.span>
                <span>SoundMoney Bezy Counter</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className='relative z-10 bg-black py-20 px-6'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-4 text-center'>Connect</h2>
            <p className='text-lg text-gray-300 text-center'>Follow the latest from Tasha Boué</p>
          </div>
          
          <div className='flex justify-center gap-8 flex-wrap'>
            <a href='https://www.instagram.com/lefemmeboue/' target='_blank' rel='noopener noreferrer' className='group'>
              <div className='bg-gradient-to-br from-pink-500 to-purple-600 p-6 rounded-xl hover:shadow-lg hover:shadow-pink-500/50 transition transform hover:scale-110'>
                <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z'/></svg>
              </div>
              <p className='text-center text-white mt-3 font-semibold'>Instagram</p>
            </a>
            
            <a href='https://x.com/LEFemmeBoue' target='_blank' rel='noopener noreferrer' className='group'>
              <div className='bg-gradient-to-br from-slate-600 to-slate-800 p-6 rounded-xl hover:shadow-lg hover:shadow-slate-500/50 transition transform hover:scale-110'>
                <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 24 24'><path d='M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9 0 9 0z'/></svg>
              </div>
              <p className='text-center text-white mt-3 font-semibold'>X (Twitter)</p>
            </a>
            
            <a href='https://www.facebook.com/lefemme.boue.9' target='_blank' rel='noopener noreferrer' className='group'>
              <div className='bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-110'>
                <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 24 24'><path d='M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z'/></svg>
              </div>
              <p className='text-center text-white mt-3 font-semibold'>Facebook</p>
            </a>
            
            <a href='https://www.tiktok.com/@lefemme11?_t=8hSaBTvow8p&_r=1' target='_blank' rel='noopener noreferrer' className='group'>
              <div className='bg-gradient-to-br from-black to-gray-800 p-6 rounded-xl hover:shadow-lg hover:shadow-gray-500/50 transition transform hover:scale-110 border border-gray-700'>
                <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 24 24'><path d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.08 1.61 2.88 2.88 0 0 1 4.07-4.09v-3.45a6.47 6.47 0 0 0-5.79 9.86 6.48 6.48 0 0 0 10.86-3.87V8.93a8.12 8.12 0 0 0 3.26.67Z'/></svg>
              </div>
              <p className='text-center text-white mt-3 font-semibold'>TikTok</p>
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
