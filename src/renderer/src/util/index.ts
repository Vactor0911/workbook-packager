/**
 * 2차원 배열을 CSV 파일로 저장
 * @param data 2차원 배열
 */
export const saveCsvFile = (path, data: string[][]): void => {
  // CSV 형식으로 변환
  const csvData = data.map((row) => Object.values(row).join(",")).join("\n");
  console.log(csvData); // 콘솔에 출력

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
    }
    else if (flag) {
      return false;
    }
  }
  return true;
};

export const questionTypes = ["記述", "選択", "完答", "完答O", "選択完答", "選択完答O", "解説"];
// 서술형, 선택형, 완성형, 완성형 (순서 상관 있음), 선택 완성형, 선택 완성형 (순서 상관 있음), 해설

/**
 * 문제 데이터 유효성 검사
 */
export const isQuestionValid = (question: string[]): boolean => {
  try {
    if (!questionTypes.includes(question[0])) {
      return false;
    }

    switch (question[0]) {
      case "記述": // 서술형
        if (question.length < 3) {
          return false;
        } else {
          return isArrayValid(question);
        }
        return true;
      case "選択": // 선택형
        if (question.length < 4) {
          return false;
        } else {
          return isArrayValid(question);
        }
        return true;
      case "完答":
      case "完答O": // 완성형
        if (question.length < 3) {
          return false;
        } else {
          return isArrayValid(question);
        }
        return true;
      case "選択完答":
      case "選択完答O": // 선택 완성형
        if (question.length < 4) {
          return false;
        } else if (question.length < 4 + Number(question[2]) + Number(question[3])) {
          return false;
        } else {
          return isArrayValid(question);
        }
        return true;
      case "解説": // 해설
        if (question.length < 2) {
          return false;
        } else {
          return isArrayValid(question);
        }
        return true;
      default:
        return false;
    }
  } catch (e) {
    return false;
  }
};
