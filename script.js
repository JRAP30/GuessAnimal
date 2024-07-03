const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const blurInitial = 24;
const picture_1 = {
    name: ["T", "I", "G", "E", "R"],
    source: "https://img.freepik.com/free-photo/amazing-bengal-tiger-nature_475641-1125.jpg",
    width: 350
};
const picture_2 = {
    name: ["E", "L", "E", "P", "H", "A", "N", "T"],
    source: "https://img.freepik.com/free-photo/elephant-artificial-intelligence-image_23-2150404858.jpg",
    width: 350
};
const picture_3 = {
    name: ["H", "I", "P", "P", "O", "P", "O", "T", "A", "M", "U", "S"],
    source: "https://img.freepik.com/free-photo/hippo-family-national-park-kenya-africa_167946-43.jpg",
    width: 350
};

//Game Constants
let games = [picture_1, picture_2, picture_3];
let lettersGuessed;
let finalWord;
let almostWord;
let blurArray;

// Transforms the animal name (finalWord) as blank boxes, with correct number of boxes for letters in word
function nameInBlank(finalWord) {
    let almostWord = [];
    for (let i = 0; i < finalWord.length; i++) {
        almostWord[i] = "▢";
    }
    return almostWord;
}

// Create the array with the blur values for the animal game (finalWord)
function makeBlur(finalWord) {
    let blurList = [blurInitial];
    let length = finalWord.length;
    const int = (blurInitial / length).toFixed(0);
    for (let i = 1; i <= length; i++) {
        blurList[i] = blurList[i - 1] - int;
    }
    blurList[length] = 0;
    const imageBlur = document.getElementById('image');
    imageBlur.style.filter = `blur(${blurInitial}px)`;
    blurList.shift();
    return blurList;
}

// Update image in html  
function image(componentId) {
    var imageElement = document.getElementById(componentId);
    var imageUrl = games[0].source;
    imageElement.src = games[0].source;
    imageElement.width = games[0].width;
    imageElement.height = games[0].width;
}

// Transform arrays into to a string, splited by the given separator. Update given component with result string
function presentArray(array, separator, componentId) {
    const infoComponent = document.getElementById(componentId);
    let almostInfo = "";
    for (let i = 0; i < array.length; i++) {
        if (i < array.length - 1) {
            almostInfo += array[i] + separator;
        }
        else {
            almostInfo += array[i];
        }
    }
    infoComponent.textContent = almostInfo;
}

// Initial function to configure the initial parameters of the game
function init() {
    lettersGuessed = [];
    finalWord = games[0].name;
    almostWord = nameInBlank(finalWord);
    blurArray = makeBlur(finalWord);
    image("image");
    presentArray(almostWord, " ", "word");
    presentArray(lettersGuessed, ", ", "letters-guessed");
}

//Update image blur during the current word, based in the blur array created in the function makeBlur 
function alterBlur(blurArray) {
    const imageBlur = document.getElementById('image');
    imageBlur.style.filter = `blur(${blurArray[0]}px)`;
    blurArray.shift();
}

//Hides a class for a given component 
function hideClass(componentId) {
    const element = document.getElementById(componentId);
    element.classList.add('hidden');
}

//Shows the class for a given component 
function showClass(componentId) {
    const element = document.getElementById(componentId);
    element.classList.remove('hidden');
}

//Evaluates almostWord. when almostWord is equal to finalWord will update the page based in the classToHide and classToShow
function winner(classToHide, classToShow, almostWord, finalWord) {
    let objective = almostWord.length;
    for (let i = 0; i < almostWord.length; i++) {
        if (almostWord[i] === finalWord[i]) {
            objective -= 1;
        }
    }
    if (objective === 0) {
        hideClass(classToHide);
        showClass(classToShow);
        presentArray(almostWord, " ", "word-final");
        image("image-final");
    }
}

//Returns true if the inputLetter is included in the alphabet, was not guessed and exists in the animal name (finalWord).
function checkLetter(inputLetter) {
    if (alphabet.includes(inputLetter) && !lettersGuessed.includes(inputLetter)) {
        lettersGuessed.push(inputLetter);
        if (finalWord.includes(inputLetter)) {
            return true;
        }
    }
    return false;
}

//Updates (almostWord) with the input letter, the blur of the image and the ongoing game word. 
function updateWord(letter) {
    for (let i = 0; i < finalWord.length; i++) {
        if (finalWord[i] === letter) {
            almostWord[i] = letter;
            alterBlur(blurArray);
        }
    }
    presentArray(almostWord, " ", "word");
}

//Clears input text box and the error message
function cleanInput() {
    setTimeout(function () {
        document.getElementById("letter").value = "";
        document.getElementById("message").style.backgroundColor = "#ffda62";
    }, 500)
}

//Reads the value from the input (Letter), 
//Evaluates and updates the screen using the functions checkLetter, updateWord, cleanInput, presentArray, winner
//Give the error message
function input() {
    let inputLetter = document.getElementById("letter").value.toUpperCase();
    if (checkLetter(inputLetter)) {
        updateWord(inputLetter);
    } else {
        document.getElementById("message").style.backgroundColor = "#003350";
    }
    cleanInput();
    presentArray(lettersGuessed, ", ", "letters-guessed");
    winner("game-page", "final-page", almostWord, finalWord);
}

//Gives a letter for help the user. Gives the first letter in the current word(almostWord) that is a "▢".
function hint(almostWord, finalWord) {
    const indexMin = almostWord.indexOf("▢");
    const letterMin = finalWord[indexMin];
    updateWord(letterMin);
    lettersGuessed.push(letterMin);
    presentArray(lettersGuessed, ", ", "letters-guessed");
    winner("game-page", "final-page", almostWord, finalWord);
}

//Deletes the first position of the games array, redefine the initial parameters using function ini() and update the screen using hideClass and showClass functions
document.getElementById('next-button').addEventListener('click', function () {
    games.shift();
    if (games.length > 0) {
        init();
        hideClass("final-page");
        showClass("game-page");
    }
    else {
        hideClass("final-page");
        showClass("congrats-page");
    }
});

//Creates the games array, redefine the initial parameters using function ini() and update the screen using hideClass and showClass functions
document.getElementById('again-button').addEventListener('click', function () {
    games = [picture_1, picture_2, picture_3];
    init();
    hideClass("congrats-page");
    showClass("game-page");
});

init();

