class Flashcard {
    constructor(question, answer) {
        this.question = question;
        this.answer = answer;
    }

    display() {
        return `<div class="flashcard"><h3>Q: ${this.question}</h3><p>A: ${this.answer}</p></div>`;
    }
}

// Shows the respective section
function showSection(section) {
    const manualSection = document.getElementById("manualSection");
    const aiSection = document.getElementById("aiSection");

    if (section === "manual") {
        manualSection.style.display = "block";
        aiSection.style.display = "none";
    } else if (section === "ai") {
        manualSection.style.display = "none";
        aiSection.style.display = "block";
    }
}

// Create your own flashcards feature
function createManualFlashcard() {
    const question = document.getElementById("manualQuestion").value;
    const answer = document.getElementById("manualAnswer").value;

    if (!question || !answer) {
        alert("Please enter both a question and an answer.");
        return;
    }

    // Create and display the flashcard using the Flashcard class
    const flashcard = new Flashcard(question, answer);
    const manualFlashcardDisplay = document.getElementById("manualFlashcardDisplay");
    manualFlashcardDisplay.innerHTML += flashcard.display();

    // Clear input fields
    document.getElementById("manualQuestion").value = "";
    document.getElementById("manualAnswer").value = "";

    // Save to currentFlashcardSet
    if (!window.currentFlashcardSet) window.currentFlashcardSet = [flashcard]
    else window.currentFlashcardSet.push(flashcard)
}

// Function to handle AI flashcard generation based on user input
async function createAIGeneratedFlashcard() {
    const prompt = document.getElementById("aiPrompt").value;

    if (!prompt) {
        alert("Please enter a topic for flashcard generation.");
        return;
    }

    const generateButton = document.getElementById("generateAIFlashcards");
    generateButton.disabled = true; // Disables button to prevent multiple clicks

    try {
        console.log('Sending request to server with prompt:', prompt); // Logging input for debugging
        const response = await fetch('http://localhost:3000/generate', { // Correct URL without double slash
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ notes: prompt })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const { flashcards } = await response.json();
        console.log('Received response from server:', flashcards); // Logging response for debugging
        displayFlashcards(flashcards, 'aiFlashcardDisplay');
        window.currentFlashcardSet = flashcards;
    } catch (error) {
        console.error("Error generating flashcards:", error);
    } finally {
        generateButton.disabled = false; // Re-enable the button after generation
    }
}

// Function to display flashcards (for now-may remove later)
function displayFlashcards(flashcards, displayElementId) {
    const display = document.getElementById(displayElementId);
    display.innerHTML = '';
    flashcards.forEach(card => {
        const flashcard = new Flashcard(card.front, card.back);
        display.innerHTML += flashcard.display();
    });
}

// Event Listeners for Buttons
document.getElementById("manualButton").addEventListener("click", function() {
    showSection("manual");
});

document.getElementById("aiButton").addEventListener("click", function() {
    showSection("ai");
});

document.getElementById("addManualFlashcard").addEventListener("click", createManualFlashcard);
document.getElementById("generateAIFlashcards").addEventListener("click", createAIGeneratedFlashcard);