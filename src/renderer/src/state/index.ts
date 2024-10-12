import { Question } from "@renderer/util/class";
import { atom } from "jotai";

// CSV 데이터
export const filePathAtom = atom<string>("");
export const workbookTitleAtom = atom<string>("");
export const questionsAtom = atom<Question[]>([]);
export const csvDataAtom = atom<string[][]>([]);
