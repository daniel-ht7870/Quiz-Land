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
    }

    const handleResultClick = (e) => {
        setState({
            ...state,
            activeResult: e.currentTarget.getAttribute('r-index')
        });
    }

    let qIndex = -1;
    const questionList = questions.map((question) => {
        qIndex++;
        return(
            <QuizQuestion key={question.qId} qIndex={qIndex} question={question.question} responses={question.responses} onClick={handleQuestionClick}/>
        );
    });

    qIndex = -1;
    const resultList = quiz.results.map((result) => {
        qIndex++;
        return(
            <QuizResult rIndex={qIndex} result={result} onClick={handleResultClick}/>
        );
    })

    return(
        <div className={styles['quiz-container']}>
            {questionList}
            {resultList}
        </div>
    );
}

export default QuizPreview;