//All the imports for firebase modules needed for my login form functionality
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js"
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js"

//Firebase configuration 
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

function saveCurrentSet() {

    async function saveToDB(user) {
        if (!window.currentFlashcardSet || window.currentFlashcardSet.length == 0) {
            alert("No flashcard set to save!")
            return;
        }
        const name = prompt("Enter name of flashcard set")

        const ref = await addDoc(collection(database, "flashcard-sets"), {
            name,
            questions: window.currentFlashcardSet.map(f => ({ ...f })),
            creatorId: user.uid,
        })
        console.log(`Flashcard set added with id: ${ref.id}`)
        alert("Saved!")

        document.getElementById("gotoManualSet").style.display = "inline-block";
        document.getElementById("gotoManualSet").onclick = () => {
            window.location = "/flashcards-d.html?id=" + ref.id
        }

        document.getElementById("gotoAISet").style.display = "inline-block";
        document.getElementById("gotoAISet").onclick = () => {
            window.location = "/flashcards-d.html?id=" + ref.id
        }
    }

    if (!auth.currentUser) {
        const email = prompt("You're logged out! Enter email: ");
        const password = prompt("Enter password: ")
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            console.log(userCredentials.user);

            saveToDB(userCredentials.user)
        }).catch(error => {
            alert(`Error (code ${error.code}): ${error.message}`)
        })
        return;
    }

    saveToDB(auth.currentUser)

    console.log(auth.currentUser)
    console.log(window.currentFlashcardSet)
}

document.getElementById("saveManualSet").addEventListener("click", saveCurrentSet)
document.getElementById("saveAISet").addEventListener("click", saveCurrentSet)
