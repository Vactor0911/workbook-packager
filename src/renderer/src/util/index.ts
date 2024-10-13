import { Question, QuestionType } from "./class";

/**
 * 2차원 배열을 CSV 파일로 저장
 * @param data 2차원 배열
 */
export const saveCsvFile = (path, data: string[][]): void => {
  // CSV 형식으로 변환
  const csvData = data.map((row) => Object.values(row).join(",")).join("\n");

  // 파일 저장 경로와 데이터 전달
  window.csvAPI.saveCsvFile(path, csvData);
};

// 배열 유효성 검사
const isArrayValid = (arr: string[]): boolean => {
  let flag = false;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].trim() === "") {
      if (!flag) {
        flag = true;
      }
    } else if (flag) {
      return false;
    }
  }
  return true;
};

/**
 * 문제 데이터 유효성 검사
 */
export const isQuestionValid = (question: Question): boolean => {
  try {
    if (!Object.values(QuestionType).includes(question.type as QuestionType)) {
      return false;
    }

    // TODO: 문제 데이터 유효성 검사

    return true;
  } catch (e) {
    return false;
  }
};
