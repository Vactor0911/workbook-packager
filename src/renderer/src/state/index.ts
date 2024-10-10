import { atom } from "jotai"

// CSV 데이터
export const filePathAtom = atom<string>("")
export const csvDataAtom = atom<string[][]>([[]])
