"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import type { MapStop } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Schematic SVG map of Sri Lanka (no external map API).
 * viewBox 0 0 200 320 — pins are placed with normalized x/y coordinates from mock data.
 */
export function SriLankaMap({
  stops,
  route = false,
  className,
  activeIndex = -1,
}: {
  stops: MapStop[];
  /** draw a dashed road path through stops in order (day-by-day flow) */
  route?: boolean;
  className?: string;
  activeIndex?: number;
}) {
  const reduce = useReducedMotion();

  const pathData = useMemo(() => {
    if (stops.length < 2) return "";
    return stops.map((s, i) => `${i === 0 ? "M" : "L"} ${s.x} ${s.y}`).join(" ");
  }, [stops]);

  return (
    <div className={cn("relative", className)}>
      <svg viewBox="0 0 200 320" className="w-full drop-shadow-sm" role="img" aria-label="Schematic map of Sri Lanka">
        <defs>
          <linearGradient id="islandFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EAF3FC" />
            <stop offset="100%" stopColor="#DCEAF7" />
          </linearGradient>
        </defs>

        {/* island outline */}
        <path
          d="M100 8 C118 12 130 26 136 45 C142 64 138 84 146 103 C154 122 166 140 164 162 C162 184 148 200 150 220 C152 240 140 262 124 278 C108 294 88 306 70 300 C52 294 44 274 46 254 C48 234 40 216 34 196 C28 176 30 154 38 134 C46 114 44 94 52 74 C60 54 76 40 84 24 C90 14 94 8 100 8 Z"
          fill="url(#islandFill)"
          stroke="#B7CFE8"
          strokeWidth="1.5"
        />
        {/* faint province dividers */}
        <path d="M52 74 C80 88 120 90 136 45" fill="none" stroke="#CBDEF0" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M38 134 C70 120 130 118 146 103" fill="none" stroke="#CBDEF0" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M34 196 C70 184 140 178 164 162" fill="none" stroke="#CBDEF0" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M46 254 C80 246 130 240 150 220" fill="none" stroke="#CBDEF0" strokeWidth="1" strokeDasharray="3 3" />
        {/* hill country shading */}
        <ellipse cx="105" cy="200" rx="22" ry="30" fill="#5FD4B4" opacity="0.15" />

        {/* route */}
        {route && stops.length > 1 && (
          <>
            <motion.path
              d={pathData}
              fill="none"
              stroke="#2FB491"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 5"
              initial={reduce ? false : { pathLength: 0 }}
              whileInView={reduce ? undefined : { pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
            {/* direction chevrons at segments midpoints */}
            {stops.slice(0, -1).map((s, i) => {
              const n = stops[i + 1];
              const mx = (s.x + n.x) / 2, my = (s.y + n.y) / 2;
              const ang = (Math.atan2(n.y - s.y, n.x - s.x) * 180) / Math.PI;
              return (
                <g key={i} transform={`translate(${mx} ${my}) rotate(${ang})`} opacity="0.9">
                  <path d="M-2 -3 L3 0 L-2 3" fill="none" stroke="#1E4176" strokeWidth="1.6" strokeLinecap="round" />
                </g>
              );
            })}
          </>
        )}

        {/* pins */}
        {stops.map((s, i) => (
          <motion.g
            key={s.city + i}
            initial={reduce ? false : { y: -8, opacity: 0 }}
            animate={reduce ? undefined : { y: 0, opacity: 1 }}
            transition={{ delay: 0.15 * i + (route ? 0.6 : 0), type: "spring", stiffness: 260, damping: 18 }}
          >
            {!reduce && (
              <motion.circle
                cx={s.x} cy={s.y} r="6" fill="none" stroke={activeIndex === i ? "#59B9EB" : "#2FB491"}
                initial={{ opacity: 0.8, scale: 0.6 }}
                animate={{ opacity: 0, scale: 1.9 }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.4 * i }}
                style={{ transformOrigin: `${s.x}px ${s.y}px` }}
              />
            )}
            <circle cx={s.x} cy={s.y} r="4.2" fill={activeIndex === i ? "#59B9EB" : "#1E4176"} stroke="#fff" strokeWidth="1.6" />
            {route && (
              <text x={s.x} y={s.y + 2.6} textAnchor="middle" fontSize="5.6" fontWeight="700" fill="#fff">
                {i + 1}
              </text>
            )}
          </motion.g>
        ))}
      </svg>
      <p className="mt-1 text-center text-[10.5px] italic text-slate-400">Schematic map — for orientation, not navigation</p>
    </div>
  );
}
