import { act, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './QuizEditor.module.css';
import { updateQuizQuestion, deleteQuizQuestion } from '../../DatabaseHandler';
import ResultEditor from './ResultEditor';

function arrayFiller(responseCount) {
    let arrayToReturn = [];

    for (let i = 0; i < responseCount; i++) {
        arrayToReturn.push(0);
    }

    return arrayToReturn;
}

function QuizEditor({ quiz, question, result, resultId, initializeQuiz }) {
    const [weightsLeft, setWeightsLeft] = useState(arrayFiller(question.responses.length));
    const [activeResponse, setActiveResponse] = useState(0);
    const [buttonState, setButtonState] = useState(false);
    const [questionBodyText, setQuestionBodyText] = useState(question.question);
    const [responses, setResponses] = useState(question.responses);

    useEffect(() => {
        setQuestionBodyText(question.question);
        setResponses(question.responses);
    }, [quiz, question]);

    // updating the database document containing the question
    const updateQuestion = async () => {
        // reject update if no changes made (to avoid overwhelming the host)
        if (!buttonState){
            alert('No changes were made');
            return;
        }

        let weightSum = 0; // keeping track of the sum of weights to ensure all weights are assigned

        // reject an empty question body
        if (question.question == '') {
            alert('Question body can\'t be empty');
            return;
        }

        // reject empty responses
        for (let i in question.responses) if (question.responses[i] == '') {
            alert('Response bodies can\'t be empty');
            return;
        }

        // loop over question responses
        for (let i = 0; i < question.responses.length; i++) {
            weightSum = 0;
            // loop over and add up response weights
            for (let j = 0; j < question.weights[i].length; j++) {
                let w = question.weights[i][j];
                weightSum += parseInt(w);
            }
            // reject if the sum of all weights doesn't equal to the amount of results
            if (weightSum != quiz.results.length) {
                alert('Not all result weights assigned');
                return;
            }
        }

        await updateQuizQuestion(quiz.qId, question.qId, question); // the database function
        await initializeQuiz(); // reinitialize the quiz with the updated question
        setButtonState(false); // reset button state to inactive (gray out the save button)
    }

    // ran upon user input to the question body
    const handleQuestionInput = (e) => {
        setQuestionBodyText(e.target.value);
        question.question = e.target.value; // update the question body
        setButtonState(true); // activate the save button
    }

    // ran upon changing a response weight
    const handleWeightUpdate = (e) => {
        // reject non-numeric inputs
        if (isNaN(e.target.value) || e.target.value == '') {
            return;
        }

        let rId = e.target.getAttribute('r-id'); // get the *result* identifier of the weight entry
        let newWeights = structuredClone(question.weights); // temporary weights to reflect current weights + input
        newWeights[activeResponse][rId] = parseInt(e.target.value); // update the temporary weights

        let weightSum = 0;
        for (let i = 0; i < newWeights[activeResponse].length; i++) {
            // reject negative weights
            if (newWeights[activeResponse][i] < 0) {
                return
            }
            weightSum += newWeights[activeResponse][i];
        }
        // reject weights that add up to a number greater than the amount of results
        if (weightSum > quiz.results.length) {
            return
        }

        question.weights[activeResponse][rId] = parseInt(e.target.value); // update permanent weights to include input
        let newWeightsLeft = structuredClone(weightsLeft);
        newWeightsLeft[activeResponse] = quiz.results.length - weightSum; // amount of weights left to assign
        setWeightsLeft(newWeightsLeft);
        setButtonState(true);
    }

    const handleResponseFocus = (e) => {
        if (activeResponse != e.target.getAttribute('r-id')) {
            setActiveResponse(e.target.getAttribute('r-id'));
        }
    }

    const handleResponseInput = (e) => {
        let rId = parseInt(e.target.getAttribute('r-id'));

        question.responses[rId] = e.target.value;
        let newResponses = structuredClone(responses);
        newResponses[rId] = e.target.value;
        setResponses(newResponses);
        setButtonState(true);
    }

    const handleAddResponse = () => {
        question.responses[question.responses.length] = '';
        question.weights[question.responses.length - 1] = arrayFiller(quiz.results.length);
        
        let newWeights = weightsLeft;
        newWeights[newWeights.length] = quiz.results.length;
        // console.log('New weights:', newWeights);
        setActiveResponse(question.responses.length - 1);
        setWeightsLeft(newWeights);
        setButtonState(true);
        // console.log('Response added');
    }

    const handleRemoveResponse = () => {
        if (question.responses.length == 1) {
            alert('Cannot have a question with no responses');
            return;
        }
        question.responses.pop();
        delete question.weights[question.responses.length];

        let newWeights = weightsLeft;
        newWeights.pop();
        // console.log('New weights:', newWeights);
        setWeightsLeft(newWeights);
        setActiveResponse(0);
        setButtonState(true);
        // console.log('Response removed');
    }

    const handleDeleteQuestion = async () => {
        if(confirm('You are about to delete a question, this process is irreversible')) {
            await deleteQuizQuestion(quiz.qId, question.qId);
            await initializeQuiz();
        }
    }

    let rId = -1;
    const responseMap = responses.map((response) => {
        rId += 1;
        return(
            <input key={rId} r-id={rId} type="text" value={response} onFocus={handleResponseFocus} onChange={handleResponseInput}/>
        );
    });
    
    let id = 0;
    rId = -1;
    let weightMap = <p>Loading</p>;

    // if editing a result (not a question)
    if (result) {
        return(
            <ResultEditor quiz={quiz} result={result} rId={resultId} initQuiz={initializeQuiz}/>
        );
    }

    // Necessary to ensure the active response doesn't exceed the total amount of responses
    // because an active response could be 5 for one question, and when switched to a question
    // with less than 5 responses, it stays as 5 causing an error
    if (activeResponse <= question.responses.length) {
        weightMap = question.weights[activeResponse].map((weight) => {
            id = uuidv4();
            rId += 1;
            return(
                <div key={id} className={styles['weight-entry']}>
                    <label htmlFor={id}>{quiz.results[rId].title}: </label>
                    <input type="number" id={id} r-id={rId} value={weight} onChange={(e) => handleWeightUpdate(e)}/>
                </div>
            );
        });
    } else {
        setActiveResponse(0);
    }

    const SaveButton = () => {
        if (buttonState) {
            return(<button className={styles['save-button-active']} onClick={updateQuestion}>Save Changes</button>);
        } else {
            return(<button className={styles['save-button-inactive']}>Save Changes</button>);
        }
    }

    const DeleteButton = () => {
        return(
            <button className={styles['delete-button']} onClick={handleDeleteQuestion}>Delete Question</button>
        );
    }

    return(
        <div className={styles['quiz-editor']}>
            <div className={styles['quiz-editor-question']}>
                <textarea placeholder="Enter the question here" value={questionBodyText} onInput={handleQuestionInput}/>
            </div>
            <div className={styles['quiz-editor-responses']}>
                {responseMap}
                <button type="button" onClick={handleAddResponse}>+ add response</button>
                <button type="button" onClick={handleRemoveResponse}>- remove response</button>
            </div>
            <div className={styles['quiz-editor-weights']}>
                <h4>Weights to Assign: {weightsLeft[activeResponse]}</h4>
                {weightMap}
            </div>
            <DeleteButton/>
            <SaveButton/>
        </div>
    );
}

export default QuizEditor;