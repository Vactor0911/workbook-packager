/**
 * 2차원 배열을 CSV 파일로 저장
 * @param data 2차원 배열
 */
export const saveCSVFile = (path, data): void => {
  // CSV 형식으로 변환
  const csvData = data.map((row) => Object.values(row).join(",")).join("\n");
  console.log(csvData); // 콘솔에 출력

  // 파일 저장 경로와 데이터 전달
  window.csvAPI.saveFile(path, csvData);
};
