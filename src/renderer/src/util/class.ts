export enum QuestionType {
  DESCRIPTION = "記述",
  CHOICE = "選択",
  COMPLETION = "完答",
  CHOICE_COMPLETION = "選択完答",
  COMPLETION_ORDER = "完答O",
  CHOICE_COMPLETION_ORDER = "選択完答O",
  COMMENT = "解説",
}
export enum QuestionTypeKor {
  DESCRIPTION = "서술형",
  CHOICE = "선택형",
  COMPLETION = "완성형",
  CHOICE_COMPLETION = "선택 완성형",
}

export class Question {
  type: string;
  title: string;
  answers: string[];
  wrongAnswers: string[];
  comment: string;
  hasOrder: boolean;

  constructor(
    type: string = "",
    title: string = "",
    answers: string[] = [],
    wrongAnswers: string[] = [],
    comment: string = "",
    hasOrder: boolean = false
  ) {
    this.type = type;
    this.title = title;
    this.answers = answers;
    this.wrongAnswers = wrongAnswers;
    this.comment = comment;
    this.hasOrder = hasOrder;
  }

  addWrongAnswer = (wrongAnswer: string): void => {
    this.wrongAnswers.push(wrongAnswer);
  };
}
