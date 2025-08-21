import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { PartyPopper, Gift, Cake, Sparkles, Heart } from "lucide-react";

// 🎉 Анімоване привітання з Днем народження (UA)
// Покращено: повноекранне центроване оформлення, адаптивні розміри, mobile-safe viewport, safe-area для iOS,
// акуратні відступи і читабельність на малих екранах. Tailwind + Framer Motion + canvas-confetti.

export default function BirthdayGreeting() {
  const [name, setName] = useState("Друже");
  const [wishIndex, setWishIndex] = useState(0);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const wishes = [
    "Міцного здоров'я, сталевих нервів і теплих людей поруч!",
    "Нехай кожна ціль захопливо здійснюється й приносить радість.",
    "Більше сміливих мрій, приємних сюрпризів і гучних перемог!",
    "Хай дім буде затишним, робота приносить натхнення, а серце — спокій.",
    "Успіхів у всіх починаннях та яскравих подорожей!",
    "Хай удача завжди стоїть на твоєму боці — сьогодні і щодня.",
    "Запалу, енергії та лише добрих новин у новому колі сонця.",
    "Більше приводів посміхатись і менше причин хвилюватися!",
  ];

  // Стабільні параметри кульок
  const balloons = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        delay: Math.random() * 6,
        duration: 14 + Math.random() * 10,
        left: Math.random() * 100, // %
        size: 26 + Math.random() * 30, // px
        rotate: -15 + Math.random() * 30,
        opacity: 0.55 + Math.random() * 0.45,
      })),
    []
  );

  // Конфеті
  useEffect(() => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const shoot = confetti.create(canvas, { resize: true, useWorker: true });

    burst(shoot);
    const loop = setInterval(() => miniSprinkle(shoot), 5000);
    return () => clearInterval(loop);
  }, []);

  function burst(shoot: any) {
    shoot({ particleCount: 140, spread: 75, startVelocity: 55, origin: { y: 0.6 } });
    shoot({ particleCount: 90, angle: 60, spread: 55, origin: { x: 0 }, gravity: 0.9 });
    shoot({ particleCount: 90, angle: 120, spread: 55, origin: { x: 1 }, gravity: 0.9 });
  }

  function miniSprinkle(shoot: any) {
    shoot({ particleCount: 50, spread: 80, startVelocity: 35, origin: { y: 0.7 } });
  }

  function celebrate() {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const shoot = confetti.create(canvas, { resize: true, useWorker: true });
    burst(shoot);
    setWishIndex((p) => (p + 1) % wishes.length);
  }

  return (
    <div className="relative min-h-[100vh] md:min-h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/40 via-indigo-950 to-slate-950 text-white">
      {/* Конфеті-канвас */}
      <canvas ref={confettiCanvasRef} className="pointer-events-none fixed inset-0 z-40" />

      {/* Фонові сяючі плями */}
      <div className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-3xl" />

      {/* Гірлянда зверху */}
      <Garland />

      {/* Плаваючі кульки-емодзі */}
      {balloons.map((b) => (
        <motion.span
          key={b.id}
          initial={{ y: "100vh", rotate: b.rotate }}
          animate={{ y: "-20vh", rotate: -b.rotate }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{ left: `${b.left}%`, fontSize: b.size, opacity: b.opacity }}
          className="pointer-events-none select-none absolute bottom-[-15vh] z-10"
        >
          🎈
        </motion.span>
      ))}

      {/* Центрована секція-герой на всю висоту */}
      <main className="relative z-30 mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-center px-4 py-10 sm:py-14 md:py-16 [padding-top:env(safe-area-inset-top)] [padding-bottom:env(safe-area-inset-bottom)]">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl shadow-2xl sm:p-7 md:p-10"
        >
          <header className="relative mb-5 flex flex-col items-center gap-3 text-center sm:mb-7">
            <motion.div
              initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 10 }}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/30 ring-1 ring-white/20 sm:h-14 sm:w-14"
            >
              <PartyPopper className="h-6 w-6 sm:h-7 sm:w-7" />
            </motion.div>
            <div className="leading-tight">
              <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-200/80 sm:text-sm">
                Сьогодні твоє свято
              </p>
              <h1 className="text-3xl font-extrabold sm:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-pink-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_1px_10px_rgba(255,255,255,0.15)]">
                  З Днем народження{", "}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={name}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.35 }}
                    className="ml-2 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent"
                  >
                    {name}!
                  </motion.span>
                </AnimatePresence>
              </h1>
            </div>
          </header>

          {/* Інпут + кнопка, адаптивна сітка і центрування */}
          <div className="mx-auto mb-6 grid w-full max-w-2xl gap-3 sm:mb-8 sm:grid-cols-[1fr_auto] sm:items-center">
            <label className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-3 sm:p-4">
              <Sparkles className="h-5 w-5 opacity-80" />
              <input
                className="w-full bg-transparent text-base outline-none placeholder:text-white/50 sm:text-lg"
                placeholder="Впиши ім'я для привітання (напр. Нікіта)"
                value={name}
                onChange={(e) => setName(e.target.value || "Друже")}
                maxLength={24}
                inputMode="text"
              />
            </label>

            <motion.button
              onClick={celebrate}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 font-semibold shadow-lg ring-1 ring-white/20 hover:shadow-fuchsia-500/20 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/60"
            >
              <span className="relative">
                <span className="absolute inset-0 -z-10 animate-ping rounded-2xl bg-white/20" />
                Святкувати
              </span>
              <Gift className="h-5 w-5 transition-transform group-hover:rotate-12" />
            </motion.button>
          </div>

          {/* Побажання */}
          <AnimatePresence mode="wait">
            <motion.p
              key={wishIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="mx-auto mb-8 max-w-2xl text-pretty text-center text-base text-white/90 sm:mb-10 sm:text-lg md:text-xl"
            >
              {wishes[wishIndex]}
            </motion.p>
          </AnimatePresence>

          {/* Іконки-акценти */}
          <div className="mx-auto mb-3 grid max-w-2xl grid-cols-4 gap-3 sm:mb-6 sm:grid-cols-5">
            {[Cake, Heart, Sparkles, PartyPopper, Gift].map((Icon, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i + 0.1, type: "spring", stiffness: 120, damping: 12 }}
                className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3"
              >
                <Icon className="h-6 w-6 opacity-90" />
              </motion.div>
            ))}
          </div>

          {/* Низ картки */}
          <footer className="flex flex-col items-center justify-between gap-3 text-center text-sm text-white/70 sm:flex-row">
            <span>Натисни «Святкувати», щоб запустити феєрверк 🎆</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
              З повагою — твоя команда підтримки щастя ✨
            </span>
          </footer>
        </motion.section>
      </main>

      {/* Декоративні зірочки */}
      <Stars />

      {/* Додаткові стилі: mobile-safe viewport */}
      <style>{`
        :root { --app-vh: 100vh; }
        @supports (height: 100dvh) { :root { --app-vh: 100dvh; } }
        /* Мерехтіння зірочок */
        @keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1); } }
        .twinkle { animation: twinkle 2.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function Garland() {
  const bulbs = Array.from({ length: 22 });
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 pt-6">
      <div className="flex gap-2">
        {bulbs.map((_, i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-gradient-to-tr from-amber-200 to-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2 + (i % 5) * 0.15, repeat: Infinity }}
            style={{ filter: "saturate(1.4)" }}
          />
        ))}
      </div>
    </div>
  );
}

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 90 }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 2,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute twinkle rounded-full bg-white/90"
          style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
        />
      ))}
    </div>
  );
}
