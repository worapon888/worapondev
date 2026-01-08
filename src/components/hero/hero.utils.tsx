import React from "react";

export const buildHeroChars = (
  text: string,
  pattern: string[],
  ghostOffset = 0
) => {
  let gi = ghostOffset;

  return text.split("").map((ch, idx) => {
    const isSpace = ch === " ";
    const ghost = isSpace ? "" : pattern[gi++ % pattern.length];

    return (
      <span
        key={`${ch}-${idx}`}
        className="hero-char"
        data-skip={isSpace ? "1" : undefined}
        data-char={ch}
        data-ghost={ghost}
      >
        <span className="hero-real">{isSpace ? "\u00A0" : ch}</span>
        {!isSpace && <span className="hero-ghost">{ghost}</span>}
      </span>
    );
  });
};
