import { atom } from "jotai";
import { Entry } from "./types";

export const entriesAtom = atom<Entry[]>([]);
