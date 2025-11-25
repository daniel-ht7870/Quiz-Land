import { useState, useEffect } from "react";
import { updateQuizQuestion } from "../../DatabaseHandler";
import styles from './QuizEditor.module.css';

let activeResponse = 0;

function QuestionEditor({ quiz, question, initQuiz }) {
    const calculateWeightsLeft = () => {
        return quiz.results.length - question.weights[activeResponse].reduce((acc, cur) => acc + cur, 0);
    }

    const mapResponses = (handleResponseInput) => question.responses.map((r, i) => {
        return(
            <input key={i} r-id={i} type="text" value={r} onChange={handleResponseInput} onFocus={handleResponseFocus}/>
        );
    });

    const mapWeights = (handleWeightInput) => question.weights[activeResponse].map((w, i) => {
        return(
            <div key={i} className={styles['weight-entry']}>
                <label>{quiz.results[i].title}: </label>
                <input type="number" id={i} w-id={i} value={w} onChange={handleWeightInput}/>
            </div>
        );
    });

    const handleBodyInput = (e) => {
        question.question = e.target.value;
        setBody(e.target.value);
        setButtonState(true);
    }

    const handleResponseInput = (e) => {
        question.responses[e.target.getAttribute('r-id')] = e.target.value;
        setResponses(mapResponses(handleResponseInput));
        setButtonState(true);
    }

    const handleResponseFocus = (e) => {
        activeResponse = e.target.getAttribute('r-id');
        setWeights(mapWeights(handleWeightInput));
        setWeightsLeft(calculateWeightsLeft());
    }

    const handleAddResponse = (e) => {
        question.responses.push('');
        question.weights[question.responses.length - 1] = Array.from({ length: quiz.results.length }, () => 1);
        setResponses(mapResponses(handleResponseInput));
        setButtonState(true);
    }

    const handleRemoveResponse = (e) => {
        if (question.responses.length <= 1) {
            alert('Cannot have a question with no responses');
            return;
        }
        question.responses.pop();
        delete question.weights[question.responses.length];
        activeResponse -= 1;
        setResponses(mapResponses(handleResponseInput));
        setButtonState(true);
    }

    const handleWeightInput = (e) => {
        if (isNaN(e.target.value) || e.target.value == '' || parseInt(e.target.value) < 0) {
            return;
        }

        let weightSum = question.weights[activeResponse];
        weightSum[e.target.getAttribute('w-id')] = parseInt(e.target.value);
        weightSum = weightSum.reduce((acc, cur) => acc + cur, 0);
        if (weightSum > quiz.results.length) {
            return;
        }

        question.weights[activeResponse][e.target.getAttribute('w-id')] = parseInt(e.target.value);
        setWeights(mapWeights(handleWeightInput));
        setWeightsLeft(calculateWeightsLeft());
        setButtonState(true);
    }

    const handleSave = async () => {
        if (question.question == '') {
            alert('Question body can\'t be empty');
            return;
        }

        question.responses.forEach((q) => {
            if (q == '') {
                alert('Response bodies can\'t be empty');
                return;
            }
        });

        let weightSum;
        for (let i = 0; i < question.responses.length; i++) {
            weightSum = question.weights[i].reduce((acc, cur) => acc + cur, 0);
            if (weightSum != quiz.results.length) {
                alert('Not all result weights assigned');
                return;
            }
        }

        setButtonState(false);
        await updateQuizQuestion(quiz.qId, question.qId, question);
        await initializeQuiz();
    }

    const handleDelete = () => {

    }

    const [body, setBody] = useState();
    const [responses, setResponses] = useState();
    const [weights, setWeights] = useState();
    const [weightsLeft, setWeightsLeft] = useState();
    const [buttonState, setButtonState] = useState();

    useEffect(() => {
        activeResponse = 0;
        setBody(question.question);
        setResponses(mapResponses(handleResponseInput));
        setWeights(mapWeights(handleWeightInput));
        setWeightsLeft(calculateWeightsLeft());
    }, [question]);

    return(
        <form className={styles['quiz-editor']}>
            <div className={styles['quiz-editor-question']}>
                <textarea placeholder="Enter the question here" value={body} onChange={handleBodyInput}/>
            </div>
            <div className={styles['quiz-editor-responses']}>
                {responses}
                <button type="button" onClick={handleAddResponse}>+ add response</button>
                <button type="button" onClick={handleRemoveResponse}>- remove response</button>
            </div>
            <div className={styles['quiz-editor-weights']}>
                <h4>Weights left to Assign: {weightsLeft}</h4>
                {weights}
            </div>
            {buttonState ? <button type="button" className={styles['save-button-active']} onClick={handleSave}>Save Changes</button>
                : <button type="button" className={styles['save-button-inactive']}>Save Changes</button>}
            <button type="button" className={styles['delete-button']} onClick={handleDelete}>Delete Question</button>
        </form>
    );
}

export default QuestionEditor;