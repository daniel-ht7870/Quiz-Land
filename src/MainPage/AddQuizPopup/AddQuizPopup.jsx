import { useState } from "react";
import styles from './AddQuizPopup.module.css';
import { Pages } from '../../App.jsx';
import { Quiz, addQuiz } from '../../DatabaseHandler.jsx';

function AddQuizPopup({ setAddingQuiz, setPage, setCurrentQuizId }) {
    const [qName, setQName] = useState('');
    const [qAuthor, setQAuthor] = useState('');
    const [qDesc, setQDesc] = useState('');
    const [imgUrl, setImgUrl] = useState('');

    const handleQNameInput = (e) => {
        setQName(e.target.value);
    }

    const handleQAuthorInput = (e) => {
        setQAuthor(e.target.value);
    }

    const handleQDescInput = (e) => {
        setQDesc(e.target.value);
    }

    const handleImgUrlInput = (e) => {
        setImgUrl(e.target.value);
    }

    const handleAddQuiz = async (e) => {
        let imgUrlToSubmit = imgUrl;
        if (!imgUrlToSubmit) {
            imgUrlToSubmit = 'https://placehold.co/800x800?text=No+Image';
        }
        const quizToAdd = new Quiz(
            null, // null id only acceptable when adding to database
            qAuthor,
            qDesc,
            imgUrlToSubmit,
            qName,
            []
        );
        const qId = await addQuiz(quizToAdd);
        setCurrentQuizId(qId);
        setPage(Pages.BUILD);
    }

    return(
        <div className={styles['add-quiz-popup']}>
            <form className={styles['add-quiz-popup-window']} action={handleAddQuiz}>
                <h3>Create a Quiz</h3>
                <label htmlFor="qName"><span>*</span> Quiz Name</label>
                <input key="0" type="text" id="qName" value={qName} onChange={handleQNameInput} required></input>
                <label htmlFor="qAuthor"><span>*</span> Quiz Author</label>
                <input key="1" type="text" id="qAuthor" value={qAuthor} onChange={handleQAuthorInput} required></input>
                <label htmlFor="qDesc"><span>*</span> Quiz Description</label>
                <textarea key="2" id="qDesc" value={qDesc} onChange={handleQDescInput} required></textarea>
                <label htmlFor="qImg">Image URL</label>
                <input key="3" type="text" id="qImg" value={imgUrl} onChange={handleImgUrlInput}></input>
                <div className={styles['add-quiz-popup-window-actions']}>
                    <button className={styles['cancel']} onClick={() => setAddingQuiz(false)}>Cancel</button>
                    <button className={styles['confirm']} type="submit">Create Quiz</button>
                </div>
            </form>
        </div>
    );
}

export default AddQuizPopup;