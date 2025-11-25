import styles from './QuizPreview.module.css';

function QuizQuestion({ question=<p>placeholder question</p>, responses=[1, 2, 3, 4], qIndex, onClick }) {
    const responseList = responses.map(response => <li key={response}>{response}</li>);

    return(
        <div className={styles['quiz-question']} q-index={qIndex} onClick={onClick}>
            {/* TODO */}
                <nav>
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