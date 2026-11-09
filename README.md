# A Little Universe Called Us ♡
### An Interactive Birthday Experience & Marriage Proposal Website

---

## 🌸 Personalising the Website

All personalisation is done through **one single file**:

```
data/siteConfig.ts
```

Open this file and fill in everything marked with `[ADD_...]` placeholders.

### What to personalise:

| Field | Where |
|-------|-------|
| Her name & nickname | `siteConfig.herName`, `siteConfig.herNickname` |
| Your name | `siteConfig.yourName` |
| Background music | `siteConfig.music` — place your `.mp3` file in `public/audio/` |
| Relationship timeline | `siteConfig.timeline` — 7 chapters |
| Love letter | `siteConfig.loveLetter` |
| Future dreams | `siteConfig.futureDreams` |
| Secret messages | `siteConfig.secretMessages` |
| Birthday wishes | `siteConfig.birthdayWishes` |
| 100 Reasons | `reasons[]` array in siteConfig.ts |

---

## 📸 Adding Photographs

Place photographs in these folders inside `/public/`:

```
public/
  images/
    memories/        → Timeline photographs (memory-1.jpg, memory-2.jpg, etc.)
    gallery/         → Museum photographs (smile-1.jpg, fav-1.jpg, etc.)
    proposal/        → The special proposal photograph (proposal-photo.jpg)
  audio/
    background-music.mp3   → Your chosen background music
```

Then update the `photos` section in `siteConfig.ts` with correct filenames.

---

## 🚀 Running the Website

### Prerequisites
Make sure Node.js (v18+) is installed.

### Development
```bash
cd universe-of-us
npm install
npm run dev
```
Then open: http://localhost:3000

### Production Build
```bash
npm run build
npm run start
```

---

## 🌐 Deploying to Vercel

1. Push your project to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Deploy — it works out of the box!

---

## 🗺️ Website Journey

| Page | Route | Description |
|------|-------|-------------|
| Envelope | `/` | Opening animated envelope experience |
| Birthday | `/birthday` | Birthday celebration with interactive cake |
| Our Story | `/our-story` | Relationship timeline with flip cards |
| 100 Reasons | `/reasons` | Interactive grid of 100 love reasons |
| Museum | `/museum` | Photo galleries with lightbox |
| Future | `/future` | Dream cards + birthday wishes jar |
| Love Letter | `/letter` | Animated typewriter love letter |
| Forever | `/forever` | The marriage proposal experience |

---

## ✨ Global Features

- 🎵 **Music Player** — floating bottom-right, doesn't autoplay
- 💫 **Secret Heart** — floating bottom-left, tap for secret messages
- 🤗 **Hug Button** — floating left side (desktop)
- 💕 **Heart Cursor Trail** — desktop only, disabled on touch devices
- 🌸 **Floating Petals** — throughout the experience
- ♿ **Accessibility** — keyboard navigation, focus indicators, reduced-motion support

---

*Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion*

