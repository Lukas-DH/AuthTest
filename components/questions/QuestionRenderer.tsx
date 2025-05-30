import TextQuestion from "./TextQuestion";
import NumberQuestion from "./NumberQuestion";
import BooleanQuestion from "./BooleanQuestion";
import ChoiceQuestion from "./ChoiceQuestion";
import SelectQuestion from "./SelectQuestion";
import FollowUpQuestion from "./FollowUpQuestion";

type QuestionType = "text" | "number" | "boolean" | "choice" | "list";

interface Question {
  id: string;
  type: QuestionType;
  [key: string]: any;
}
interface Props {
  question: Question;
  answer: any;
  onChange: (questionId: string, value: any) => void; // <--- FIXED
  answers: Record<string, string>;
}

export default function QuestionRenderer({
  question,
  answer,
  onChange,
  answers = {},
}: Props) {
  const renderMain = () => {
    switch (question.type) {
      case "text":
        return (
          <TextQuestion
            question={question}
            answer={answer}
            onChange={onChange}
          />
        );
      case "number":
        return (
          <NumberQuestion
            question={question}
            answer={answer}
            onChange={onChange}
          />
        );
      case "boolean":
        return (
          <BooleanQuestion
            question={question}
            answer={answer}
            onChange={onChange}
          />
        );
      case "choice":
        return (
          <ChoiceQuestion
            question={question}
            answer={answer}
            onChange={onChange}
          />
        );
      case "list":
        return (
          <SelectQuestion
            question={question}
            answer={answer}
            onChange={onChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderMain()}
      {question.followUp && answer === "yes" && (
        <FollowUpQuestion
          questions={question.followUp}
          answers={answers}
          onChange={onChange}
        />
      )}
    </>
  );
}
