import { Question } from "@renderer/util/class";
import { atom } from "jotai";

// CSV 데이터
export const filePathAtom = atom<string>("");
export const workbookTitleAtom = atom<string>("NewWorkbook");
export const questionsAtom = atom<Question[]>([]);

// 오류 대화상자
export const enum AlertType {
  NONE,
  OPEN_FAILED,
  SAVE_CONFIRM,
  SAVE_SUCCESS,
  SAVE_FAILED,
  RETURN_CONFIRM,
  QUESTION_INVALID,
}

export const alertAtom = atom<AlertType>(AlertType.NONE);
