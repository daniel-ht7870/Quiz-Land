import { useState } from 'react';
import BuilderPageLayout from "./BuilderPage/BuilderPageLayout.jsx";
import MainPageLayout from "./MainPage/MainPageLayout.jsx";
import QuizPageLayout from './QuizPage/QuizPageLayout.jsx';

const Pages = {
    MAIN: 0,
    BUILD: 1,
    QUIZ: 2
}
// comment
function App() {
    const [page, setPage] = useState(Pages.MAIN);
    const [currentQuizId, setCurrentQuizId] = useState("p7rWH138EC8pTiSZsgfy");

    if (page == Pages.MAIN) {
        return(
            <MainPageLayout setPage={setPage} setCurrentQuizId={setCurrentQuizId}/>
        );
    } else if (page == Pages.BUILD) {
        return(
            <BuilderPageLayout setPage={setPage} quizId={currentQuizId}/>
        );
    } else if (page == Pages.QUIZ) {
        return(
            <QuizPageLayout setPage={setPage} quizId={currentQuizId}/>
        );
    }
};

export default App;
export { Pages };