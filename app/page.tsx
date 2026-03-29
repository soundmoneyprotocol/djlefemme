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
    src: '/videos/ET_Jaime_Tasha_Long_form.mp4',
    title: 'Long Form'
  },
  {
    id: '2',
    src: '/videos/ET_Tash_Jaime_MiniDoc.mp4',
    title: 'Mini Doc'
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
                <div className='relative w-full h-full rounded-2xl overflow-hidden shadow-2xl group'>
                  {/* Video */}
                  <video
                    src={video.src}
                    className='w-full h-full object-cover'
                    controls
                    playsInline
                  />

                  {/* Overlay gradient */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/30 transition-all duration-300' />

                  {/* Video title */}
                  <div className='absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300'>
                    <p className='text-lg md:text-2xl font-bold'>
                      {video.title}
                    </p>
                    <p className='text-sm md:text-base text-gray-300'>
                      Video {index + 1} of {videos.length}
                    </p>
                  </div>
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

      {/* Content Section */}
      <section className='relative z-10 min-h-screen bg-black py-20 px-6'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400'>
            About Tasha Boue
          </h2>
          <p className='text-lg text-gray-300 leading-relaxed mb-6'>
            Tasha Boue is a creative force in music and visual storytelling. Through her unique perspective and artistic vision, she brings passion and authenticity to every project.
          </p>
          <p className='text-lg text-gray-300 leading-relaxed'>
            Watch the videos above to explore her work, creative process, and the stories behind each project.
          </p>
        </div>
      </section>
    </main>
  );
}
