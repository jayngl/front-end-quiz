// Step 1: Create a Quiz Object
// Create a function that returns an object representing a quiz. This object will contain properties and methods related to the quiz.

// Step 2: Use Closures to Encapsulate Quiz Data
// Inside the quiz object function, define variables that store the quiz data, such as questions, answers, and scores. These variables will be encapsulated within the closure, making them private and inaccessible from outside the quiz object.

// Step 3: Create Methods to Interact with the Quiz
// Define methods within the quiz object that allow users to interact with the quiz. These methods can include:

// - startQuiz(): Initializes the quiz and sets up the first question.
// - nextQuestion(): Displays the next question and updates the score.
// - submitAnswer(): Checks the user's answer and updates the score.
// - getScore(): Returns the current score.

// Step 4: Use Closures to Preserve State
// The methods defined in Step 3 will have access to the private variables storing the quiz data. This allows the methods to preserve the state of the quiz, such as the current question and score, between function calls.

// Step 5: Create a User Interface
// Create a user interface that interacts with the quiz object. This can include HTML elements, such as buttons and text inputs, that call the methods defined in Step 3.

// Benefits of Using Closures
// Using closures to create a quiz app provides several benefits:

// - Encapsulation: Closures help encapsulate the quiz data, making it private and inaccessible from outside the quiz object.
// - State preservation: Closures allow the methods to preserve the state of the quiz between function calls.
// - Modularity: Closures promote modularity by allowing you to create self-contained modules that manage their own state.

const toggleTheme = document.getElementById("toggleTheme");

let isToggled = false;
toggleTheme.addEventListener("click", () => {
  isToggled = !isToggled;

  if (isToggled) {
    document.body.classList.add("darkmode");
    toggleTheme.innerHTML = `<i class="fa-solid fa-sun" style="color: #ffffff;"></i>`;
  } else {
    document.body.classList.remove("darkmode");
    toggleTheme.innerHTML = `<i class="fa-solid fa-moon" style="color: black;"></i>`;
  }
});

const quizBtns = document.querySelectorAll(".quizBtn");
const nextBtn = document.getElementById("nextBtn");
const heroSection = document.getElementById("heroSection");
const endScreen = document.getElementById("endScreen");
const currentQuestion = document.getElementById("currentQuestion");
const question = document.getElementById("question");
const options = document.querySelectorAll(".option");
const quizSection = document.getElementById("quizSection");
const submitBtn = document.getElementById("submitBtn");
const timerDisplay = document.getElementById("timerDisplay");
const showQuizType = document.getElementById("showQuizType");
const score = document.getElementById("score");
const numberOfQuestion = document.getElementById("numberOfQuestion");
const playAgainBtn = document.getElementById("playAgainBtn");

// quiz closure
function quiz() {
  // stores fetched data from json
  let data;
  // stores current question number
  let questionNumber = 1;
  // stores quiz type
  let quizType;
  // stores user answer when a user clicks an option
  let userAnswer;
  // question timer init
  let timer = 29;
  // stores timer setinterval
  let timerInterval;
  // keeps track of the usersScore
  let usersScore = 0;

  // fetches data from json
  async function getData() {
    let res = await fetch("src/data.json");
    data = await res.json();
  }
  getData();

  // gets quizType depending on which one is choosen by the user
  function getQuizType(Type) {
    quizType = Type;
  }

  // displays quiz data dynamically unto the dom
  function displayQuiz() {
    if (questionNumber < data[quizType].length + 1) {
      nextBtn.style.display = "none";
      startTimer();
      progressBar();
      options.forEach((option) => {
        option.style.border = "none";
      });
      currentQuestion.textContent = `Question: ${questionNumber} of ${data[quizType].length}`;
      question.textContent = data[quizType][questionNumber - 1].question;
      options.forEach((option, index) => {
        option.textContent = data[quizType][questionNumber - 1].choices[index];
      });
    } else {
      quizSection.style.display = "none";
      endScreen.style.display = "flex";
      displayQuizEnd();
    }
  }

  // contains the timer logic
  function startTimer() {
    timerInterval = setInterval(() => {
      if (timer > 0) {
        timer -= 1;
        timerDisplay.textContent = `0:${timer.toString().padStart(2, 0)}`;
      } else if (timer === 0 && userAnswer === undefined) {
        clearInterval(timerInterval);
        submitBtn.removeEventListener("click", newQuiz.checkAnswer);

        options[
          data[quizType][questionNumber - 1].choices.indexOf(
            data[quizType][questionNumber - 1].answer
          )
        ].style.border = "2px solid green";
        window.alert("Out of time click next to continue");
        questionNumber++;
        nextBtn.style.display = "block";
      }
    }, 1000);
    timer = 30;
    timerDisplay.textContent = `1:00`;
  }

  // gets the index of the option choosen by the user
  function getSubmitedAnswer(index) {
    userAnswer = index;
  }

  // checks the answer for the current question against the users choose and returns correct or incorrect
  function checkAnswer() {
    if (userAnswer !== undefined) {
      if (
        data[quizType][questionNumber - 1].choices[userAnswer] ===
        data[quizType][questionNumber - 1].answer
      ) {
        usersScore++;
        options[userAnswer].style.border = "2px solid green";
      } else {
        options[
          data[quizType][questionNumber - 1].choices.indexOf(
            data[quizType][questionNumber - 1].answer
          )
        ].style.border = "2px solid green";

        options[userAnswer].style.border = "2px solid red";
      }

      questionNumber++;
      submitBtn.removeEventListener("click", newQuiz.checkAnswer);
      clearInterval(timerInterval);
      userAnswer = undefined;
      nextBtn.style.display = "block";
    } else {
      window.alert("Choose an anwer before submitting");
    }
  }

  function displayQuizEnd() {
    if (quizType === "html") {
      showQuizType.innerHTML = `<i class="fa-brands fa-html5 mr-3"></i> HTML`;
    } else if (quizType === "css") {
      showQuizType.innerHTML = `<i class="fa-brands fa-css3-alt mr-3"></i> CSS`;
    } else {
      showQuizType.innerHTML = `<i class="fa-brands fa-js mr-3"></i> Javascript`;
    }

    score.textContent = usersScore;
    numberOfQuestion.textContent = `out of ${data[quizType].length}`;
  }

  // handles updating the progress bar
  function progressBar() {
    let progressBar = document.getElementById("progressBar");
    let progress = (questionNumber / data[quizType].length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  // returns quiz methods
  return {
    displayQuiz,
    getQuizType,
    checkAnswer,
    getSubmitedAnswer,
    startTimer,
  };
}

// new quiz instance
const newQuiz = quiz();

// btns for starting a quiz depending on the quiz type
quizBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    heroSection.style.display = "none";
    quizSection.style.display = "flex";
    let quizType = btn.getAttribute("data-quizType");
    newQuiz.getQuizType(quizType);
    newQuiz.displayQuiz();
  });
});

// next btn
nextBtn.addEventListener("click", () => {
  newQuiz.displayQuiz();
  submitBtn.addEventListener("click", newQuiz.checkAnswer);
  // newQuiz.progressBar();
});

// allows user to choose a option on btn click
options.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    newQuiz.getSubmitedAnswer(index);
  });
});
// submit answer functionality
submitBtn.addEventListener("click", newQuiz.checkAnswer);

playAgainBtn.addEventListener("click", () => {
  endScreen.style.display = "none";
  heroSection.style.display = "flex";
});
