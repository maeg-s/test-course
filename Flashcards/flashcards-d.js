import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js"
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js"

var firebaseConfig = {
    apiKey: "AIzaSyDEjM0T9DidNrmLkxRF5BUk53zeq4vkzgo",
    authDomain: "nea-coursework.firebaseapp.com",
    projectId: "nea-coursework",
    storageBucket: "nea-coursework.appspot.com",
    messagingSenderId: "914603781285",
    appId: "1:914603781285:web:17c664033c15efb8a9b14c",
};
//initialising app
const app = initializeApp(firebaseConfig);
//initialising variables
const auth = getAuth(app);
const database = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const flashcardSetId = params.get("id");

auth.onAuthStateChanged(async (user) => {

    if (!user) return;
    if (!flashcardSetId) return;

    try {
        const docRef = doc(database, "flashcard-sets", flashcardSetId);
        const snapshot = await getDoc(docRef)

        if (!snapshot.exists()) throw "Doesn't exist";

        const set = snapshot.data();
        loadFlashcards(set.questions);
    } catch(e) {
        console.log(e)
        alert("Flashcard set doesn't exist or you have insufficient permissions")
    }
})


const loadFlashcards = (flashcards) => {
    // const flashcards =  [
    //     { question: "What is the capital of France?", answer: "Paris"},
    //     { question: "What is 2+2?", answer: "4" },
    //     { question: "What is the capital of Japan?", answer: "Tokyo" },
    // ];

    console.log(flashcards)
    
    let currentCard = 0;
    const flashcardElement = document.getElementById("flashcard");
    const questionElement = document.getElementById("question");
    const answerElement = document.getElementById("answer");
    
    function displayCard() {
        questionElement.textContent = flashcards[currentCard].front || flashcards[currentCard].question;
        answerElement.textContent = flashcards[currentCard].back || flashcards[currentCard].answer;
        flashcardElement.classList.remove("is.flipped");
    }

    document.getElementById("flip-card").addEventListener("click", () => {
        flashcardElement.classList.toggle("is-flipped");
    });

    document.getElementById("next-card").addEventListener("click", () => {
        currentCard = (currentCard + 1) % flashcards.length;
        displayCard();
    })

    displayCard();
};
