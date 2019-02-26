//* Canvas setup
const canvasGfx = document.getElementById("canvasGfx");
const ctx = canvasGfx.getContext("2d");

//? resize canvas on window resize
{
    //  let windowW = window.outerWidth;
    //  let windowH = window.outerHeight;

    let canvW = 600;
    let canvH = 400;

    canvasGfx.height = canvH;
    canvasGfx.width  = canvW;
}

//? Psudo code:
{/*
    lage klasser for delene av hangman-figuren

    push to array, draw 1 hver gang gjetter feil

    klasse for å lage nye hang-ord-objekter
    - holde strengen av bokstaver (hang-ordet)
    - draw() function
    - check if input is in hang-ord
    - check for victory conditions etc.

    håndtere input fra bruker u/submit-knapp (bruke enter)
    - sette/skrive inn hang-word i passord format

    knapp for å se hang-word (fasit/reveal)

    liste over gjettede bokstaver/ord

    antall forsøk igjen

    slutt-skjerm (vant / tapte)
*/
}

//* Import UI
const userInput = document.getElementById("userInput");
const setWord = document.getElementById("setWord");
const revealWord = document.getElementById("revealWord");
const currentGuessesLeft = document.getElementById("currentGuessesLeft");
const listOfGuessed = document.getElementById("listOfGuessed");

//* Globals
const col1 = "#cdd";
const col2 = "#f65";
const objects = [];
let objectsDrawn = 0;

setWord.focus();

class Figure {
    constructor(x, y, w, h, drawFromCenter, col, angle){
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        if(drawFromCenter){
            this.x += - this.w / 2;
            this.y += - this.h / 2;
        }
        this.col = col;
        if(angle){this.angle = angle;}
    }

    draw(){

        //* rotata canvas by angle
        if(this.angle){
            this.horizontalCenter    = this.x;
            this.verticalCenter      = this.y;
            // console.log(this.horizontalCenter, this.verticalCenter, this.x, this.y);

            ctx.translate(this.horizontalCenter, this.verticalCenter);
            ctx.rotate(this.angle * Math.PI / 180);//(-Math.PI / 4); //| * Math.PI / 180
            ctx.translate(-this.horizontalCenter, -this.verticalCenter);
        }

        ctx.fillStyle = this.col;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        //* reset canvas
        if(this.angle){
            ctx.translate(this.horizontalCenter, this.verticalCenter);
            ctx.rotate(-this.angle * Math.PI / 180);//(Math.PI / 4);
            ctx.translate(-this.horizontalCenter, -this.verticalCenter);
        }
    }
};

class Circle extends Figure {
    constructor(x, y, radius, col){
        super(x, y, radius, radius, false, col);
        this.radius = radius;
    }

    draw(){
        ctx.fillStyle = this.col;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        ctx.fill();
    }
}

const drawCurrentGuesses = guesses => {
    currentGuessesLeft.innerHTML = `Chanses left: ${parseInt(guesses)}`;
};

const insertIntoListOfGuessed = guessed => {

    let liNode = document.createElement("li");

    liNode.innerHTML = String(guessed);

    listOfGuessed.appendChild(liNode);
};

//? Create objects
{
    //* hill
    objects.push(
        new Circle(
            300,
            700,
            400,
            col1
        )
    );
    //* main vertical pole
    objects.push(
        new Figure(
            230,
            220,
            15,
            250,
            true,
            col1
        )
    );
    //* main horizontal pole
    objects.push(
        new Figure(
            323,
            100,
            200,
            15,
            true,
            col1
        )
    );
    //* diagonal short pole
    objects.push(
        new Figure(
            250,
            140,
            50,
            15,
            true,
            col1,
            -45
        )
    );
    //* 2nd vertical pole
    objects.push(
        new Figure(
            400,
            120,
            7,
            40,
            true,
            col1
        )
    );
    //* n'eck
    objects.push(
        new Figure(
            400,
            170,
            5,
            15,
            true,
            col1
        )
    );
    //* head
    objects.push(
        new Circle(
            400,
            150,
            20,
            col2
        )
    );
    //* arm LEFT
    objects.push(
        new Figure(
            401,
            198,
            7,
            50,
            true,
            col1,
            30
        )
    );
    //* arm RIGHT
    objects.push(
        new Figure(
            401,
            198,
            7,
            50,
            true,
            col1,
            -30
        )
    );
    //* Torso
    objects.push(
        new Figure(
            401,
            200,
            15,
            40,
            true,
            col1
        )
    );
    //* leg LEFT
    objects.push(
        new Figure(
            401,
            230,
            10,
            40,
            true,
            col1,
            20
        )
    );
    //* leg RIGHT
    objects.push(
        new Figure(
            401,
            233,
            10,
            40,
            true,
            col1,
            -20
        )
    );

}

//? Draw all objects / hangman
const drawAll = () => {
    for (i in objects){
        objects[i].draw();
    }
}
//drawAll();

class HangmanString {
    constructor(stringArr){
        this.w = 500;
        this.h = 50;
        this.x = 50;
        this.y = 30;
        this.hangStringArr = stringArr;
    };

