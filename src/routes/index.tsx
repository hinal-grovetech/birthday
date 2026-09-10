import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, Mail, Music, PartyPopper, Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import friendsLaughing from "@/assets/IMG_4731.jpg";
import birthdayCake from "@/assets/IMG_2202.jpg";
import pastelBalloons from "@/assets/IMG_3925.jpg";
import fireworksNight from "@/assets/IMG_8075.jpg";
import champagneToast from "@/assets/IMG_9040.jpg";
import { getCelebration, lockSite } from "@/lib/gate.functions";


export const Route = createFileRoute("/")({
  loader: async () => {
    const data = await getCelebration();
    if (!data.unlocked) throw redirect({ to: "/unlock" });
    return data;
  },
  component: Index,
  head: () => ({
    meta: [
      { title: "Happy Birthday, Shirish!" },
      { name: "description", content: "A personalized interactive birthday celebration for Shirish." },
      { property: "og:title", content: "Happy Birthday, Shirish!" },
      { property: "og:description", content: "A personalized interactive birthday celebration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
const BIRTHDAY_COLORS = ["#f06292", "#d4af37", "#e0f2f1", "#fce4ec", "#fff9f0"];

async function launchConfetti(origin?: { x: number; y: number }) {
  const confetti = (await import("canvas-confetti")).default;
  confetti({
    particleCount: 140,
    spread: 80,
    origin: origin ?? { y: 0.6 },
    colors: BIRTHDAY_COLORS,
    disableForReducedMotion: true,
  });
}

function playBirthdayMelody() {
  try {
    const win = window as unknown as {
      AudioContext?: { new (): AudioContext };
      webkitAudioContext?: { new (): AudioContext };
    };
    const AudioContextCtor = win.AudioContext ?? win.webkitAudioContext;
    if (!AudioContextCtor) return;
    const ctx: AudioContext = new AudioContextCtor();
    const notes = [264, 264, 297, 264, 352, 330, 264, 264, 297, 264, 396, 352];
    const durations = [0.25, 0.25, 0.5, 0.5, 0.5, 1, 0.25, 0.25, 0.5, 0.5, 0.5, 1];
    let t = 0;
    for (let i = 0; i < notes.length; i++) {
      const freq = notes[i]!;
      const duration = durations[i]!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + t);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + duration * 0.9);
      osc.stop(ctx.currentTime + t + duration);
      t += duration;
    }
  } catch {
    // ignore audio errors
  }
}

function Index() {
  const celebration = Route.useLoaderData();
  const router = useRouter();
  const lock = useServerFn(lockSite);
  const [revealOpen, setRevealOpen] = useState(false);
  const photosRef = useRef<HTMLElement>(null);
  const lockAgain = async () => {
    await lock({ data: undefined });
    await router.navigate({ to: "/unlock" });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      launchConfetti();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const revealMessage = () => {
    setRevealOpen(true);
    launchConfetti();
  };

  const playSong = () => {
    playBirthdayMelody();
    launchConfetti({ x: 0.5, y: 0.7 });
    toast("Happy Birthday melody playing!");
  };

  const scrollToPhotos = () => {
    photosRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => launchConfetti({ x: 0.5, y: 0.8 }), 400);
  };

  return (
    <div className="min-h-screen bg-warm-cream font-sans text-stone-800 selection:bg-party-pink/20">
      {/* Animated Header */}
      <header className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div
            className="confetti-dot bg-party-pink top-10 left-[15%]"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="confetti-dot bg-celebrate-gold top-40 left-[80%]"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="confetti-dot bg-soft-mint top-60 left-[10%]"
            style={{ animationDelay: "3s" }}
          />
          <div
            className="confetti-dot bg-dusty-rose top-20 left-[60%]"
            style={{ animationDelay: "4.5s" }}
          />
        </div>

        <div className="relative z-10 pop-in">
          <span className="inline-block px-4 py-1 rounded-full bg-party-pink/10 text-party-pink font-semibold text-sm tracking-widest uppercase mb-4">
            It's time to celebrate
          </span>
          <h1 className="font-display text-6xl md:text-8xl text-party-pink mb-6 drop-shadow-sm">
                        {celebration.heading}

          </h1>
          <p className="max-w-xl mx-auto text-lg text-stone-600 leading-relaxed">
            {celebration.subtitle}
          </p>
        </div>
      </header>

      {/* Interactive Card Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Message Card 1 */}
          <div className="floating-card group bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 cursor-default">
            <div className="size-12 rounded-2xl bg-soft-mint flex items-center justify-center mb-6">
              <Sparkles className="size-6 text-celebrate-gold" />
            </div>
            <h3 className="text-xl font-bold mb-3">A Special Wish</h3>
            <p className="text-stone-500 mb-6">
              "May your day be filled with lots of love, happines and joy. You
              deserve the best! That's why you have me."
            </p>
            <div className="text-sm font-semibold text-party-pink">— From your Love.</div>
          </div>

          {/* Interactive Photo Slot */}
          <div className="floating-card bg-white p-4 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100">
            <div className="w-full aspect-[4/5] bg-stone-50 rounded-2xl overflow-hidden outline-1 -outline-offset-1 outline-black/5">
              <img
                src={friendsLaughing}
                alt="Friends laughing together at a garden party"
                width={800}
                height={1000}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div className="mt-4 text-center pb-2">
              <span className="text-stone-400 italic text-sm">You with your big smile.</span>
            </div>
          </div>

          {/* Message Card 2 */}
          <div className="floating-card group bg-dusty-rose/20 p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-dusty-rose/30 cursor-default">
            <div className="size-12 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm">
              <PartyPopper className="size-6 text-party-pink" />
            </div>
            <h3 className="text-xl font-bold mb-3">To New Beginnings</h3>
            <p className="text-stone-600 mb-6">
              "Another trip around the sun! Can't wait to see all the amazing things you achieve
              this year."
            </p>
            <div className="text-sm font-semibold text-party-pink">— Again Me</div>
          </div>
        </div>
      </section>

      {/* Interactive Surprise Section */}
      <section className="py-20 bg-soft-mint/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-soft-mint/50 border border-white">
            <h2 className="text-3xl font-bold mb-8">Tap your surprise gift!</h2>

            <div className="flex flex-wrap justify-center gap-6">
              <button
                onClick={revealMessage}
                className="inline-flex items-center gap-2 px-8 py-4 bg-party-pink text-white rounded-full font-bold shadow-lg shadow-party-pink/30 hover:scale-105 transition-transform active:scale-95 cursor-pointer"
              >
                Reveal Message <Mail className="size-4" />
              </button>
              <button
                onClick={playSong}
                className="inline-flex items-center gap-2 px-8 py-4 bg-celebrate-gold text-white rounded-full font-bold shadow-lg shadow-celebrate-gold/30 hover:scale-105 transition-transform active:scale-95 cursor-pointer"
              >
                Play Birthday Song <Music className="size-4" />
              </button>
              <button
                onClick={scrollToPhotos}
                className="inline-flex items-center gap-2 px-8 py-4 bg-stone-800 text-white rounded-full font-bold shadow-lg shadow-stone-800/20 hover:scale-105 transition-transform active:scale-95 cursor-pointer"
              >
                See Photos <Camera className="size-4" />
              </button>
            </div>

            <div className="mt-12 pt-12 border-t border-stone-100">
            </div>
          </div>
        </div>
      </section>

      {/* Footer Photo Grid */}
      <section ref={photosRef} className="py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden outline-1 -outline-offset-1 outline-black/5">
              <img
                src={birthdayCake}
                alt="Colorful birthday cake with lit candles"
                width={600}
                height={600}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden outline-1 -outline-offset-1 outline-black/5 mt-8">
              <img
                src={pastelBalloons}
                alt="Festive balloons in pastel colors"
                width={600}
                height={600}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden outline-1 -outline-offset-1 outline-black/5">
              <img
                src={fireworksNight}
                alt="Polaroid style fireworks at night"
                width={600}
                height={600}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden outline-1 -outline-offset-1 outline-black/5 mt-8">
              <img
                src={champagneToast}
                alt="Hands holding champagne glasses for a toast"
                width={600}
                height={600}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-stone-400 text-xs tracking-[0.2em] uppercase">
        <p>Made with ✨ for your special day</p>
        <button
          onClick={lockAgain}
          className="mt-4 text-[0.65rem] tracking-[0.2em] uppercase text-stone-400 hover:text-party-pink transition-colors cursor-pointer"
        >
          Lock this page
        </button>
      </footer>

      {/* Reveal Message Dialog */}
      <Dialog open={revealOpen} onOpenChange={setRevealOpen}>
        <DialogContent className="bg-white border-stone-100 rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-party-pink text-center">
              A Secret Birthday Wish
            </DialogTitle>
            <DialogDescription className="text-center text-stone-600 text-base leading-relaxed">
              {celebration.secretMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                setRevealOpen(false);
                launchConfetti({ x: 0.5, y: 0.5 });
              }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-party-pink text-white rounded-full font-semibold shadow-lg shadow-party-pink/30 hover:scale-105 transition-transform cursor-pointer"
            >
              Close with confetti <PartyPopper className="size-4" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
