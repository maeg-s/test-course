//All the imports for firebase modules needed for my login form functionality
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js"
import { getFirestore, doc, setDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js"

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

// Elements required for the password and password requirements
const email = document.getElementById("email");
const username = document.getElementById("username");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const matchPassword = document.getElementById("match");
const form = document.querySelector("form");
const submit = document.getElementById("submit");
const loginEmail = document.querySelector(".login input[type = 'email']")
const loginPassword = document.querySelector(".login input[type = 'password']")

// Function to Update password requirement status and icons
const updateRequirement = (id, valid) => {
    const requirement = document.getElementById(id);
//Adds or removes classes depending on if the requirement is met or not
    if (valid) {
        requirement.classList.add("valid");
        requirement.classList.remove("error");
    } else {
        requirement.classList.remove("valid");
        requirement.classList.add("error");
    }
};

// Checks the password against requirements
password.addEventListener("keyup", (event) => {
    const value = event.target.value;
//updates the requirements based on the password criteria 
    updateRequirement("length", value.length >= 8);
    updateRequirement("lowercase", /[a-z]/.test(value));
    updateRequirement("uppercase", /[A-Z]/.test(value));
    updateRequirement("number", /\d/.test(value));
    updateRequirement("characters", /[#.?!@$%^&*-]/.test(value));
   
    handleFormValidation(); //Checks if form is valid
});

//Validating password confirmation
confirmPassword.addEventListener("blur", () => {
    const value = confirmPassword.value;
//This shows an error if password and confirm password do not match, if so the error is hidden
    if (value.length && value !== password.value) {
        matchPassword.classList.remove("hidden");
    } else {
        matchPassword.classList.add("hidden");
    }
});
//Hides the match error when user tries to correct their password match error
confirmPassword.addEventListener("focus", () => {
    matchPassword.classList.add("hidden");
});

//Function that deals with Handling form validation for password
const handleFormValidation = () => {
    const value = password.value;
    const confirmValue = confirmPassword.value;
//Checks if requirements are met and that the passwords match
    const allValid = value.length >= 8 &&
        /[a-z]/.test(value) &&
        /[A-Z]/.test(value) &&
        /\d/.test(value) &&
        /[#.?!@$%^&*-]/.test(value) &&
        value === confirmValue;

    submit.disabled = !allValid; //disables the disability on submit button if requirements met
    return allValid;
};
//validating email
function validate_email(email) {
    const expression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expression.test(email);
}

//validating username
function validate_username(username) {
    const expression = /^[a-z0-9_\.]+$/;
    return expression.test(username);
}


//Validating form on input change
form.addEventListener("input", () => {
    handleFormValidation();
});

//Register/Sign up function to create the user and save their details
function createUser(emailValue, passwordValue, usernameValue) {
    createUserWithEmailAndPassword(auth, emailValue, passwordValue)
    .then((userCredential) => {
        const user = userCredential.user; //gets the created user data
        //now saving user details to firestore
        setDoc(doc(database, "users", user.uid), {
            username: usernameValue,
            email: emailValue,
            last_login: Timestamp.now(), //time of sign-up is noted
        })
            .then(() => {
                alert("Registration successful!");//If registration successful, alerts user
            })
        .catch((error) => {
            alert("An error has occurred. Please try again.");//Alert if registration is not successful
        });
    })
    //This will show an alert if there is an error with the registration
    .catch((error) => {
        alert("Registration failed. " + error.message);
    });
}

//Login function to use login using data corresponding to user registration details
function login(emailValue, passwordValue) {
    signInWithEmailAndPassword(auth, emailValue, passwordValue)
    .then((userCredential) => {
        const user = userCredential.user;//Gets the login data

        //Updating the last logged in field
        setDoc(doc(database, "users", user.uid), {
            last_login: Timestamp.now(),
        }, {merge: true}) //makes sure last logged in is updated without overwriting anything else
        .then(() => {
        alert("Logged in successfully!");//Shows that the user has logged in successfully
        //in the future i will redirect to another page from here.
    })
    .catch((error) => {
        alert("Error logging in: " + error.message);//error shown if updating the last-logged in fails
    });
})
}

//Adding an event listener for form submission to prevent reloading and default behaviour
form.addEventListener("submit", (event) => {
    event.preventDefault();

    //validating input fields to later call the createuser function
    const validForm = handleFormValidation();
    if (validForm) {
        const emailValue = email.value;
        const passwordValue = password.value;
        const usernameValue = username.value;
         //Validating email and username before after it is entertained before calling the createuser function
         let isValid = true;
        
         if(!validate_email(emailValue)) {
             alert("The email address is invalid. Please enter a valid email address.");
             isValid = false;
         }
         
         if (!validate_username(usernameValue)) {
             alert("The username is invalid. Please enter a valid username.");
             isValid = false;
         }
 //if all validations are successful the createuser function is called
         if (isValid && handleFormValidation()) {
             createUser(emailValue, passwordValue, usernameValue); //calling the createuser function only if input fields are valid
         }
     }
 });
 

//Adding an event listener for the login form submission
const loginForm = document.querySelector(".login form");
loginForm.addEventListener("submit", (event) => {
    event.preventDefault(); //prevents reloads and such as said above

    const emailValue = loginEmail.value;
    const passwordValue = loginPassword.value;

    if (validate_email(emailValue)) {
        login(emailValue, passwordValue); //calls the login function if validation is successful
    } else {
        alert("Please enter a valid email address.");
    }
});