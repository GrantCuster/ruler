import { atom } from "jotai";
import { EntryType } from "./types";

export const currentSecondsAtom = atom<number>(0);
export const dateNowAtom = atom<Date>(new Date());
export const timezoneOffsetAtom = atom(new Date().getTimezoneOffset() * 60);

export const focusModeAtom = atom(true);

export const entriesAtom = atom<EntryType[]>([]);
export const showFormAtom = atom(false);
