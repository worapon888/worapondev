"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { TypewriterOpts } from "@/types/contact";

export function useTypewriterLoop(
  enabled: boolean,
  text: string,
  opts: TypewriterOpts,
) {
  const {
    typeSpeed = 40,
    endHoldMs = 1400,
    repeatDelayMs = 2500,
    glitchChance = 0.1,
    glitchChars = "01<>/\\[]{}—_+*#@!?",
  } = opts;

  const [out, setOut] = useState(text);
  const state = useRef({ running: false, raf: 0, t1: 0, t2: 0 });

  const clear = useCallback((s: typeof state.current) => {
    cancelAnimationFrame(s.raf);
    clearTimeout(s.t1);
    clearTimeout(s.t2);
  }, []);

  const runOnce = useCallback(
    () =>
      new Promise<void>((resolve) => {
        const s = state.current;
        clear(s);
        s.running = true;

        let i = 0;
        let last = 0;

        setOut("");

        const tick = (now: number) => {
          if (!s.running) return;

          if (now - last < typeSpeed) {
            s.raf = requestAnimationFrame(tick);
            return;
          }

          last = now;
          i = Math.min(text.length, i + 1);

          const next =
            i < text.length && Math.random() < glitchChance
              ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
              : "";

          setOut(text.slice(0, i) + next);

          if (i < text.length) {
            s.raf = requestAnimationFrame(tick);
          } else {
            setOut(text);
            s.t1 = window.setTimeout(resolve, endHoldMs);
            s.running = false;
          }
        };

        s.raf = requestAnimationFrame(tick);
      }),
    [clear, endHoldMs, glitchChance, glitchChars, text, typeSpeed],
  );

  useLayoutEffect(() => {
    if (!enabled) return;

    let mounted = true;
    const s = state.current;

    const loop = async () => {
      while (mounted && enabled) {
        await runOnce();
        await new Promise<void>(
          (r) => (s.t2 = window.setTimeout(r, repeatDelayMs)),
        );
      }
    };

    loop();

    return () => {
      mounted = false;
      s.running = false;
      clear(s);
      setOut(text);
    };
  }, [enabled, text, repeatDelayMs, runOnce, clear]);

  return out;
}
