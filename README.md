# Tasha Boue - Video Portfolio

A mobile-first, interactive video portfolio featuring smooth scroll animations with GSAP ScrollTrigger and horizontal video carousel.

## Features

✨ **Mobile-First Design** - Optimized for all device sizes
🎥 **Video Carousel** - Smooth horizontal scrolling through 3 featured videos
📜 **Scroll Animations** - GSAP ScrollTrigger animations for smooth transitions
🎨 **Gradient Effects** - Modern gradient text and overlays
🔗 **Responsive** - Works seamlessly on mobile, tablet, and desktop

## Technology Stack

- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **GSAP ScrollTrigger** - Scroll animations
- **Three.js** - WebGL graphics (ready for 3D effects)

## Project Structure

```
/djlefemme
├── app/
│   ├── page.tsx          # Main hero with video carousel
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles + Tailwind
├── public/
│   └── videos/           # MP4 video files
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Quick Start

### 1. Install Dependencies

```bash
cd /Users/casmirpatterson/soundmoney/djlefemme
npm install
```

### 2. Development Server

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

## Scroll Animation Details

### Carousel Animation
- Horizontal scroll triggered by page scroll
- GSAP ScrollTrigger syncs carousel position to page scroll
- Smooth easing: `power1.inOut`

### Title Animation
- Letter-by-letter fade-in with stagger effect
- Fade, scale, and Y-axis translation
- Synced to scroll position

### Video Cards
- Hover effects with gradient overlay
- Title slides up on hover
- Snap scrolling on mobile

## Mobile Optimizations

- Full-screen video on mobile (100vw)
- Touch-friendly carousel
- Optimized performance for lower-end devices
- Reduced motion support ready

## Customization

### Change Video Order
Edit `app/page.tsx` in the `videos` array:

```typescript
const videos: Video[] = [
  { id: '1', src: '/videos/your-video.mp4', title: 'Video Title' },
  // ...
];
```

### Modify Animations
Update GSAP animations in the `useEffect` hook:

```typescript
gsap.to(carousel, {
  scrollLeft: scrollWidth,
  ease: 'power1.inOut', // Change easing
  // Add more tweens here
});
```

### Adjust Colors
Edit `app/globals.css` and `tailwind.config.js` for color scheme changes.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

- Videos are served from `/public/videos/`
- Use optimized MP4 files (H.264 codec)
- Consider adding video preload attribute
- Lazy load off-screen content if needed

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Other Platforms

```bash
npm run build
# Deploy the `.next` folder
```

## License

Created for Tasha Boue

---

**Questions or issues?** Check the Next.js docs: https://nextjs.org/docs
