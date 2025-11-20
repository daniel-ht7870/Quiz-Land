import { useState, useEffect } from 'react';
import { getQuiz, getQuizQuestions, QuizQuestion } from '../DatabaseHandler.jsx';
import { Pages } from '../App.jsx';
import styles from './BuilderPageLayout.module.css';
import QuestionOptions from './QuestionOptions/QuestionOptions.jsx';
import QuizPreview from './QuizPreview/QuizPreview.jsx';
import QuizEditor from './QuizEditor/QuizEditor.jsx';

function BuilderPageLayout({ setPage, quizId, header=<p>Quizland</p> }) {
    const [state, setState] = useState({
        quiz: null,
        questions: null,
        activeQuestion: 0,
        activeResult: null
    });

    useEffect(() => {
        initializeQuiz();
    }, []);

    async function initializeQuiz() {
        const q = await getQuiz(quizId);
        const qq = await getQuizQuestions(quizId);
        setState({
            ...state,
            quiz: q,
            questions: qq,
            activeQuestion: 0
        });
    }

    if (!state.quiz || !state.questions) {
        return(
            <h1>Loading...</h1>
        );
    }
    
    return(
        <div className={styles["builder-page-layout"]}>
            <div className={styles["page-element"]} id={styles["header"]} onClick={() => setPage(Pages.MAIN)}>
                {header}
            </div>
            <div className={styles["page-element"]} id={styles["sidebar"]}>
                <h3>Question Options</h3>
                <QuestionOptions quiz={state.quiz} initializeQuiz={initializeQuiz} lastIndex={state.questions[state.questions.length - 1].order + 1}/>
            </div>
            <div className={styles["page-element"]} id={styles["content"]}>
                <h3>Quiz Preview</h3>
                <QuizPreview quiz={state.quiz} questions={state.questions} state={state} setState={setState}/>
            </div>
            <div className={styles["page-element"]} id={styles["editor"]}>
                <h3>Editor</h3>
                <QuizEditor quiz={state.quiz} question={state.questions[state.activeQuestion]} result={state.activeResult ? state.quiz.results[state.activeResult] : null} resultId={state.activeResult} initializeQuiz={initializeQuiz}/>
            </div>
        </div>
    );
}

export default BuilderPageLayout;