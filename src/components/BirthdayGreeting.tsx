import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Cake, Heart, Wand2, PartyPopper } from "lucide-react";

/**
 * Happy Birthday (UA) — v26
 * ---------------------------------------------------------
 * Головні оновлення:
 *  1) Гірлянда-рамка переміщена максимально близько до країв
 *     (мінімальні безпечні відступи, щоб світло не обрізалось).
 *  2) Увімкнені коментарі практично у кожному блоці — легше
 *     зрозуміти призначення та швидко змінювати стилі/логіку.
 *  3) Збережено: зорепад (хаотичний), зоряне небо, орби,
 *     інтерактивні кнопки, побажання, конфеті-наздрав’я.
 */

export default function BirthdayGreeting() {
  // Ім’я можна змінити прямо тут
  const NAME = "Друже";

  // Індекс активного побажання + лічильник «вибухів» для анімації
  const [wishIndex, setWishIndex] = useState(0);
  const [burst, setBurst] = useState(0);

  // Рефи для системних шарів
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const effectsRef = useRef<HTMLDivElement | null>(null);

  // Фіксуємо скрол, щоб анімації не «пливли»
  useEffect(() => {
    const h0 = document.documentElement.style.overflow;
    const b0 = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = h0;
      document.body.style.overflow = b0;
    };
  }, []);

  /* ----------------------- Побажання ---------------------- */
  const wishes = [
    "Міцного здоров’я, сталевих нервів і теплих людей поруч!",
    "Нехай кожна ціль захопливо здійснюється й приносить радість.",
    "Більше сміливих мрій, приємних сюрпризів і гучних перемог!",
    "Хай дім буде затишним, робота приносить натхнення, а серце — спокій.",
    "Успіхів у всіх починаннях та яскравих подорожей!",
    "Хай удача завжди стоїть на твоєму боці — сьогодні і щодня.",
    "Запалу, енергії та лише добрих новин у новому колі сонця.",
    "Більше приводів посміхатись і менше причин хвилюватися!",
  ];

  /* ----------------------- Конфеті ------------------------ */
  // Створювач конфеті (прив’язка до локального canvas)
  const getShooter = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return null;
    return confetti.create(canvas, { resize: true, useWorker: true });
  };

  // Повноекранний «залп» — з чотирьох сторін + фінальний вибух у центрі
  function fullScreenBlast() {
    const shoot = getShooter();
    if (!shoot) return;
    const count = 10;
    const step = 45;
    for (let i = 0; i < count; i++)
      setTimeout(() => shoot({ particleCount: 60, spread: 360, startVelocity: 55, origin: { x: i / (count - 1), y: 0.06 } }), i * step);
    for (let i = 0; i < count; i++)
      setTimeout(() => shoot({ particleCount: 60, spread: 360, startVelocity: 55, origin: { x: i / (count - 1), y: 0.94 } }), (count + i) * step);
    for (let i = 0; i < count; i++)
      setTimeout(() => shoot({ particleCount: 50, spread: 360, startVelocity: 55, origin: { x: 0.04, y: i / (count - 1) } }), (2 * count + i) * step);
    for (let i = 0; i < count; i++)
      setTimeout(() => shoot({ particleCount: 50, spread: 360, startVelocity: 55, origin: { x: 0.96, y: i / (count - 1) } }), (3 * count + i) * step);
    setTimeout(() => shoot({ particleCount: 220, spread: 360, startVelocity: 60, origin: { x: 0.5, y: 0.5 } }), (4 * count + 2) * step);
  }

  // «Свічки» — теплі іскри з області заголовка
  function cakeCandles() {
    const shoot = getShooter();
    if (!shoot) return;
    const colors = ["#fff7b2", "#ffe08a", "#ffb703", "#ffd166"];
    shoot({ particleCount: 100, spread: 70, startVelocity: 40, origin: { x: 0.5, y: 0.18 }, colors });
    shoot({ particleCount: 80, spread: 90, startVelocity: 30, origin: { x: 0.5, y: 0.18 }, colors, gravity: 0.5 });
  }

  // «Гармати» — два бічних залпи
  function sideCannons() {
    const shoot = getShooter();
    if (!shoot) return;
    const colors = ["#a78bfa", "#60a5fa", "#34d399", "#f472b6"];
    shoot({ particleCount: 120, angle: 60, spread: 55, origin: { x: 0.0, y: 0.8 }, colors });
    shoot({ particleCount: 120, angle: 120, spread: 55, origin: { x: 1.0, y: 0.8 }, colors });
  }

  // Дощ з емодзі — працює і для «сердець», і для «блиску»
  function emojiRain(symbol: string, opts?: { count?: number; duration?: number; yFrom?: string; yTo?: string }) {
    const host = effectsRef.current;
    if (!host) return;
    const count = opts?.count ?? 40;
    const duration = opts?.duration ?? 3500;
    const yFrom = opts?.yFrom ?? "110vh";
    const yTo = opts?.yTo ?? "-10vh";
    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");
      span.textContent = symbol;
      const left = Math.random() * 100;
      const size = 18 + Math.random() * 18;
      const delay = Math.random() * 0.8;
      const rotate = (Math.random() * 40 - 20).toFixed(1);
      span.setAttribute(
        "style",
        `position:absolute;left:${left}vw;top:0;font-size:${size}px;transform:translateY(${yFrom}) rotate(${rotate}deg);will-change:transform,opacity;pointer-events:none;filter:drop-shadow(0 2px 4px rgba(0,0,0,.35));`
      );
      host.appendChild(span);
      span.animate(
        [
          { transform: `translateY(${yFrom}) rotate(${rotate}deg)`, opacity: 0 },
          { transform: `translateY(${(parseFloat(yFrom) + parseFloat(yTo)) / 2}vh) rotate(${rotate}deg)`, opacity: 1 },
          { transform: `translateY(${yTo}) rotate(${rotate}deg)`, opacity: 0 },
        ],
        { duration: duration + Math.random() * 800, delay: delay * 1000, easing: "ease-in-out" }
      );
      setTimeout(() => host.removeChild(span), duration + 1200);
    }
  }

  // Головна кнопка «Святкувати»
  function celebrate() {
    fullScreenBlast();
    setWishIndex((p) => (p + 1) % wishes.length);
    setBurst((b) => b + 1);
  }

  /* --------------- Лейаут і відступи блоку --------------- */
  const TITLE_GAP = 48;    // відступ під заголовком
  const BUTTON_GAP = 20;   // відступ під кнопкою «Святкувати»
  const GRID_MB = 36;      // нижній відступ усієї «сітки»
  const ACTION_HEIGHT = 60;
  const GAP = 30;          // проміжок між інтерактивними кнопками

  // Зсуви верхнього та нижнього рядів кнопок відносно центрового побажання
  const TOP_ROW_OFFSET_Y = -22;
  const BOTTOM_ROW_OFFSET_Y = 22;

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100dvw",
        overflow: "hidden",
        color: "#fff",
        position: "relative",
        // Фоновий градієнт + «плями» кольору
        background:
          "radial-gradient(80% 80% at 20% 20%, #5b21b6 0%, rgba(0,0,0,0) 60%)," +
          "radial-gradient(70% 70% at 80% 30%, #1d4ed8 0%, rgba(0,0,0,0) 55%)," +
          "radial-gradient(70% 90% at 30% 80%, #059669 0%, rgba(0,0,0,0) 50%)," +
          "linear-gradient(#0b1120 0%, #0b1226 100%)",
      }}
    >
      {/* Системні шари: конфеті та «дощі» емодзі */}
      <canvas ref={confettiCanvasRef} style={{ position: "fixed", inset: 0, width: "100dvw", height: "100dvh", pointerEvents: "none", zIndex: 9999 }} />
      <div ref={effectsRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 60 }} />

      {/* Гірлянда-рамка максимально близько до країв */}
      <BorderGarlands />

      {/* Декор: орби, щільне зоряне небо та хаотичний зорепад */}
      <AmbientOrbs opacity={0.18} />
      <DenseStarfield />
      <ChaoticShootingStars />

      {/* Основний контент */}
      <main style={{ minHeight: "100dvh", width: "100%", display: "grid", placeItems: "center", padding: "48px 16px" }}>
        <div style={{ width: "min(1100px, 94vw)", margin: "0 auto", textAlign: "center" }}>
          {/* Яскравий райдужний заголовок */}
          <h1 style={{ fontWeight: 800, fontSize: 36, marginBottom: TITLE_GAP }}>
            <RainbowText text={`З Днем народження, ${NAME}!`} />
          </h1>

          {/* Кнопка «Святкувати» */}
          <div style={{ display: "grid", placeItems: "center", marginBottom: BUTTON_GAP }}>
            <motion.button
              onClick={celebrate}
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -2 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                borderRadius: 16,
                padding: "12px 20px",
                fontWeight: 700,
                background: "linear-gradient(90deg,#d946ef,#6366f1)",
                boxShadow: "0 10px 35px rgba(99,102,241,0.45)",
                border: "1px solid rgba(255,255,255,0.2)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span>Святкувати</span>
              <PartyPopper style={{ width: 20, height: 20 }} />
              {/* Блиск поверх кнопки */}
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, rgba(255,255,255,0.18), transparent 40%, transparent 60%, rgba(255,255,255,0.18))",
                  mixBlendMode: "overlay",
                  opacity: 0.35,
                }}
              />
            </motion.button>
          </div>

          {/* Сітка інтерактивних іконок + центрове побажання */}
          <div
            style={{
              position: "relative",
              margin: `0 auto ${GRID_MB}px`,
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gridTemplateRows: `repeat(2, ${ACTION_HEIGHT}px)`,
              columnGap: GAP,
              rowGap: GAP,
              maxWidth: 820,
              justifyItems: "stretch",
              alignItems: "stretch",
            }}
          >
            {/* Верхній ряд (легкий підйом) */}
            <div style={{ transform: `translateY(${TOP_ROW_OFFSET_Y}px)` }}>
              <IconAction fullWidth icon={Cake} title="Свічки" onClick={cakeCandles} height={ACTION_HEIGHT} />
            </div>
            <div style={{ transform: `translateY(${TOP_ROW_OFFSET_Y}px)` }}>
              <IconAction fullWidth icon={Heart} title="Сердечка" onClick={() => emojiRain("❤️", { count: 48, duration: 4200 })} height={ACTION_HEIGHT} />
            </div>

            {/* Нижній ряд (легкий опуск) */}
            <div style={{ transform: `translateY(${BOTTOM_ROW_OFFSET_Y}px)` }}>
              <IconAction fullWidth icon={Wand2} title="Блиск" onClick={() => emojiRain("✨", { count: 64, duration: 3200 })} height={ACTION_HEIGHT} />
            </div>
            <div style={{ transform: `translateY(${BOTTOM_ROW_OFFSET_Y}px)` }}>
              <IconAction fullWidth icon={PartyPopper} title="Гармати" onClick={sideCannons} height={ACTION_HEIGHT} />
            </div>

            {/* Центрове побажання поверх сітки (не перекриває кліки) */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={burst}
                  initial={{ opacity: 0, y: 12, scale: 0.92 }}
                  animate={{ opacity: 1, y: [12, -6, 0], scale: [0.92, 1.06, 1] }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  style={{
                    borderRadius: 9999,
                    padding: "14px 28px",
                    background: "linear-gradient(180deg, rgba(0,0,0,0.30), rgba(0,0,0,0.18))",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
                    maxWidth: "96%",
                  }}
                >
                  <WishTextBig key={`wish-${burst}`} text={wishes[wishIndex]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Підпис під сіткою */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", alignItems: "center", opacity: 0.9, fontSize: 14 }}>
            <span>Натисни «Святкувати», щоб засипати екран конфеті 🎆</span>
            <span>З повагою — твоя команда підтримки щастя ✨</span>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------------------------------------------------
 * Кнопка-іконка (скляний прямокутник з піктограмою)
 * --------------------------------------------------------- */
function IconAction({
  icon: Icon,
  title,
  onClick,
  height,
  fullWidth = false,
}: {
  icon: any;
  title: string;
  onClick: () => void;
  height: number;
  fullWidth?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.02, boxShadow: "0 16px 40px rgba(0,0,0,0.45)" as any }}
      whileTap={{ scale: 0.98 }}
      title={title}
      style={{
        width: fullWidth ? "100%" : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height,
        borderRadius: 14,
        padding: 10,
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        border: "1px solid rgba(255,255,255,0.18)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))",
        backdropFilter: "blur(6px)",
        boxSizing: "border-box",
      }}
    >
      <Icon style={{ width: 22, height: 22 }} />
      {/* внутрішній м’який відблиск */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 14,
          boxShadow: "inset 0 0 40px rgba(255,255,255,0.08)",
          background: "radial-gradient(60% 60% at 50% 0%, rgba(255,255,255,0.25), transparent 60%)",
          opacity: 0.25,
          pointerEvents: "none",
        }}
      />
    </motion.button>
  );
}

