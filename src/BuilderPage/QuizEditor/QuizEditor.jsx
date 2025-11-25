
import ResultEditor from './ResultEditor';
import QuestionEditor from './QuestionEditor';

function QuizEditor({ quiz, question, result, resultId, initializeQuiz }) {
    if (result) {
        return(
            <ResultEditor quiz={quiz} result={result} rId={resultId} initQuiz={initializeQuiz}/>
        );
    } else {
        return(
            <QuestionEditor quiz={quiz} question={question} initQuiz={initializeQuiz}/>
        );
    }
}

export default QuizEditor;