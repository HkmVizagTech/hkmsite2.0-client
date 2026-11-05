"use client";

import { createContext, useContext } from "react";
import type { QueueItem } from "@/lib/bhajans";

export interface PlayerState {
  queue: QueueItem[];
  index: number;
  current: QueueItem | null;
  playing: boolean;
  buffering: boolean;
  rate: number;
  volume: number;
  expanded: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  /** True when "next" would do something (more tracks, repeat all or shuffle). */
  hasNext: boolean;
  queueOpen: boolean;
  helpOpen: boolean;
}

export type RepeatMode = "off" | "all" | "one";

export interface PlayerActions {
  /** Replace the queue and start at `index`. */
  play: (queue: QueueItem[], index?: number) => void;
  toggle: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
  next: () => void;
  prev: () => void;
  setRate: (r: number) => void;
  setVolume: (v: number) => void;
  setExpanded: (v: boolean) => void;
  close: () => void;
  /** Append items to the queue (starts playback when nothing is queued). */
  enqueue: (items: QueueItem[]) => void;
  /** Insert items right after the current track (starts playback when nothing is queued). */
  playNext: (items: QueueItem[]) => void;
  removeAt: (i: number) => void;
  /** Move a queue entry by `dir` positions (-1 up, +1 down). */
  moveBy: (i: number, dir: -1 | 1) => void;
  /** Remove everything after the current track. */
  clearUpcoming: () => void;
  setShuffle: (v: boolean) => void;
  cycleRepeat: () => void;
  toggleMute: () => void;
  setQueueOpen: (v: boolean) => void;
  setHelpOpen: (v: boolean) => void;
}

export const SPEEDS = [0.75, 1, 1.25, 1.5];

const noop = () => {};
export const defaultState: PlayerState = {
  queue: [],
  index: 0,
  current: null,
  playing: false,
  buffering: false,
  rate: 1,
  volume: 1,
  expanded: false,
  shuffle: false,
  repeat: "off",
  hasNext: false,
  queueOpen: false,
  helpOpen: false,
};

export const PlayerStateContext = createContext<PlayerState>(defaultState);
export const PlayerActionsContext = createContext<PlayerActions>({
  play: noop,
  toggle: noop,
  pause: noop,
  seek: noop,
  next: noop,
  prev: noop,
  setRate: noop,
  setVolume: noop,
  setExpanded: noop,
  close: noop,
  enqueue: noop,
  playNext: noop,
  removeAt: noop,
  moveBy: noop,
  clearUpcoming: noop,
  setShuffle: noop,
  cycleRepeat: noop,
  toggleMute: noop,
  setQueueOpen: noop,
  setHelpOpen: noop,
});
/** Playback position changes several times a second, so it lives in its own context. */
export const PlayerTimeContext = createContext<{ time: number; duration: number }>({ time: 0, duration: 0 });

export const usePlayer = () => useContext(PlayerStateContext);
export const usePlayerActions = () => useContext(PlayerActionsContext);
export const usePlayerTime = () => useContext(PlayerTimeContext);
