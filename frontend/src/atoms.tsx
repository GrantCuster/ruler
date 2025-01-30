import { atom } from "jotai";
import { EntryType, ThemeType } from "./types";
import { standardThemes } from "./shared/consts";

export const currentSecondsAtom = atom<number>(0);
export const dateNowAtom = atom<Date>(new Date());
export const timezoneOffsetAtom = atom(new Date().getTimezoneOffset() * 60);

export const focusModeAtom = atom(true);

export const entriesAtom = atom<EntryType[]>([]);

const standardThemeMap: Record<string, ThemeType> = {};
for (const theme of standardThemes) {
  standardThemeMap[theme.url] = theme;
}
export const themeMapAtom = atom<Record<string, ThemeType>>(standardThemeMap);
export const themeIdsAtom = atom<string[]>(
  standardThemes.map((theme) => theme.url),
);

export const selectedThemeAtom = atom<ThemeType>(standardThemes[0]);

export const iframeLoadedAtom = atom(false);

export const galleryPerPageAtom = atom(4);
export const galleryCursorAtom = atom(0);

export const addedTaskAtom = atom<EntryType | null>(null);