/* ---------------------------------------------------------
 * Анімований великий текст побажання (градієнт + «пружинка»)
 * --------------------------------------------------------- */
function WishTextBig({ text }: { text: string }) {
  const letters = useMemo(() => Array.from(text), [text]);
  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0%   { background-position:   0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
      <span style={{ whiteSpace: "nowrap", fontSize: 20, fontWeight: 800 }}>
        {letters.map((ch, i) => {
          const delay = i * 0.028;
          return (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.96, rotate: -2 }}
              animate={{ opacity: 1, y: [10, -4, 0], scale: [0.96, 1.05, 1], rotate: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay }}
              style={{
                display: "inline-block",
                backgroundImage: "linear-gradient(90deg,#ffffff,#fde68a,#f0abfc,#a78bfa,#60a5fa)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                backgroundSize: "200% 100%",
                animation: "gradientShift 2.4s ease-in-out infinite",
                textShadow:
                  "0 0 20px rgba(255,255,255,0.5), 0 0 35px rgba(168,85,247,0.35), 0 0 60px rgba(96,165,250,0.25)",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          );
        })}
      </span>
    </>
  );
}

/* ---------------------------------------------------------
 * Гірлянда-рамка: дроти та лампочки по всьому периметру
 * — тепер максимально близько до країв (мінімальні відступи)
 * --------------------------------------------------------- */
