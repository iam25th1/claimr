"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { ArrowRight, ArrowLeft, X } from "lucide-react";
import { useTour } from "@/lib/tour-state";

export interface TourStep {
  // CSS selector or [data-tour-id="..."] target. First match wins.
  target: string;
  title: string;
  body: string;
  // Where the tooltip sits relative to the target. Defaults to "auto"
  // which picks the side with the most room.
  placement?: "top" | "bottom" | "left" | "right" | "auto";
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const TOOLTIP_W = 320;
const TOOLTIP_GAP = 16;
const PADDING = 8;

function pickPlacement(rect: Rect, vw: number, vh: number): "top" | "bottom" | "left" | "right" {
  const spaceBottom = vh - (rect.top + rect.height);
  const spaceTop = rect.top;
  const spaceRight = vw - (rect.left + rect.width);
  const spaceLeft = rect.left;
  const max = Math.max(spaceBottom, spaceTop, spaceRight, spaceLeft);
  if (max === spaceBottom && spaceBottom >= 180) return "bottom";
  if (max === spaceTop && spaceTop >= 180) return "top";
  if (max === spaceRight && spaceRight >= TOOLTIP_W + TOOLTIP_GAP) return "right";
  if (max === spaceLeft && spaceLeft >= TOOLTIP_W + TOOLTIP_GAP) return "left";
  return "bottom";
}

function tooltipPosition(
  rect: Rect,
  placement: "top" | "bottom" | "left" | "right",
  vw: number
): { top: number; left: number } {
  if (placement === "bottom") {
    return {
      top: rect.top + rect.height + TOOLTIP_GAP,
      left: Math.max(
        16,
        Math.min(
          vw - TOOLTIP_W - 16,
          rect.left + rect.width / 2 - TOOLTIP_W / 2
        )
      ),
    };
  }
  if (placement === "top") {
    return {
      top: rect.top - TOOLTIP_GAP - 160,
      left: Math.max(
        16,
        Math.min(
          vw - TOOLTIP_W - 16,
          rect.left + rect.width / 2 - TOOLTIP_W / 2
        )
      ),
    };
  }
  if (placement === "right") {
    return {
      top: rect.top,
      left: rect.left + rect.width + TOOLTIP_GAP,
    };
  }
  // left
  return {
    top: rect.top,
    left: Math.max(16, rect.left - TOOLTIP_W - TOOLTIP_GAP),
  };
}

export function TourOverlay({ steps }: { steps: TourStep[] }) {
  const { step, totalSteps, setTotalSteps, nextStep, prevStep, finish } =
    useTour();

  // Hand the actual step count up to the provider so it knows when to
  // finish on the last "Next" click.
  useEffect(() => {
    setTotalSteps(steps.length);
  }, [steps.length, setTotalSteps]);

  const [rect, setRect] = useState<Rect | null>(null);
  const [viewport, setViewport] = useState<{ w: number; h: number }>({
    w: 1024,
    h: 768,
  });

  // Find target and measure. Re-measure on resize, scroll, and step change.
  useLayoutEffect(() => {
    if (step < 0 || step >= steps.length) {
      setRect(null);
      return;
    }
    const current = steps[step];
    const measure = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
      const el = document.querySelector(current.target) as HTMLElement | null;
      if (!el) {
        setRect(null);
        return;
      }
      // Scroll the target into view if it's offscreen, then re-measure.
      const r = el.getBoundingClientRect();
      const offscreen =
        r.top < 0 || r.bottom > window.innerHeight || r.left < 0 || r.right > window.innerWidth;
      if (offscreen) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // wait one frame after scroll for layout
        requestAnimationFrame(() => {
          const r2 = el.getBoundingClientRect();
          setRect({
            top: r2.top - PADDING,
            left: r2.left - PADDING,
            width: r2.width + PADDING * 2,
            height: r2.height + PADDING * 2,
          });
        });
        return;
      }
      setRect({
        top: r.top - PADDING,
        left: r.left - PADDING,
        width: r.width + PADDING * 2,
        height: r.height + PADDING * 2,
      });
    };
    measure();
    // Use a brief delay too, for async-loaded content (cards arriving from
    // wagmi reads, etc).
    const t = setTimeout(measure, 300);
    const onResize = () => measure();
    const onScroll = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [step, steps]);

  // Lock body scroll while tour is active so the spotlight stays put.
  useEffect(() => {
    if (step < 0) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [step]);

  if (step < 0 || step >= steps.length) return null;
  const current = steps[step];
  const isFirst = step === 0;
  const isLast = step === steps.length - 1;

  const placement =
    current.placement && current.placement !== "auto"
      ? current.placement
      : rect
      ? pickPlacement(rect, viewport.w, viewport.h)
      : "bottom";

  const tooltipPos = rect
    ? tooltipPosition(rect, placement, viewport.w)
    : { top: viewport.h / 2 - 100, left: viewport.w / 2 - TOOLTIP_W / 2 };

  // SVG mask gives a crisp cutout - the dim background is rendered by
  // a path with even-odd fill rule, so the target rect is fully exempt.
  return (
    <div className="fixed inset-0 z-[55] pointer-events-none">
      {/* Spotlight overlay using SVG mask. The full-screen rect is dimmed;
          the inner rect punches out, leaving the target crisp. */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-auto"
        onClick={() => {
          /* swallow clicks on the dimmed area */
        }}
      >
        <defs>
          <mask id="tour-cutout">
            <rect width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={rect.left}
                y={rect.top}
                width={rect.width}
                height={rect.height}
                rx="8"
                ry="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.72)"
          mask="url(#tour-cutout)"
        />
        {/* Animated outline around the target */}
        {rect && (
          <rect
            x={rect.left}
            y={rect.top}
            width={rect.width}
            height={rect.height}
            rx="8"
            ry="8"
            fill="none"
            stroke="#FF2D7A"
            strokeWidth="2"
            className="animate-pulse"
            style={{ pointerEvents: "none" }}
          />
        )}
      </svg>

      {/* Tooltip card. Always on top of the overlay, pointer events enabled. */}
      <div
        className="absolute pointer-events-auto"
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
          width: TOOLTIP_W,
        }}
      >
        <div className="rounded-xl border border-white/15 bg-[#0f0f12]/95 backdrop-blur-xl shadow-2xl">
          <div className="px-5 py-4 border-b border-white/10 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Step {step + 1} of {totalSteps}
              </p>
              <h3 className="mt-1 text-base font-semibold text-foreground">
                {current.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={finish}
              aria-label="Skip tour"
              className="shrink-0 rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {current.body}
            </p>
          </div>
          <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={prevStep}
              disabled={isFirst}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF2D7A] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#FF2D7A]/90 transition-colors"
            >
              {isLast ? "Finish" : "Next"}
              {!isLast && <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
