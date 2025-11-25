import { useState, useEffect } from 'react';
import { getUserQuizzes, deleteQuiz } from '../DatabaseHandler';
import { Pages } from '../App';
import styles from './EditPage.module.css';

function EditPageLayout({ setPage, setQuizId, user }) {
    const [quizzes, setQuizzes] = useState(null);

    useEffect(() => {
        initializeQuizzes();
    }, []);

    const initializeQuizzes = async () => {
        const q = await getUserQuizzes(user.uid);
        setQuizzes(q);
    }

    const handleEditQuiz = (e) => {
        setQuizId(e.target.getAttribute('q-id'));
        setPage(Pages.BUILD);
    }

    const handleDeleteQuiz = async (e) => {
        if (confirm("You are about to delete your quiz, this action is irreversible")) {
            await deleteQuiz(e.target.getAttribute('q-id'));
            initializeQuizzes();
        }
    }

    if (!quizzes) {
        return(<p>Loading...</p>);
    }

    const quizMap = quizzes.map((quiz) => {
        return(
            <div className={styles["quiz-card"]}>
                <div className={styles["quiz-card-image-container"]}>
                    <img src={quiz.image} alt={'An image for ' + quiz.name}></img>
                </div>
                <h3 className={styles["quiz-card-name"]}>{quiz.name}</h3>
                <p className={styles["quiz-card-author"]}>{quiz.author}</p>
                <p className={styles["quiz-card-desc"]}>{quiz.description}</p>
                <div className={styles["quiz-card-actions"]}>
                    <button className={styles["quiz-card-delete-button"]} q-id={quiz.qId} onClick={handleDeleteQuiz}>Delete Quiz</button>
                    <button className={styles["quiz-card-edit-button"]} q-id={quiz.qId} onClick={handleEditQuiz}>Edit Quiz</button>
                </div>
            </div>
        );
    });

    return(
        <div className={styles['edit-page-body']}>
            <div className={styles['edit-page-header']} onClick={() => setPage(Pages.MAIN)}>
                <h1>Quizland</h1>
            </div>
            <div className={styles["quizzes"]}>
                {quizMap}
            </div>
        </div>
    );
}

export default EditPageLayout;