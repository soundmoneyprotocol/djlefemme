'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

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

              {/* Flawless Tier */}
              <div className='bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/50 rounded-xl p-6'>
                <h4 className='text-xl font-bold text-white mb-2'>Flawless</h4>
                <p className='text-sm text-yellow-300 mb-4'>Global Elite</p>
                <ul className='text-sm text-gray-300 space-y-2'>
                  <li>Elite networking</li>
                  <li>Personal escort</li>
                  <li>VIP experiences</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pitch Deck */}
          <div className='mb-20'>
            <h3 className='text-3xl font-bold text-white mb-8 text-center'>Explore the Vision</h3>
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

          {/* Vision Statement */}
          <div className='bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/40 rounded-2xl p-12 text-center'>
            <p className='text-xl md:text-2xl text-gray-200 leading-relaxed'>
              VVS Flawless Experiences represents the intersection of <span className='text-purple-300 font-semibold'>luxury curation</span>, <span className='text-pink-300 font-semibold'>creative excellence</span>, and <span className='text-orange-300 font-semibold'>elite networking</span>. Each event is a milestone in a global movement—where the world's most discerning audiences connect, create, and elevate together.
            </p>
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

    </main>
  );
}
