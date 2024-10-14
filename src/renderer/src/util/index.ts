import { Question, QuestionType } from "./class";

/**
 * 2차원 배열을 CSV 파일로 저장
 * @param data 2차원 배열
 */
export const saveCsvFile = (path, data: string[][]): boolean => {
  try {
    // CSV 형식으로 변환
    const csvData = data
      .map((row) => Object.values(row).join(",").replaceAll("\n", "<br>"))
      .join("\n");

    // 파일 저장 경로와 데이터 전달
    window.csvAPI.saveCsvFile(path, csvData);
    return true;
  } catch (error) {
    return false;
  }
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

/**
 * 문제 데이터를 CSV 형식으로 변환
 */
export const questionToCsv = (question: Question): string[][] => {
  const result: string[][] = [];

  switch (question.type) {
    case QuestionType.DESCRIPTION:
      result.push([question.type, question.title, question.answers[0]]);
      break;
    case QuestionType.CHOICE:
      result.push([question.type, question.title, question.answers[0], ...question.wrongAnswers]);
      break;
    case QuestionType.COMPLETION:
    case QuestionType.COMPLETION_ORDER:
      result.push([question.type, question.title, ...question.answers]);
      break;
    case QuestionType.CHOICE_COMPLETION:
    case QuestionType.CHOICE_COMPLETION_ORDER:
      result.push([
        question.type,
        question.title,
        question.answers.length.toString(),
        question.wrongAnswers.length.toString(),
        ...question.answers,
        ...question.wrongAnswers,
      ]);
      break;
  }

  if (question.comment) {
    result.push([QuestionType.COMMENT, question.comment]);
  }

  return result;
};
