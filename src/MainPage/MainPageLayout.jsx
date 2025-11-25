import { useState, useEffect } from "react";
import styles from "./MainPage.module.css";
import { Pages } from "../App.jsx";
import { getQuizzes } from "../DatabaseHandler.jsx";
import AddQuizPopup from "./AddQuizPopup/AddQuizPopup.jsx";

function MainPageLayout({ setPage, setCurrentQuizId, user }) {
    const [quizzes, setQuizzes] = useState(null);
    const [addingQuiz, setAddingQuiz] = useState(false);

    useEffect(() => {
        initializeQuizzes();
    }, []);

    async function initializeQuizzes() {
        const q = await getQuizzes();
        setQuizzes(q);
    }

    const handleTakeQuiz = (e) => {
        setCurrentQuizId(e.target.getAttribute('q-id'));
        setPage(Pages.QUIZ);
    }

    if (!quizzes) {
        return(<p>Loading...</p>)
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
                <button className={styles["quiz-card-button"]} q-id={quiz.qId} onClick={handleTakeQuiz}>Take Quiz</button>
            </div>
        );
    });

    addingQuiz ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';

    return(
        <div className={styles["main-page"]}>
            {addingQuiz && <AddQuizPopup setAddingQuiz={setAddingQuiz} setPage={setPage} setCurrentQuizId={setCurrentQuizId} user={user}/>}
            <h1 id={styles["header-title"]}>Quizland</h1>
            <div className={styles["main-page-body"]}>
                <div id={styles["actions"]}>
                    <button id={styles["edit-button"]} onClick={() => setPage(Pages.EDIT)}>Edit Your Quizzes</button>
                    <button id={styles["create-button"]} onClick={() => setAddingQuiz(true)}>Create New Quiz &nbsp;<span>→</span></button>
                </div>
                <p id={styles["discover-text"]}>discover quizzes</p>
                <p id={styles["down-arrow"]}>↓</p>
                <div className={styles["quizzes"]}>
                    {quizMap}
                </div>
            </div>
        </div>
    );
}

export default MainPageLayout;