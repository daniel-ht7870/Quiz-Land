import { useState } from "react";
import styles from './QuizPage.module.css';

function QuizQuestions({ quiz, questions, setResult }) {
    const questionMap = questions.map((question) => {
        const responseMap = question.responses.map((response, index) => {
            return(
                <div className={styles['quiz-page-question-response']}>
                    <input type="radio" id={response} name={question.question} value={question.weights[index]} required></input>
                    <label htmlFor={response}>{response}</label>
                </div>
            );
        });
        return(
            <div key={question.qId} className={styles['quiz-page-question']}>
                <p>{question.question}</p>
                {responseMap}
            </div>
        );
    });

    const handleSubmit = (e) => {
        let weights = new Array(quiz.results.length).fill(0);
        questions.forEach((question) => {
            weights = e.get(question.question).split(',').map(Number).map((n, i) => n + weights[i]);
        });
        let result = 0;
        for (let i = 0; i < weights.length; i++) {
            if (weights[i] > weights[result]) {
                result = i;
            }
        }
        setResult(result);
    }

    return(
        <form className={styles['quiz-page-questiton-list']} action={handleSubmit}>
            {questionMap}
            <button className={styles['quiz-page-submit-button']}>Get Result</button>
        </form>
    );
}

export default QuizQuestions;