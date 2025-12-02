import { useState } from "react";
import styles from './QuizPage.module.css';

function QuizQuestions({ quiz, questions, setResult }) {
    let rId = -2;
    const questionMap = questions.map((question) => {
        rId++;
        const responseMap = question.responses.map((response, index) => {
            rId++;
            return(
                <div className={styles['quiz-page-question-response']}>
                    <input type="radio" id={rId} name={question.qId} value={question.weights[index]} required></input>
                    <label htmlFor={rId}>{response}</label>
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
            weights = e.get(question.qId).split(',').map(Number).map((n, i) => n + weights[i]);
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