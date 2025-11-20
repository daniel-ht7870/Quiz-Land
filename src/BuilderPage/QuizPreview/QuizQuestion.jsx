import styles from './QuizPreview.module.css';

function QuizQuestion({ question=<p>placeholder question</p>, responses=[1, 2, 3, 4], qIndex, onClick }) {
    const responseList = responses.map(response => <li key={response}>{response}</li>);

    return(
        <div className={styles['quiz-question']} >
            {/* TODO */}
                <nav q-index={qIndex} onClick={onClick}>
                    Quiz Operations (TODO)
                </nav>
            {/* END TODO */}
            
            {question}
            <ul>
                {responseList}
            </ul>
        </div>
    );
}

export default QuizQuestion;