    drawUnderline(){
        //* Clear canvas
        ctx.clearRect(0, 0, 1000, 1000);

        //* Reset chanses left
        objectsDrawn = 0;
        drawCurrentGuesses(objects.length - objectsDrawn);

        //* Reset guessed list
        listOfGuessed.innerHTML = "";

        //* outline
        ctx.strokeStyle = col1;
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        let iw = this.w / this.hangStringArr.length;
        let ih = 5;//this.h;// / this.hangStringArr.length;
        let spacing = 2 + 50 * Math.pow(Math.E, -this.hangStringArr.length);
        spacing = Math.floor(spacing * 10) / 10;

        for(i in this.hangStringArr){
            ctx.fillStyle = col2; //"#" + (i * 100 + 100); -red gradient

            let ix = this.x + i * (this.w / this.hangStringArr.length);

            ctx.fillRect(
                ix + spacing,
                this.y + this.h - ih,
                iw - 2*spacing,
                ih
            );
        }
    };

    drawLetter(inputArr){

        let hangString = "";
        let inputString = "";
        this.hangStringArr.forEach(char => hangString += char);
        inputArr.forEach(char => inputString += char);

        if(inputArr.length > 1){
            //| CHECK if input == hangstring

            if(inputString == hangString){
                console.log("Winner!");
                alert("You Won!", "The word was :" + hangString);
                drawAll();
            }

        }else if(inputArr.length == 1){
            //| for 1 char

            let tempHangString = hangString;
            //console.log(hangString.indexOf(inputArr));
            let indexesOfCharInHangString = [];


            while(hangString.indexOf(inputArr) != -1 && i < 100){
                
                i++;
                
                indexesOfCharInHangString.push(hangString.indexOf(inputArr) + tempHangString.indexOf(hangString));

                hangString = hangString.slice(hangString.indexOf(inputArr)+1, hangString.length);
                //console.log(inputString, hangString, hangString.indexOf(inputString), hangString.length);
                //console.log(tempHangString.indexOf(hangString), tempHangString, hangString);

            }
            console.log(indexesOfCharInHangString);

            if(indexesOfCharInHangString.length < 1){
                //| No match, draw object
                console.log("No match!");
                objects[objectsDrawn].draw();
                objectsDrawn++;
            }else{
                for(i in indexesOfCharInHangString){
                    //console.log(this.hangStringArr[indexesOfCharInHangString[i]], this.x, this.y);
                    ctx.font = "30px Arial"; //`${this.w/ this.hangStringArr.length - 30}px Arial`;
                    ctx.fillStyle = col1;
                    ctx.fillText(
                        this.hangStringArr[indexesOfCharInHangString[i]],
                        this.x 
                            + indexesOfCharInHangString[i] 
                            * (this.w / this.hangStringArr.length) 
                            + (this.w / this.hangStringArr.length / 2) 
                            - 10,
                        this.y 
                            + this.h 
                            - 15
                    );

                    arrOfRightChars[indexesOfCharInHangString[i]] = this.hangStringArr[indexesOfCharInHangString[i]];
                    // console.log(
                    //     arrOfRightChars, 
                    //     hangmanString.hangStringArr, 
                    //     (String(arrOfRightChars) == String(hangmanString.hangStringArr)));
                    
                }
                if(String(arrOfRightChars) == String(hangmanString.hangStringArr)){
                    console.log("Winner!");
                    alert("You Won!", "The word was :" + hangString);
                    drawAll();
                }
            }

        }
        
        //* Update chances left
        drawCurrentGuesses(objects.length - objectsDrawn);

        //* Add to list of guessed
        insertIntoListOfGuessed(inputString);
    }

};


window.addEventListener("keydown", (e) => {
    if(
        //* Guess
        e.keyCode === 13 &&
        userInput === document.activeElement &&
        userInput.value != ""
    ){
        let string = userInput.value;
        let newString = new Array(string.length);

        for(i in string){
            //* 65 - 122  => A - z
            if(string.charCodeAt(i) >= 65 && string.charCodeAt(i) <= 122){
                newString[i] = string[i];
                //console.log("good!");
            }else{
                newString[i] = "X";
                //console.log("bad!");
            }
        }

        for(i in newString){
            newString[i] = newString[i].toUpperCase();
        }

        //console.log(string, newString);

        hangmanString.drawLetter(newString);

        userInput.value = "";

    }else if(
        //* Set
        e.keyCode === 13 &&
        setWord === document.activeElement &&
        setWord.value != ""
    ){
        let hangWord = setWord.value;
        let hangString = "";
        hangWord = hangWord.toUpperCase();

        hangWord = hangWord.split(" ");
        hangWord.forEach(subString => {
            hangString += subString;
        });

        hangWord = [];
        // hangString.forEach( letter => {
        //     hangWord += letter;
        // });
        for(i in hangString){
            hangWord.push(hangString[i]);
        }


        window.hangmanString = new HangmanString(
            hangWord//["S", "U", "P", "E", "R"]
        );
        hangmanString.drawUnderline();
        // console.log(hangWord, hangString, hangmanString);

        window.arrOfRightChars = new Array(hangWord.length);
        setWord.value = "";
        userInput.focus();
    }
});

revealWord.onclick = () => {
    //console.log(hangmanString.hangStringArr);
    if(hangmanString.hangStringArr.length < 1){

        let tempString = "";
        hangmanString.hangStringArr.forEach(letter => {
            tempString += letter;
        });
        revealWord.innerHTML = tempString;
    }
}