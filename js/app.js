

// * ----------------- GAME OBJECTS ----------------- * //

let gameControl = {
    gameRunning: false,
    colors: ["green", "red", "yellow", "blue"],
    goalOrder: [],
    userOrder: [],
    showPattern: 3
};

let sounds = {
    wrong: new Audio("sounds/wrong.mp3"),
    green: new Audio("sounds/green.mp3"),
    blue: new Audio("sounds/blue.mp3"),
    yellow: new Audio("sounds/yellow.mp3"),
    red: new Audio("sounds/red.mp3")
};

// * ----------------- EVENT LISTENERS ----------------- * //


//Initializes the game on click of a button, if game is not running

$(document).keydown(function (e) {
    if (!gameControl.gameRunning) {
        initGame();
    } else {
        let color = "";
        switch (e.key) {
            case ("w"):
            case ("ArrowUp"):
                color = "green";
                console.log(color);
                break;

            case ("a"):
            case ("ArrowLeft"):
                color = "red";
                console.log(color);
                break;

            case ("s"):
            case ("ArrowDown"):
                color = "blue";
                console.log(color);
                break;

            case ("d"):
            case ("ArrowRight"):
                color = "yellow";
                console.log(color);
                break;

            default:
                break;
        }
        if (color !== "") { processUserInput(color); }
    }
});


 // Processes button clicks if the game is running

$(".btn").click(function () {
    if (gameControl.gameRunning) {
        processUserInput(this.id);
    }
});


// Processes clicks on the "show pattern" button and calls the function showFullPattern()

$(".btn-show-pattern").click(function () {
    if (gameControl.gameRunning && gameControl.showPattern !== 0) {
        showFullPattern(this);
    }
});

// * ----------------- CONTROL FUNCTIONS ----------------- * //


// Initializes the game by setting the gameRunning attribute within the gameControl Object to "true"
// and by calling the functions addColor() and setLevel()

function initGame() {
    console.log("Init Game!");
    gameControl.gameRunning = true;
    $(".btn-show-pattern").text("Show full pattern (" + gameControl.showPattern + " left)");
    addColor();
    setLevel();
    console.log(gameControl.goalOrder);
}


// Pushes the chosen color of the user to the array gameControl.userOrder and compares it then to the generated Order
// If the input is correct (which is checked in the function checkArrays()) and the round is over, a new round will be initialized
// If the input is not correct, the gameControl object will be reset

 // @param {string} color The color the user has chosen *

function checkInput(color) {

    gameControl.userOrder.push(color);

    let roundIsOver = (gameControl.goalOrder.length === gameControl.userOrder.length);
    let orderWasCorrect = checkArrays();

    if (!orderWasCorrect) {
        console.log("Wrong :(");
        $("#level-title").text("Game Over! Press any button to restart");
        resetGameControl();
        sounds.wrong.play();
        $("body").addClass("game-over");
        setTimeout(() => $("body").removeClass("game-over"), 400);

    } else if (orderWasCorrect && roundIsOver) {
        console.log("Correct :)");
        $("#level-title").text("Correct :)");
        setTimeout(function () {
            addColor();
            setLevel();
            gameControl.userOrder = [];
        }, 800);

        if (gameControl.goalOrder.length % 3 === 0) {
            confetti.start();
            setTimeout(function () {
                confetti.stop();
            }, 1200);
        }
    }
}


// Shows the current correct pattern within gameControl.goalOrder to the user, if not all three tries are used up

// @param {object} obj The button object which was clicked on

function showFullPattern(obj) {
    gameControl.showPattern -= 1;
    obj.innerHTML = "Show full pattern (" + gameControl.showPattern + " left)";

    gameControl.goalOrder.forEach((color, i) => {
        setTimeout(() => {
            $("#" + color).fadeOut(250).fadeIn(250);
            playSound(color);
        }, i * 500);
    });
}


// * ----------------- HELPER FUNCTIONS ----------------- * //

// Adds a random color to the gameControl.goalOrder object by generating a number via the generateNumber()
//  function with which a color is picked from the gameControl.colors array

function addColor() {
    let colorToAdd = gameControl.colors[generateNumber()];
    gameControl.goalOrder.push(colorToAdd);
    playSound(colorToAdd);
    automaticClickAnimation(colorToAdd);
    console.log("Color added!");
}


// Returns a random number between 0 and the length of gameControl.colors array

// @return {number} between 0 and the length of gameControl.colors array

function generateNumber() {
    return Math.floor(Math.random() * gameControl.colors.length);
}


// Changes the #level-title text to the current level (the level = length of the gameControl.goalOrder array)

function setLevel() {
    console.log("Level Set!");
    $("#level-title").text("Level " + gameControl.goalOrder.length);
}


// Checks the arrays gameControl.userOrder and gameControl.goalOrder against each other after each color input
// @return {boolean} true if elements of array are equal, otherwise false

function checkArrays() {
    for (let i in gameControl.userOrder) {
        if (gameControl.goalOrder[i] !== gameControl.userOrder[i]) return false;
    }
    return true;
}


// Changes the #level-title text to the current level (the level = length of the gameControl.goalOrder array)
// @param {string} color The color of the sound that should be played

function playSound(color) {
    sounds[color].load();
    sounds[color].play();
}

// Resets the gameControl Object

function resetGameControl() {
    gameControl.gameRunning = false;
    gameControl.goalOrder = [];
    gameControl.userOrder = [];
    gameControl.showPattern = 3;
}


// Animates the clicked button
// @param {string} color The color of the button that should be animated

function automaticClickAnimation(color) {
    $("#" + color).addClass("pressed-comp");
    $("#" + color).fadeOut(200);
    setTimeout(() => $("#" + color).removeClass("pressed-comp"), 200);
    $("#" + color).fadeIn(200);
}


// Processes the user input
// @param {string} color The color of the button that should be processed

function processUserInput(color) {
    playSound(color);
    checkInput(color);
    console.log(gameControl.goalOrder);
    $("."+color).addClass(("pressed"));
    setTimeout(() => $("."+color).removeClass("pressed"), 100);
}
