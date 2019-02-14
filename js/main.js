//* Canvas setup
const canvasGfx = document.getElementById("canvasGfx");
const ctx = canvasGfx.getContext("2d");

//? resize canvas on window resize
{
    const dimention = 2 / 3; //pga. grid 2/3 * 1fr

    canvasGfx.width     = (window.outerWidth - 50)  * dimention;
    canvasGfx.height    = window.outerHeight * dimention;

    window.onresize = () => {
        //? HUSK å tegn canvas på nytt hvis resize
        canvasGfx.width     = (window.outerWidth  - 50)  * dimention;
        canvasGfx.height    = window.outerHeight * dimention;

        for (i in objects){
            objects[i].draw();
        }
    }
}

//? Psudo code:
{/*
    //* Beskrivelse
    input-område. bruker/velger skal kunne skrive inn et ord (i passord felt)
    eller trykke på en knapp som genererer et ord på valgt antall bokstaver.
    (AKA: 1 player og fler-player)

    input fra spiller er et (kort) inntastingsfelt, og enter skal sende
    bokstaven (eller kanskje stringen) som sjekkes av javascripten.
    (spesial-effects ?)

    generere dashed underscore per antall bokstaver i ordet. 

    Hvis bokstaven (/stringen) er i ordet skal den komme opp på canvas.
    ellers skal en bit tegnes videre på hang-mannen.

    implementasjon av vanskelighetsgrad er mulig, hvor mye skal tegnes
    for en feil kan endres.

    __________________
    //* Hvordan skrive det, hvilken strategi? OOP / funksjonell

    skal oppdateres hver gang canvas får nytt input. => oop?

    arv kanskje??
*/
}

//* Globals
const col1 = "#cdd";
const col2 = "#f65";
const objects = [];


class Figure {
    constructor(x, y, w, h, drawFromCenter, col, angle){
        this.w = w / 100 * canvasGfx.offsetWidth;
        this.h = h / 100 * canvasGfx.offsetHeight;
        if(drawFromCenter){
            this.x = x / 100 * canvasGfx.offsetWidth - this.w / 2;
            this.y = y / 100 * canvasGfx.offsetHeight - this.h / 2;
        }else if(!drawFromCenter){
            this.x = x / 100 * canvasGfx.offsetWidth;
            this.y = y / 100 * canvasGfx.offsetHeight;    
        }
        this.col = col;
        if(angle){
            this.angle = angle;
        }
    }

    draw(){
        if(this.angle){
            this.horizontalCenter    = this.x;//this.x + this.w/2;
            this.verticalCenter      = this.y;//this.y + this.h/2;
            //console.log(this.horizontalCenter, this.verticalCenter, this.x, this.y);
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

        let tommer = 
        canvasGfx.offsetWidth * canvasGfx.offsetWidth + 
        canvasGfx.offsetHeight * canvasGfx.offsetHeight;
        this.radius = radius;// / 1000 * Math.sqrt(tommer); //canvasGfx.offsetWidth;//
    }

    draw(){
        ctx.fillStyle = this.col;  
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        ctx.fill();
    }
}

//? Create objects
{
    //* hill
    objects.push(
        new Circle(
            50,
            170,
            700,
            col1
        )
    );
    //* main vertical pole
    objects.push(
        new Figure(
            40, 
            60, 
            2, 
            50,
            true, 
            col1
        )
    );
    //* main horizontal pole
    objects.push(
        new Figure(
            60, 
            36, 
            40, 
            2,
            true, 
            col1
        )
    );
    //* diagonal short pole
    objects.push(
        new Figure(
            44, 
            46, 
            8, 
            2,
            true, 
            col1,
            -45
        )
    );
    //* 2nd vertical pole
    objects.push(
        new Figure(
            75, 
            40, 
            1, 
            10,
            true, 
            col1
        )
    );
    //* n'eck
    objects.push(
        new Figure(
            75, 
            53, 
            1, 
            2,
            true, 
            col1
        )
    );
    //* head
    objects.push(
        new Circle(
            75,
            48,
            35,
            col2
        )
    );
    //* arm LEFT
    objects.push(
        new Figure(
            74, 
            58, 
            4, 
            1,
            true, 
            col1,
            -45
        )
    );
    //* arm RIGHT
    objects.push(
        new Figure(
            77.1, 
            53, 
            4, 
            1,
            true, 
            col1,
            45
        )
    );
    //* Torso
    objects.push(
        new Figure(
            75, 
            59, 
            2, 
            10,
            true, 
            col1
        )
    );
    //* leg LEFT
    objects.push(
        new Figure(
            74.7, 
            65, 
            1, 
            8,
            true, 
            col1,
            20
        )
    );
    //* leg RIGHT
    objects.push(
        new Figure(
            75.2, 
            66, 
            1, 
            8,
            true, 
            col1,
            -20
        )
    );
    
}

//? Draw objects
for (i in objects){
    objects[i].draw();
}

