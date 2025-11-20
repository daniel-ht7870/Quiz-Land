import styles from './QuizPreview.module.css';
import QuizQuestion from './QuizQuestion.jsx';
import QuizResult from './QuizResult.jsx';

function QuizPreview({ quiz, questions, state, setState }) {
    let qIndex = -1;
    const questionList = questions.map((question) => {
        qIndex++;
        return(
            <QuizQuestion key={question.qId} qIndex={qIndex} question={question.question} responses={question.responses} onClick={(e) => setState({...state, activeQuestion: e.target.getAttribute('q-index'), activeResult: null})}/>
        );
    });

    qIndex = -1;
    const resultList = quiz.results.map((result) => {
        qIndex++;
        return(
            <QuizResult rIndex={qIndex} result={result} onClick={(e) => setState({...state, activeResult: e.target.getAttribute('r-index')})}/>
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