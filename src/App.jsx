import { useState } from 'react';
import BuilderPageLayout from "./BuilderPage/BuilderPageLayout.jsx";
import MainPageLayout from "./MainPage/MainPageLayout.jsx";
import QuizPageLayout from './QuizPage/QuizPageLayout.jsx';
import LoginPageLayout from './LoginPage/LoginPageLayout.jsx';
import EditPageLayout from './EditPage/EditPageLayout.jsx';

const Pages = {
    MAIN: 0,
    BUILD: 1,
    QUIZ: 2,
    LOGIN: 3,
    EDIT: 4
}
// comment
function App() {
    const [user, setUser] = useState(null);
    const [page, setPage] = useState(Pages.LOGIN);
    const [currentQuizId, setCurrentQuizId] = useState("p7rWH138EC8pTiSZsgfy");

    if (page == Pages.MAIN) {
        return(
            <MainPageLayout setPage={setPage} setCurrentQuizId={setCurrentQuizId} user={user}/>
        );
    } else if (page == Pages.BUILD) {
        return(
            <BuilderPageLayout setPage={setPage} quizId={currentQuizId}/>
        );
    } else if (page == Pages.QUIZ) {
        return(
            <QuizPageLayout setPage={setPage} quizId={currentQuizId}/>
        );
    } else if (page == Pages.LOGIN) {
        if (user) {
            setPage(Pages.MAIN);
        }

        return(
            <LoginPageLayout setPage={setPage} setUser={setUser}/>
        );
    } else if (page == Pages.EDIT) {
        if (!user) {
            setPage(Pages.LOGIN);
        }

        return(
            <EditPageLayout setPage={setPage} setQuizId={setCurrentQuizId} user={user}/>
        );
    }
};

export default App;
export { Pages };