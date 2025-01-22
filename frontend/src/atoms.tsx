import { atom } from "jotai";
import { EntryType, ThemeType } from "./types";
import { standardThemes } from "./shared/consts";

export const currentSecondsAtom = atom<number>(0);
export const dateNowAtom = atom<Date>(new Date());
export const timezoneOffsetAtom = atom(new Date().getTimezoneOffset() * 60);

export const showCalendarAtom = atom(false);

export const showPaletteAtom = atom(false);

export const focusModeAtom = atom(true);

export const entriesAtom = atom<EntryType[]>([]);
export const showFormAtom = atom(false);

export const themesAtom = atom<ThemeType[]>(standardThemes);
export const selectedThemeAtom = atom<ThemeType>(standardThemes[0]);

export const iframeLoadedAtom = atom(false);

export const showToolbarAtom = atom(true);
