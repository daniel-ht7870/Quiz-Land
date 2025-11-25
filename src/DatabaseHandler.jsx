import { firebaseConfig } from "./FirebaseConfig";
import { initializeApp } from "firebase/app";
import { getFirestore, query, where, collection, doc, getDoc, getDocs, setDoc, updateDoc, addDoc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

let db = null;
let auth = null;

// don't use this function anywhere but 'getDB()'
async function initDB() {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Firestore
    const db = getFirestore(app);

    return db;
};

// don't use this function anywhere but 'getAuth()'
async function initAuth() {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    return auth;
}

// if DB initialized, return it, otherwise initialize it
async function getDB() {
    if (!db) {
        db = await initDB();
        return db;
    } else if (db) {
        return db;
    }
};

async function getAuthenticator() {
    if (!auth) {
        auth = await initAuth();
        return auth;
    } else if (auth) {
        return auth;
    }
}

async function createAccount(displayName, email, password) {
    if (!auth) await getAuthenticator();

    let user = null;
    await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            user = userCredential.user;
            return updateProfile(user, {
                displayName: displayName
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
    return user;
}

async function loginToAccount(email, password) {
    if (!auth) await getAuthenticator();

    let user = null;
    await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            user = userCredential.user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
        return user;
}

// get the array of all quizzes
async function getQuizzes() {
    if (!db) await getDB();

    const colRef = collection(db, "Quizzes");
    const colSnap = await getDocs(colRef);

    const quizArray = [];

    if (colSnap) {
        colSnap.forEach(quiz => {
            quizArray.push(QuizConverter.fromFirestore(quiz));
        });
        return quizArray;
    } else {
        console.log("No such document!");
    }

    return null;
}

async function getUserQuizzes(uid) {
    if (!db) await getDB();

    const q = query(collection(db, "Quizzes"), where("authorId", "==", uid));
    const querySnapshot = await getDocs(q);

    const quizArray = [];

    if (querySnapshot) {
        querySnapshot.forEach(quiz => {
            quizArray.push(QuizConverter.fromFirestore(quiz));
        });
        return quizArray;
    } else {
        console.log("No quizzes found");
    }

    return null;
}

// get the individual quiz by ID
async function getQuiz(quizId) {
    if (!db) await getDB();

    const docRef = doc(db, "Quizzes", quizId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return QuizConverter.fromFirestore(docSnap);
    } else {
        console.log("No document found at id", quizId);
        return null;
    }
}

async function addQuiz(quiz) {
    if (!db) await getDB();

    quiz.results = [defaultResult];
    const docRef = await addDoc(collection(db, "Quizzes"), QuizConverter.toFirestore(quiz));
    
    let questionToAdd = defaultQuestion;
    questionToAdd.order = 0;
    await addDoc(collection(db, "Quizzes", docRef.id, "Quiz Questions"), QuizQuestionConverter.toFirestore(questionToAdd));
    return docRef.id;
}

async function updateQuiz(quiz) {
    if (!db) await getDB();

    const ref = doc(db, "Quizzes", quiz.qId).withConverter(QuizConverter);
    await setDoc(ref, quiz);
}

async function deleteQuiz(quizId) {
    if (!db) await getDB();

    const ref = doc(db, "Quizzes", quizId);
    await deleteDoc(ref);
}

// get an array of all questions in a quiz
async function getQuizQuestions(quizId) {
    if (!db) await getDB();

    const docRef = collection(db, "Quizzes", quizId, "Quiz Questions");
    const colSnap = await getDocs(docRef);

    const questionArray = [];

    if (colSnap) {
        colSnap.forEach(question => {
            questionArray.push(QuizQuestionConverter.fromFirestore(question));
        });
        questionArray.sort((a, b) => a.order - b.order);
        return questionArray;
    } else {
        console.log("Error");
        return null;
    }
}

async function updateQuizQuestion(quizId, questionId, newQuestion) {
    if (!db) await getDB();

    const ref = doc(db, "Quizzes", quizId, "Quiz Questions", questionId).withConverter(QuizQuestionConverter);
    await setDoc(ref, newQuestion);
}

async function addQuizQuestion(quizId, newQuestion) {
    if (!db) await getDB();

    const ref = collection(db, "Quizzes", quizId, "Quiz Questions").withConverter(QuizQuestionConverter);
    await addDoc(ref, newQuestion);
}

async function deleteQuizQuestion(quizId, questionId) {
    if (!db) await getDB();

    const ref = doc(db, "Quizzes", quizId, "Quiz Questions", questionId);
    await deleteDoc(ref);
}

async function addQuizResult(quizId) {
    if (!db) await getDB();

    const quiz = await getQuiz(quizId);
    quiz.results.push(defaultResult);
    await updateQuiz(quiz);

    const questions = await getQuizQuestions(quizId);
    questions.forEach(async question => {
        for (let i = 0; i < question.responses.length; i++) {
            question.weights[i].push(1);
        }
        await updateQuizQuestion(quizId, question.qId, question);
    });
}

async function deleteQuizResult(quizId, result) {
    if (!db) await getDB();

    const quiz = await getQuiz(quizId);
    quiz.results.splice(result.rId, 1);
    updateQuiz(quiz);

    const questions = await getQuizQuestions(quizId);
    questions.forEach(async question => {
        for (let i = 0; i < question.responses.length; i++) {
            question.weights[i].splice(result.rId, 1);
        }
        await updateQuizQuestion(quizId, question.qId, question);
    });
}

class Quiz {
    constructor(qId, author, aId, description, image, name, results) {
        this.qId = qId;
        this.author = author;
        this.aId = aId;
        this.description = description;
        this.image = image;
        this.name = name;
        this.results = results;
    }
}

const QuizConverter = {
    toFirestore: (quiz) => {
        return {
            author: quiz.author,
            authorId: quiz.aId,
            description: quiz.description,
            image: quiz.image,
            'quiz-name': quiz.name,
            results: quiz.results.map((result) => {
                return QuizResultConverter.toFirestore(result);
            })
        };
    },
    fromFirestore: (snapshot) => {
        const data = snapshot.data();
        const results = [];
        for (let i = 0; i < data.results.length; i++) {
            results.push(new Result(i, data.results[i].title, data.results[i].description, data.results[i].image));
        }
        return new Quiz(snapshot.id, data.author, data.authorId, data.description, data.image, data['quiz-name'], results)        
    }
}

class QuizQuestion {
    constructor(qId, question, responses, weights, constrained, order) {
        this.qId = qId;
        this.question = question;
        this.responses = responses;
        this.weights = weights;
        this.constrained = constrained;
        this.order = order;
    }
}

const QuizQuestionConverter = {
    toFirestore: (question) => {
        return {
            question: question.question,
            responses: question.responses,
            weights: question.weights,
            constrained: question.constrained,
            order: question.order
        };
    },
    fromFirestore: (snapshot) => {
        const data = snapshot.data();
        return new QuizQuestion(snapshot.id, data.question, data.responses, data.weights, data.constrained, data.order);
    }
}

class Result {
    constructor(rId, title, description, image) {
        this.rId = rId;
        this.title = title;
        this.description = description;
        this.image = image;
    }
}

const QuizResultConverter = {
    toFirestore: (result) => {
        return {
            description: result.description,
            image: result.image,
            title: result.title
        };
    },
    fromFirestore: (snapshot) => {
        const data = snapshot.data();
        return new Result(null, data.title, data.description, Database.image);
    }
}

// DO NOT CHANGE
const defaultQuestion = new QuizQuestion(
    null,
    'Sample Question',
    ['Sample Response 1', 'Sample Response 2'],
    {0: [1], 1: [1]},
    true,
    null
);

// DO NOT CHANGE
const defaultResult = new Result(
    null,
    'Sample Result',
    'Sample Result Description',
    'https://placehold.co/800x800?text=Sample+Result'
);

export { getDB, getQuizzes, getUserQuizzes, addQuiz, deleteQuiz, updateQuiz, getQuiz, getQuizQuestions, updateQuizQuestion, addQuizQuestion, deleteQuizQuestion, addQuizResult, deleteQuizResult, defaultQuestion, Quiz, QuizQuestion, Result, createAccount, loginToAccount };