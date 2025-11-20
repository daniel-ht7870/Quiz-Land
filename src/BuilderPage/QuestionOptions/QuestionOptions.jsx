import { addQuizQuestion, defaultQuestion, addQuizResult } from "../../DatabaseHandler";
import styles from "./QuestionOptions.module.css";

function QuestionOptions({ quiz, initializeQuiz, lastIndex }) {
    // questions = [];

    const handleAddQuestion = async () => {
        defaultQuestion.order = lastIndex;
        await addQuizQuestion(quiz.qId, defaultQuestion);
        initializeQuiz();
    }

    const handleAddResult = async () => {
        await addQuizResult(quiz.qId);
        initializeQuiz();
    }

    return (
        <ul id={styles["question-options"]}>
            <li><button onClick={handleAddQuestion}>Multiple Choice</button></li>
            <li><button onClick={handleAddResult}>Result</button></li>
        </ul>
    );
}

export default QuestionOptions;