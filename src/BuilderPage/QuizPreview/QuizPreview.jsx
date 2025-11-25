import { useState, useEffect } from 'react';
import styles from './QuizPreview.module.css';
import QuizQuestion from './QuizQuestion.jsx';
import QuizResult from './QuizResult.jsx';

function QuizPreview({ quiz, questions, state, setState }) {
    const handleQuestionClick = (e) => {
        setState({
            ...state,
            activeQuestion: e.currentTarget.getAttribute('q-index'),
            activeResult: null
        });
        setQuestionList(mapQuestions());
    }

    const handleResultClick = (e) => {
        setState({
            ...state,
            activeResult: e.currentTarget.getAttribute('r-index')
        });
        setResultList(mapResults());
    }

    const mapQuestions = () => questions.map((question, i) => {
        return(
            <QuizQuestion key={question.qId} qIndex={i} question={question.question} responses={question.responses} onClick={handleQuestionClick}/>
        );
    });

    const mapResults = () => quiz.results.map((result, i) => {
        return(
            <QuizResult rIndex={i} result={result} onClick={handleResultClick}/>
        );
    })

    const [questionList, setQuestionList] = useState(mapQuestions());
    const [resultList, setResultList] = useState(mapResults());

    useEffect(() => {
        setQuestionList(mapQuestions());
        setResultList(mapResults());
    }, [questions]);

    return(
        <div className={styles['quiz-container']}>
            {questionList}
            {resultList}
        </div>
    );
}

export default QuizPreview;