function BorderGarlands() {
  // Мінімальні безпечні відступи від краю (щоб свічення не обрізалось)
  const offsetVw = 0.6; // горизонтальний (у vw)
  const offsetVh = 1.5; // вертикальний (у vh)

  // Кількість лампочок на кожній стороні
  const topCount = 36;
  const bottomCount = 36;
  const sideCount = 28;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 22, pointerEvents: "none" }}>
      <style>{`
        @keyframes hueSpin {
          0%   { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        @keyframes glowPulse {
          0%,100% { transform: translate(-50%,-50%) scale(1);   opacity: .92; }
          50%     { transform: translate(-50%,-50%) scale(1.25); opacity: 1;   }
        }
        /* Стиль лампочки */
        .bulb {
          width: 10px; height: 10px; border-radius: 9999px;
          background: radial-gradient(circle at 35% 35%, #fff, #fff5c4 60%, #ffd166 100%);
          box-shadow: 0 0 14px rgba(255,235,140,.9), 0 0 30px rgba(255,235,140,.5), 0 0 60px rgba(255,255,255,.35);
          position: absolute; pointer-events: none;
          animation: hueSpin 7.5s linear infinite, glowPulse 3s ease-in-out infinite;
        }
        /* Тонка лінія дроту */
        .wire {
          position:absolute; pointer-events:none; opacity:.38;
          border-radius:9999px;
          background: rgba(255,255,255,.38);
          box-shadow: 0 0 2px rgba(255,255,255,.55);
        }
      `}</style>

      {/* Верхній дріт */}
      <div className="wire" style={{ left: `${offsetVw}vw`, right: `${offsetVw}vw`, top: `${offsetVh}vh`, height: 2 }} />
      {/* Нижній дріт */}
      <div className="wire" style={{ left: `${offsetVw}vw`, right: `${offsetVw}vw`, bottom: `${offsetVh}vh`, height: 2 }} />
      {/* Лівий дріт */}
      <div className="wire" style={{ top: `${offsetVh}vh`, bottom: `${offsetVh}vh`, left: `${offsetVw}vw`, width: 2 }} />
      {/* Правий дріт */}
      <div className="wire" style={{ top: `${offsetVh}vh`, bottom: `${offsetVh}vh`, right: `${offsetVw}vw`, width: 2 }} />

      {/* Верхні лампочки */}
      {Array.from({ length: topCount }).map((_, i) => {
        const t = i / Math.max(topCount - 1, 1);
        const left = offsetVw + t * (100 - offsetVw * 2);
        const delay = (i % 10) * 0.1;
        return <span key={`t${i}`} className="bulb" style={{ top: `${offsetVh}vh`, left: `${left}vw`, animationDelay: `${delay}s` }} />;
      })}

      {/* Нижні лампочки */}
      {Array.from({ length: bottomCount }).map((_, i) => {
        const t = i / Math.max(bottomCount - 1, 1);
        const left = offsetVw + t * (100 - offsetVw * 2);
        const delay = ((i + 3) % 10) * 0.12;
        return <span key={`b${i}`} className="bulb" style={{ bottom: `${offsetVh}vh`, left: `${left}vw`, animationDelay: `${delay}s` }} />;
      })}

      {/* Ліві лампочки */}
      {Array.from({ length: sideCount }).map((_, i) => {
        const t = i / Math.max(sideCount - 1, 1);
        const top = offsetVh + t * (100 - offsetVh * 2);
        const delay = ((i + 1) % 8) * 0.15;
        return <span key={`l${i}`} className="bulb" style={{ top: `${top}vh`, left: `${offsetVw}vw`, animationDelay: `${delay}s` }} />;
      })}

      {/* Праві лампочки */}
      {Array.from({ length: sideCount }).map((_, i) => {
        const t = i / Math.max(sideCount - 1, 1);
        const top = offsetVh + t * (100 - offsetVh * 2);
        const delay = ((i + 5) % 9) * 0.14;
        return <span key={`r${i}`} className="bulb" style={{ top: `${top}vh`, right: `${offsetVw}vw`, animationDelay: `${delay}s` }} />;
      })}
    </div>
  );
}

