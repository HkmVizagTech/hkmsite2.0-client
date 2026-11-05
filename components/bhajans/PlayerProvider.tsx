"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { postPlay, type QueueItem } from "@/lib/bhajans";
import MiniPlayer from "./MiniPlayer";
import ShortcutsDialog from "./player/ShortcutsDialog";
import { ToastHost, showToast } from "./toast";
import { pushHistory } from "./browse/history";
import {
  PlayerActionsContext,
  PlayerStateContext,
  PlayerTimeContext,
  type PlayerActions,
  type PlayerState,
  type RepeatMode,
} from "./playerContext";

export { usePlayer, usePlayerActions, usePlayerTime } from "./playerContext";

const PREFS_KEY = "bhajan-player-v1";

function isEditable(el: EventTarget | null): boolean {
  const t = el as HTMLElement | null;
  if (!t || !t.tagName) return false;
  return t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable;
}
/** Elements that handle arrow keys / space themselves. */
function ownsKeys(el: EventTarget | null): boolean {
  const t = el as HTMLElement | null;
  if (!t || !t.tagName) return false;
  const role = t.getAttribute("role");
  return isEditable(t) || role === "tab" || role === "slider" || role === "menuitem" || role === "listbox";
}
function activatesOnSpace(el: EventTarget | null): boolean {
  const t = el as HTMLElement | null;
  if (!t || !t.tagName) return false;
  return t.tagName === "BUTTON" || t.tagName === "A" || ownsKeys(t);
}

/**
 * Global audio engine for the Bhajans library. One <audio> element lives here (mounted in the
 * locale layout), so playback continues across route changes.
 */
