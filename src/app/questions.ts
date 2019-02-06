export class QuestionP1 {
  num: number;
  audioFile: string;
  correct: number;
  marks: number;
}
export class QuestionP2 {
  num: number;
  audioFile: string;
  statements: string[];
  statementAnswers: string[][];
  correct: number[];
  marks: number[];
}
export class QuestionP3 {
  num: number;
  audioFile: string;
  text: string;
  options: string[];
  correct: number;
  marks: number;
}
export class QuestionP4 {
  num: number;
  text: string;
  audioFile: string;
  options: string[][];
  correct: number[];
  marks: number[];
  title: string;
}
