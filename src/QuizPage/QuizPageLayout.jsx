import { useState, useEffect } from 'react';
import { getQuiz, getQuizQuestions } from '../DatabaseHandler.jsx';
import { Pages } from '../App.jsx';
import styles from './QuizPage.module.css';
import QuizQuestions from './QuizQuestions.jsx';

function QuizPageLayout({ setPage, quizId }) {
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [result, setResult] = useState(null);

    useEffect(() => {
        initializeQuiz();
    }, []);

    async function initializeQuiz() {
        const q = await getQuiz(quizId);
        const qq = await getQuizQuestions(quizId);
        setQuiz(q);
        setQuestions(qq);
    }

    if (quiz == null) {
        return(
            <p>Loading...</p>
        );
    }

    if (result != null) {
        return(
            <div className={styles['quiz-page-body']}>
                <div className={styles['quiz-page-header']} onClick={() => setPage(Pages.MAIN)}>
                    <h1>Quizland</h1>
                </div>
                <div className={styles['quiz-page-result']}>
                    <h3>{quiz.results[result].title}</h3>
                    <p>{quiz.results[result].description}</p> {/* THIS IS A MOMENT IN HISTORY */}
                    <div className={styles['quiz-page-result-img-container']}>
                        <img src={quiz.results[result].image}></img>
                    </div>
                </div>
                <button className={styles['quiz-page-result-return-buttton']} onClick={() => setResult(null)}>Return</button>
            </div>
        );
    }

    return(
        <div className={styles['quiz-page-body']}>
            <div className={styles['quiz-page-header']} onClick={() => setPage(Pages.MAIN)}>
                <h1>Quizland</h1>
            </div>
            <QuizQuestions quiz={quiz} questions={questions} setResult={setResult}/>
        </div>
    );
}

export default QuizPageLayout;