export default function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [rate, setRateState] = useState(1);
  const [volume, setVolumeState] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [shuffle, setShuffleState] = useState(false);
  const [repeat, setRepeatState] = useState<RepeatMode>("off");
  const [queueOpen, setQueueOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [pos, setPos] = useState({ time: 0, duration: 0 });

  const queueRef = useRef<QueueItem[]>([]);
  const indexRef = useRef(0);
  const rateRef = useRef(1);
  const volumeRef = useRef(1);
  const lastVolRef = useRef(1);
  const shuffleRef = useRef(false);
  const repeatRef = useRef<RepeatMode>("off");
  const fadeRaf = useRef<number | null>(null);
  const playedRef = useRef<Set<string>>(new Set());
  const historyRef = useRef<number[]>([]);
  const errStreak = useRef(0);

  const current = queue[index] || null;

  const savePrefs = useCallback(() => {
    try {
      localStorage.setItem(
        PREFS_KEY,
        JSON.stringify({ volume: volumeRef.current || lastVolRef.current, rate: rateRef.current, shuffle: shuffleRef.current, repeat: repeatRef.current }),
      );
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Restore remembered volume, speed, shuffle and repeat.
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(PREFS_KEY) || "null");
      if (!p) return;
      const a = audioRef.current;
      if (typeof p.volume === "number" && p.volume >= 0 && p.volume <= 1) {
        volumeRef.current = p.volume;
        lastVolRef.current = p.volume || 1;
        setVolumeState(p.volume);
        if (a) a.volume = p.volume;
      }
      if (typeof p.rate === "number" && p.rate >= 0.5 && p.rate <= 2) {
        rateRef.current = p.rate;
        setRateState(p.rate);
        if (a) {
          a.defaultPlaybackRate = p.rate;
          a.playbackRate = p.rate;
        }
      }
      if (typeof p.shuffle === "boolean") {
        shuffleRef.current = p.shuffle;
        setShuffleState(p.shuffle);
      }
      if (p.repeat === "all" || p.repeat === "one") {
        repeatRef.current = p.repeat;
        setRepeatState(p.repeat);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const cancelFade = () => {
    if (fadeRaf.current !== null) cancelAnimationFrame(fadeRaf.current);
    fadeRaf.current = null;
  };
  /** Smoothly ramp the element volume (does not touch the remembered slider value). */
  const fadeTo = useCallback((to: number, ms: number, done?: () => void) => {
    const a = audioRef.current;
    cancelFade();
    if (!a) return;
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || ms <= 0) {
      a.volume = to;
      done?.();
      return;
    }
    const from = a.volume;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      a.volume = Math.min(1, Math.max(0, from + (to - from) * k));
      if (k < 1) fadeRaf.current = requestAnimationFrame(step);
      else {
        fadeRaf.current = null;
        done?.();
      }
    };
    fadeRaf.current = requestAnimationFrame(step);
  }, []);

  const startIndex = useCallback((q: QueueItem[], i: number) => {
    const a = audioRef.current;
    const item = q[i];
    if (!a || !item) return;
    queueRef.current = q;
    indexRef.current = i;
    playedRef.current.add(item.key);
    setQueue(q);
    setIndex(i);
    setPos({ time: 0, duration: item.duration || 0 });
    setBuffering(true);
    a.src = item.url;
    a.defaultPlaybackRate = rateRef.current;
    a.playbackRate = rateRef.current;
    postPlay(item.slug); // once per start
    pushHistory(item);
    a.play().catch(() => {
      // Autoplay-policy rejections land here; real load failures arrive through the "error" event.
      setPlaying(false);
      setBuffering(false);
    });
  }, []);

  const pickNext = useCallback((auto: boolean): number => {
    const q = queueRef.current;
    const cur = indexRef.current;
    if (!q.length) return -1;
    if (shuffleRef.current && q.length > 1) {
      const all = q.map((_, i) => i).filter((i) => i !== cur);
      let cand = all.filter((i) => !playedRef.current.has(q[i].key));
      if (!cand.length) {
        if (repeatRef.current === "all" || !auto) {
          playedRef.current = new Set([q[cur].key]);
          cand = all;
        } else return -1;
      }
      return cand[Math.floor(Math.random() * cand.length)];
    }
    if (cur + 1 < q.length) return cur + 1;
    if (repeatRef.current === "all") return 0;
    return -1;
  }, []);

  const advance = useCallback(
    (auto: boolean): boolean => {
      const i = pickNext(auto);
      if (i < 0) return false;
      historyRef.current.push(indexRef.current);
      startIndex(queueRef.current, i);
      return true;
    },
    [pickNext, startIndex],
  );

  const mutateQueue = (nq: QueueItem[], nextIndex: number) => {
    queueRef.current = nq;
    indexRef.current = nextIndex;
    historyRef.current = [];
    setQueue(nq);
    setIndex(nextIndex);
  };

  const actions = useMemo<PlayerActions>(
    () => ({
      play: (q, i = 0) => {
        if (!q.length) return;
        const cur = queueRef.current[indexRef.current];
        const a = audioRef.current;
        // Same track already loaded: just resume instead of counting a new start.
        if (a && cur && q[i]?.key === cur.key && a.src) {
          queueRef.current = q;
          setQueue(q);
          indexRef.current = i;
          setIndex(i);
          historyRef.current = [];
          void a.play().catch(() => {});
          return;
        }
        playedRef.current = new Set();
        historyRef.current = [];
        errStreak.current = 0;
        startIndex(q, i);
      },
      toggle: () => {
        const a = audioRef.current;
        if (!a || !queueRef.current.length) return;
        if (a.paused) void a.play().catch(() => {});
        else a.pause();
      },
      pause: () => audioRef.current?.pause(),
      seek: (s) => {
        const a = audioRef.current;
        if (!a || !isFinite(s)) return;
        const max = isFinite(a.duration) && a.duration > 0 ? a.duration : Infinity;
        a.currentTime = Math.min(max, Math.max(0, s));
        setPos((p) => ({ ...p, time: a.currentTime }));
      },
      next: () => {
        advance(false);
      },
      prev: () => {
        const a = audioRef.current;
        if (a && a.currentTime > 3) {
          a.currentTime = 0;
          return;
        }
        if (shuffleRef.current && historyRef.current.length) {
          const i = historyRef.current.pop() as number;
          if (queueRef.current[i]) {
            startIndex(queueRef.current, i);
            return;
          }
        }
        const i = indexRef.current - 1;
        if (i >= 0) startIndex(queueRef.current, i);
        else if (a) a.currentTime = 0;
      },
      setRate: (r) => {
        rateRef.current = r;
        setRateState(r);
        const a = audioRef.current;
        if (a) {
          a.defaultPlaybackRate = r;
          a.playbackRate = r;
        }
        savePrefs();
      },
      setVolume: (v) => {
        const x = Math.min(1, Math.max(0, v));
        cancelFade();
        volumeRef.current = x;
        if (x > 0) lastVolRef.current = x;
        setVolumeState(x);
        if (audioRef.current) audioRef.current.volume = x;
        savePrefs();
      },
      toggleMute: () => {
        if (volumeRef.current > 0) {
          lastVolRef.current = volumeRef.current;
          volumeRef.current = 0;
          setVolumeState(0);
          fadeTo(0, 180);
        } else {
          const t = lastVolRef.current || 1;
          volumeRef.current = t;
          setVolumeState(t);
          fadeTo(t, 180);
        }
        savePrefs();
      },
      setExpanded,
      enqueue: (items) => {
        if (!items.length) return;
        if (!queueRef.current.length) {
          playedRef.current = new Set();
          startIndex(items, 0);
          return;
        }
        const have = new Set(queueRef.current.map((t) => t.key));
        const add = items.filter((t) => !have.has(t.key));
        if (!add.length) return;
        mutateQueue([...queueRef.current, ...add], indexRef.current);
      },
      playNext: (items) => {
        if (!items.length) return;
        if (!queueRef.current.length) {
          playedRef.current = new Set();
          startIndex(items, 0);
          return;
        }
        const cur = queueRef.current[indexRef.current];
        const keys = new Set(items.map((t) => t.key));
        const base = queueRef.current.filter((t) => t.key === cur.key || !keys.has(t.key));
        const at = base.findIndex((t) => t.key === cur.key);
        const ins = items.filter((t) => t.key !== cur.key);
        mutateQueue([...base.slice(0, at + 1), ...ins, ...base.slice(at + 1)], at);
      },
      removeAt: (i) => {
        const q = queueRef.current;
        if (i < 0 || i >= q.length || i === indexRef.current) return;
        mutateQueue(q.filter((_, k) => k !== i), i < indexRef.current ? indexRef.current - 1 : indexRef.current);
      },
      moveBy: (i, dir) => {
        const q = queueRef.current;
        const j = i + dir;
        if (i < 0 || j < 0 || i >= q.length || j >= q.length) return;
        const nq = [...q];
        [nq[i], nq[j]] = [nq[j], nq[i]];
        const cur = indexRef.current;
        mutateQueue(nq, i === cur ? j : j === cur ? i : cur);
      },
      clearUpcoming: () => {
        const cur = indexRef.current;
        if (queueRef.current.length <= cur + 1) return;
        mutateQueue(queueRef.current.slice(0, cur + 1), cur);
      },
      setShuffle: (v) => {
        shuffleRef.current = v;
        setShuffleState(v);
        playedRef.current = new Set(queueRef.current[indexRef.current] ? [queueRef.current[indexRef.current].key] : []);
        historyRef.current = [];
        savePrefs();
      },
      cycleRepeat: () => {
        const n: RepeatMode = repeatRef.current === "off" ? "all" : repeatRef.current === "all" ? "one" : "off";
        repeatRef.current = n;
        setRepeatState(n);
        savePrefs();
      },
      setQueueOpen,
      setHelpOpen,
      close: () => {
        const a = audioRef.current;
        cancelFade();
        if (a) {
          a.pause();
          a.removeAttribute("src");
          a.load();
          a.volume = volumeRef.current;
        }
        queueRef.current = [];
        indexRef.current = 0;
        historyRef.current = [];
        playedRef.current = new Set();
        setQueue([]);
        setIndex(0);
        setPlaying(false);
        setBuffering(false);
        setExpanded(false);
        setQueueOpen(false);
        setPos({ time: 0, duration: 0 });
      },
    }),
    [startIndex, advance, fadeTo, savePrefs],
  );

  // Audio element events.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onPlay = () => setPlaying(true);
    const onPlaying = () => {
      errStreak.current = 0;
      setPlaying(true);
      setBuffering(false);
    };
    const onPause = () => setPlaying(false);
    const onWaiting = () => setBuffering(true);
    const onReady = () => setBuffering(false);
    const onTime = () => {
      setPos({ time: a.currentTime, duration: isFinite(a.duration) ? a.duration : 0 });
      const ms = typeof navigator !== "undefined" ? navigator.mediaSession : undefined;
      if (ms && "setPositionState" in ms && isFinite(a.duration) && a.duration > 0) {
        try {
          ms.setPositionState({ duration: a.duration, position: Math.min(a.currentTime, a.duration), playbackRate: a.playbackRate });
        } catch {
          /* ignore */
        }
      }
    };
    const onEnded = () => {
      if (repeatRef.current === "one") {
        a.currentTime = 0;
        void a.play().catch(() => {});
        return;
      }
      if (!advance(true)) {
        setPlaying(false);
        a.currentTime = 0;
      }
    };
    const onError = () => {
      if (!a.getAttribute("src")) return; // cleared on purpose
      setBuffering(false);
      setPlaying(false);
      const item = queueRef.current[indexRef.current];
      errStreak.current += 1;
      const canSkip = errStreak.current < queueRef.current.length && pickNext(true) >= 0;
      showToast(`Couldn’t play “${item?.title || "this track"}”.${canSkip ? " Skipping to the next one." : ""}`, "error");
      if (canSkip) advance(true);
    };
    const evts: [string, () => void][] = [
      ["play", onPlay],
      ["playing", onPlaying],
      ["pause", onPause],
      ["waiting", onWaiting],
      ["stalled", onWaiting],
      ["loadstart", onWaiting],
      ["canplay", onReady],
      ["timeupdate", onTime],
      ["durationchange", onTime],
      ["loadedmetadata", onTime],
      ["ended", onEnded],
      ["error", onError],
    ];
    evts.forEach(([n, f]) => a.addEventListener(n, f));
    return () => evts.forEach(([n, f]) => a.removeEventListener(n, f));
  }, [advance, pickNext]);

  // Media Session (lock screen / headset / browser media keys).
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    if (!current) {
      ms.metadata = null;
      return;
    }
    try {
      ms.metadata = new MediaMetadata({
        title: current.title,
        artist: current.singer || current.artist,
        album: "Vaishnava Bhajans · Hare Krishna Movement Vizag",
        artwork: current.coverImage ? [{ src: current.coverImage }] : [],
      });
    } catch {
      /* ignore */
    }
  }, [current]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    ms.playbackState = current ? (playing ? "playing" : "paused") : "none";
  }, [playing, current]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    const set = (name: MediaSessionAction, fn: MediaSessionActionHandler | null) => {
      try {
        ms.setActionHandler(name, fn);
      } catch {
        /* unsupported action */
      }
    };
    set("play", () => void audioRef.current?.play().catch(() => {}));
    set("pause", () => audioRef.current?.pause());
    set("previoustrack", () => actions.prev());
    set("nexttrack", () => actions.next());
    set("seekto", (d) => {
      if (typeof d.seekTime === "number") actions.seek(d.seekTime);
    });
    set("seekbackward", (d) => actions.seek((audioRef.current?.currentTime || 0) - (d.seekOffset || 10)));
    set("seekforward", (d) => actions.seek((audioRef.current?.currentTime || 0) + (d.seekOffset || 10)));
    return () => {
      (["play", "pause", "previoustrack", "nexttrack", "seekto", "seekbackward", "seekforward"] as MediaSessionAction[]).forEach((n) => set(n, null));
    };
  }, [actions]);

  // Keyboard shortcuts. Ignored while typing, with modifier keys, or when a focused control owns the key.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
      if (e.key === "?") {
        if (isEditable(e.target)) return;
        e.preventDefault();
        setHelpOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        setHelpOpen(false);
        return;
      }
      if (!queueRef.current.length) return;
      const a = audioRef.current;
      const t = e.target;
      if (e.key === " " || e.code === "Space") {
        if (activatesOnSpace(t)) return;
        e.preventDefault();
        actions.toggle();
        return;
      }
      if (e.shiftKey || ownsKeys(t)) return;
      const k = e.key.toLowerCase();
      const cur = a?.currentTime || 0;
      switch (k) {
        case "j":
          actions.seek(cur - 10);
          break;
        case "l":
          actions.seek(cur + 10);
          break;
        case "arrowleft":
          actions.seek(cur - 5);
          break;
        case "arrowright":
          actions.seek(cur + 5);
          break;
        case "n":
          actions.next();
          break;
        case "p":
          actions.prev();
          break;
        case "m":
          actions.toggleMute();
          break;
        case "s":
          actions.setShuffle(!shuffleRef.current);
          showToast(shuffleRef.current ? "Shuffle on" : "Shuffle off");
          break;
        case "r":
          actions.cycleRepeat();
          showToast(`Repeat ${repeatRef.current === "off" ? "off" : repeatRef.current === "all" ? "all" : "one"}`);
          break;
        case "q":
          setQueueOpen((v) => !v);
          break;
        default:
          return;
      }
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [actions]);

  useEffect(() => () => cancelFade(), []);

  const hasNext = index < queue.length - 1 || (repeat === "all" && queue.length > 0) || (shuffle && queue.length > 1);
  const state = useMemo<PlayerState>(
    () => ({ queue, index, current, playing, buffering, rate, volume, expanded, shuffle, repeat, hasNext, queueOpen, helpOpen }),
    [queue, index, current, playing, buffering, rate, volume, expanded, shuffle, repeat, hasNext, queueOpen, helpOpen],
  );

  return (
    <PlayerActionsContext.Provider value={actions}>
      <PlayerStateContext.Provider value={state}>
        <PlayerTimeContext.Provider value={pos}>
          {children}
          <audio ref={audioRef} preload="none" />
          <MiniPlayer />
          {helpOpen && <ShortcutsDialog onClose={() => setHelpOpen(false)} />}
          <ToastHost />
        </PlayerTimeContext.Provider>
      </PlayerStateContext.Provider>
    </PlayerActionsContext.Provider>
  );
}