/* ---------------------------------------------------------
 * М’які «орби» — кольорові плями, що повільно дрейфують
 * --------------------------------------------------------- */
function AmbientOrbs({ opacity = 0.18 }: { opacity?: number }) {
  const orbs = [
    { x: "15%", y: "72%", size: 440, color: "rgba(16,185,129,1)" },
    { x: "82%", y: "28%", size: 380, color: "rgba(59,130,246,1)" },
    { x: "35%", y: "20%", size: 320, color: "rgba(147,51,234,1)" },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 12, pointerEvents: "none" }}>
      <style>{`
        @keyframes orbDrift {
          0%   { transform: translate(-8px,  6px) scale(1); }
          50%  { transform: translate( 8px, -6px) scale(1.06); }
          100% { transform: translate(-8px,  6px) scale(1); }
        }
      `}</style>
      {orbs.map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: o.x,
            top: o.y,
            width: o.size,
            height: o.size,
            borderRadius: "50%",
            background: `radial-gradient(closest-side, ${o.color}, transparent 70%)`,
            filter: "blur(40px)",
            opacity,
            mixBlendMode: "screen",
            animation: `orbDrift ${14 + i * 3}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------
 * Райдужний заголовок з «пружинною» появою по літерах
 * --------------------------------------------------------- */
function RainbowText({ text }: { text: string }) {
  const letters = useMemo(() => Array.from(text), [text]);
  return (
    <span>
      {letters.map((ch, i) => {
        const hue = (i * 360) / Math.max(letters.length, 1);
        const delay = i * 0.05 + Math.sin(i * 0.5) * 0.02;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: [24, -10, 0], scale: [0.96, 1.04, 1] }}
            transition={{ duration: 0.6, ease: "easeOut", delay }}
            style={{ color: `hsl(${hue}, 90%, 70%)`, display: "inline-block" }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        );
      })}
    </span>
  );
}

/* ---------------------------------------------------------
 * Щільніше зоряне небо (мерехтіння)
 * --------------------------------------------------------- */
function DenseStarfield() {
  const stars = useMemo(
    () =>
      Array.from({ length: 160 }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2.2 + 0.6,
        delay: Math.random() * 3,
        tw: 1.8 + Math.random() * 1.6,
      })),
    []
  );
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 11 }}>
      {stars.map((s, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 0 6px rgba(255,255,255,.6)",
            animation: `twinkle${i} ${s.tw}s ease-in-out infinite`,
            opacity: 0.9,
          }}
        >
          <style>{`
            @keyframes twinkle${i} {
              0%,100% { opacity: .25; transform: scale(.9); }
              50% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </span>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------
 * Хаотичні яскраві «падаючі зірки»
 *  - стартують з випадкового краю
 *  - летять у випадкову точку за межами видимої зони
 *  - мають яскравий «хвіст»
 *  - інтервал ~10 секунд для нових зірок
 * --------------------------------------------------------- */
function ChaoticShootingStars() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current!;
    let mounted = true;

    const spawn = () => {
      if (!mounted) return;

      // старт: випадковий край екрана
      const startSide = Math.floor(Math.random() * 4); // 0 top,1 right,2 bottom,3 left
      let startX = 0, startY = 0;
      if (startSide === 0) { startX = Math.random() * 100; startY = -8; }
      if (startSide === 1) { startX = 108; startY = Math.random() * 100; }
      if (startSide === 2) { startX = Math.random() * 100; startY = 108; }
      if (startSide === 3) { startX = -8; startY = Math.random() * 100; }

      // фініш: довільна точка поза межами
      const endX = -8 + Math.random() * 116;
      const endY = -8 + Math.random() * 116;

      const dx = endX - startX;
      const dy = endY - startY;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len < 30) return; // надто коротко — пропускаємо
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const dur = 1300 + Math.random() * 1200;

      // контейнер для хвоста та «голови»
      const holder = document.createElement("span");
      holder.setAttribute("style", `position:absolute;left:${startX}vw;top:${startY}vh;pointer-events:none;will-change:transform,opacity;`);

      // хвіст
      const tailLen = 18 + Math.random() * 42;
      const trail = document.createElement("div");
      trail.setAttribute(
        "style",
        `width:${tailLen}px;height:2.6px;border-radius:3px;background:linear-gradient(90deg,rgba(255,255,255,1) 0%,rgba(255,255,255,0) 80%);transform:rotate(${angle}deg);filter:drop-shadow(0 0 6px rgba(255,255,255,.95)) drop-shadow(0 0 20px rgba(255,255,255,.45));`
      );

      // «голова» зірки
      const head = document.createElement("div");
      head.setAttribute(
        "style",
        `position:absolute;left:-3px;top:-1.3px;width:5.2px;height:5.2px;border-radius:9999px;background:#fff;box-shadow:0 0 10px rgba(255,255,255,1),0 0 24px rgba(255,255,255,.8);transform:rotate(${angle}deg);`
      );

      holder.appendChild(trail);
      holder.appendChild(head);

      // анімація з урахуванням конкретного вектора
      const key = document.createElement("style");
      key.textContent = `
        @keyframes fly {
          0%   { transform: translate3d(0,0,0); opacity: 0; }
          10%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translate3d(${dx}vw, ${dy}vh, 0); opacity: 0; }
        }
      `;
      holder.appendChild(key);
      holder.style.animation = `fly ${dur}ms linear forwards`;

      host.appendChild(holder);
      setTimeout(() => host.contains(holder) && host.removeChild(holder), dur + 80);
    };

    const firstDelay = 800 + Math.random() * 1800;
    const timer1 = setTimeout(spawn, firstDelay);
    const timer2 = setInterval(spawn, 10000); // нова зірка ~кожні 10с

    return () => {
      clearTimeout(timer1);
      clearInterval(timer2);
      mounted = false;
    };
  }, []);

  return <div ref={hostRef} style={{ position: "fixed", inset: 0, zIndex: 13, pointerEvents: "none" }} />;
}
