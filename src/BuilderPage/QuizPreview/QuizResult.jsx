import styles from './QuizPreview.module.css';
import { Result } from '../../DatabaseHandler.jsx';

function QuizResult({ rIndex, result, onClick }) {

    return(
        <div className={styles['quiz-result']} >
            {/* TODO */}
                <nav r-index={rIndex} onClick={onClick}>
                    {result.title}
                </nav>
            {/* END TODO */}
            
            <p>{result.description}</p>
            <div className={styles['quiz-result-img-container']}>
                <img src={result.image}></img>
            </div>
        </div>
    );
}

export default QuizResult;