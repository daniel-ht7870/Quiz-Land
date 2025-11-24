import { addQuizQuestion, defaultQuestion, addQuizResult } from "../../DatabaseHandler";
import styles from "./QuestionOptions.module.css";

function QuestionOptions({ quiz, initializeQuiz, lastIndex }) {
    // questions = [];

    const handleAddQuestion = async () => {
        defaultQuestion.order = lastIndex;
        if (defaultQuestion.weights[0].length != quiz.results.length) {
            Object.keys(defaultQuestion.weights).forEach((key) => {
                defaultQuestion.weights[key] = [];
                for (let i = 0; i < quiz.results.length; i++) {
                    defaultQuestion.weights[key].push(1);
                }
            });
        }
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