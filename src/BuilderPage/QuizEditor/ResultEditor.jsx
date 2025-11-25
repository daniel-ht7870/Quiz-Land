import { useState, useEffect } from 'react';
import { updateQuiz, deleteQuizResult } from '../../DatabaseHandler';
import styles from './QuizEditor.module.css';

function ResultEditor({ quiz, result, initQuiz }) {
    const [title, setTitle] = useState(result.title);
    const [desc, setDesc] = useState(result.description);
    const [img, setImg] = useState(result.image);
    const [buttonState, setButtonState] = useState(false); // false = inactive button; true = active button

    // update the editor fields when the user select a different result element
    useEffect(() => {
        setTitle(result.title);
        setDesc(result.description);
        setImg(result.image);
    }, [result]);

    const handleTitleInput = (e) => {
        result.title = e.target.value;
        setTitle(e.target.value);
        setButtonState(true);
    }

    const handleDescInput = (e) => {
        result.description = e.target.value;
        setDesc(e.target.value);
        setButtonState(true);
    }

    const handleImgInput = (e) => {
        result.image = e.target.value;
        setImg(e.target.value);
        setButtonState(true);
    }

    const handleSubmitForm = async (e) => {
        setButtonState(false);
        quiz.results[result.rId] = result;
        await updateQuiz(quiz);
        await initQuiz();
    }

    const handleDeleteResult = async (e) => {
        await deleteQuizResult(quiz.qId, result);
        await initQuiz();
    }

    return(
        <form className={styles['quiz-editor']} action={handleSubmitForm}>
            <div className={styles['quiz-editor-result-title']}>
                <label htmlFor="title-input">Result Title</label>
                <input id="title-input" type="text" value={title} onChange={handleTitleInput}></input>
                {buttonState ? <button className={styles['quiz-editor-result-save-button-active']} type="submit">Save Changes</button> : 
                <button type="button">Save Changes</button>}
                <button className={styles['quiz-editor-result-delete-button']} onClick={handleDeleteResult} type="button">Delete Result</button>
            </div>
            <div className={styles['quiz-editor-result-description']}>
                <textarea placeholder="Result Description" value={desc} onChange={handleDescInput}></textarea>
            </div>
            <div className={styles['quiz-editor-result-image']}>
                <input id="image-input" type="text" placeholder="Image URL" value={img} onChange={handleImgInput}></input>
                <div className={styles['quiz-editor-result-image-container']}><img src={img} alt={'An image for ' + title}></img></div>
                {/* <img src={result.image}></img> */}
            </div>
        </form>
    );
}

export default ResultEditor;