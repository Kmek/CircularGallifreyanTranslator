// Circular Gallifreyan javascript

/****************************************
 * Canvas Setup
****************************************/
// Canvas setup
const canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.lineWidth = 2;
ctx.scale(1, 1);
var w = ctx.canvas.width;
var h = ctx.canvas.height;
  
// Scale the drawing, but not repeatively
var prevS = 1;
function scale(s) {
    // undo previous scale
    ctx.scale((1/prevS), (1/prevS));
    w = ctx.canvas.width * prevS;
    h = ctx.canvas.height * prevS;
    // Set new scale
    ctx.scale(s, s);
    w = ctx.canvas.width / s;
    h = ctx.canvas.height / s;
    prevS = s;
}

/****************************************
 * Canvas Colors
****************************************/
// Ground Color
var background = "#0d0d2a";
canvas.style.background = background;

// Define textColor before its first use
var textColor;

// Background color picker 1
const backColorPicker1 = document.getElementById("backColor1");
let back1 = backColorPicker1.value;
backColorPicker1.onchange = function() {
    back1 = this.value;
    makeBackGradient();
    drawAllCircles();
};
// Background color picker 2
const backColorPicker2 = document.getElementById("backColor2");
let back2 = backColorPicker2.value;
backColorPicker2.onchange = function() {
    back2 = this.value;
    makeBackGradient();
    drawAllCircles();
};
// Gradient for the background
function makeBackGradient() {
    let gradient = ctx.createRadialGradient(w/2, h/2, 1,  w/2, h/2, w/2);
    gradient.addColorStop(0, back2);
    gradient.addColorStop(1, back1);
    
    background = gradient;
}
makeBackGradient();

// Text color picker 1 for first gradient color
const textColorPicker1 = document.getElementById("textColor1");
var text1 = textColorPicker1.value;
textColorPicker1.onchange = function() {
    text1 = this.value;
    makeTextGradient();
    drawAllCircles();
};
// Text color picker 2 for second gradient color
const textColorPicker2 = document.getElementById("textColor2");
var text2 = textColorPicker2.value;
textColorPicker2.onchange = function() {
    text2 = this.value;
    makeTextGradient();
    drawAllCircles();
};
// Text gradient (turned out to look silvery, didn't originally mean this but I really like it)
function makeTextGradient() {
    // Create gradient
    let gradient = ctx.createLinearGradient(0, 0, w, h);
    let stops = 20;
    // Fill gradient with aternating colors
    for (i = 0; i < stops; i++) {
        let color = text1;
        if ((i % 2) == 1) {
            color = text2;
        }
        let x = (i * (1 / stops)) + (0.5 / stops);
        gradient.addColorStop(x, color);
    }
    // Assign textcolor the gradient
    textColor = gradient;
}
makeTextGradient();

/****************************************
 * Drawing Functions
****************************************/
// Random number given a range
function randNum(min, max) {
    let dif = Math.abs(max - min);
    return ((dif * Math.random()) + min);
}

// For functions drawing on the canvas
const draw = {
    circle: function(xy, radius, color) {
        ctx.beginPath();
        ctx.arc(xy[0], xy[1], radius, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.stroke();
    },
    arc: function(xy, stroke, radius, start, end, color) {
        ctx.beginPath();
        ctx.arc(xy[0], xy[1], radius + 1 + stroke, toRadians(start), toRadians(end));
        ctx.strokeStyle = color;
        ctx.lineWidth = stroke*2;
        ctx.stroke();
        ctx.lineWidth = 2;
        ctx.strokeStyle = textColor;
    },
    text: function(xy, fontsize, text) {
        ctx.font = fontsize + "px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = textColor;
        ctx.fillText(text, xy[0], xy[1]);
    },
    line: function(xy1, xy2) {
        ctx.beginPath();
        ctx.moveTo(xy1[0], xy1[1]);
        ctx.lineTo(xy2[0], xy2[1]);
        ctx.stroke();
    },
    lines: function(number, centerXY, mainR, size, degree) {
        if (number == 1 || number == 3) {
            draw.line(toPolar(size, degree+180, centerXY), toPolar((size + randNum(10, mainR/3)), degree+180, centerXY));
        }
        if (number == 2 || number == 3) {
            let variety = randNum(0, 10);
            draw.line(toPolar(size, degree+170-variety, centerXY), toPolar((size + randNum(10, mainR/4)), degree+170, centerXY));
            draw.line(toPolar(size, degree+190+variety, centerXY), toPolar((size + randNum(10, mainR/4)), degree+190, centerXY));
        }
    },
    dot: function(xy, radius, color) {
        ctx.beginPath();
        ctx.arc(xy[0], xy[1], radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    },
    dots: function(number, centerXY, radius, degree) {
        radius -= 6;
        if (number == 1 || number == 3) {
            draw.dot(toPolar(radius, degree+180, centerXY), 2, textColor);
        }
        if(number == 2 || number == 3) {
            let variety = randNum(0, 30);
            draw.dot(toPolar(radius, degree+145-variety, centerXY), 2, textColor);
            draw.dot(toPolar(radius, degree+215+variety, centerXY), 2, textColor);
        }
    },
    empty: function() {
        ctx.beginPath();
        ctx.rect(0, 0, w, h);
        ctx.fillStyle = background;
        ctx.fill();
    },
    
    // Vowels, little circles
    a: function(mainXY, mainR, degree) {
        draw.circle(toPolar((mainR+10), degree, mainXY), 5, textColor);
    },
    e: function(mainXY, mainR, degree) {
        draw.circle(toPolar((mainR), degree, mainXY), 5, textColor);
    },
    i: function(mainXY, mainR, degree) {
        draw.e(mainXY, mainR, degree);
        draw.lines(1, toPolar((mainR), degree, mainXY), mainR, 5, degree);
    },
    o: function(mainXY, mainR, degree) {
        draw.circle(toPolar((mainR-10), degree, mainXY), 5, textColor);
    },
    u: function(mainXY, mainR, degree) {
        draw.e(mainXY, mainR, degree);
        draw.line(toPolar((mainR+5), degree, mainXY), toPolar(mainR + randNum(10, mainR/3), degree, mainXY));
    },
    
    // Letters, circle edge merged with main circle
    b: function(mainXY, mainR, degree, size) {
        draw.circle(toPolar((mainR-size), degree, mainXY), size, textColor);
        draw.dot(toPolar((mainR), degree, mainXY), size / 3, background);
    },
    c: function(mainXY, mainR, degree, size) {
        draw.b(mainXY, mainR, degree, size);
        draw.dots(2, toPolar((mainR-size), degree, mainXY), size, degree);
    },
    d: function(mainXY, mainR, degree, size) {
        draw.b(mainXY, mainR, degree, size);
        draw.dots(3, toPolar((mainR-size), degree, mainXY), size, degree);
    },
    g: function(mainXY, mainR, degree, size) {
        draw.b(mainXY, mainR, degree, size);
        draw.lines(1, toPolar((mainR-size), degree, mainXY), mainR, size, degree);
    },
    h: function(mainXY, mainR, degree, size) {
        draw.b(mainXY, mainR, degree, size);
        draw.lines(2, toPolar((mainR-size), degree, mainXY), mainR, size, degree);
    },
    f: function(mainXY, mainR, degree, size) {
        draw.b(mainXY, mainR, degree, size);
        draw.lines(3, toPolar((mainR-size), degree, mainXY), mainR, size, degree);
    },
    
    // Letters, circle inside main circle   
    j: function(mainXY, mainR, degree, size) {
        draw.circle(toPolar((mainR - (size + 3)), degree, mainXY), size, textColor);
    },
    ph: function(mainXY, mainR, degree, size) {
        draw.j(mainXY, mainR, degree, size);
        draw.dots(1, toPolar((mainR - (size + 3)), degree, mainXY), size, degree);
    },
    k: function(mainXY, mainR, degree, size) {
        draw.j(mainXY, mainR, degree, size);
        draw.dots(2, toPolar((mainR - (size + 3)), degree, mainXY), size, degree);
    },
    l: function(mainXY, mainR, degree, size) {
        draw.j(mainXY, mainR, degree, size);
        draw.dots(3, toPolar((mainR - (size + 3)), degree, mainXY), size, degree);
    },
    
    n: function(mainXY, mainR, degree, size) {
        draw.j(mainXY, mainR, degree, size);
        draw.lines(1, toPolar((mainR - (size + 3)), degree, mainXY), mainR, size, degree);
    },
    p: function(mainXY, mainR, degree, size) {
        draw.j(mainXY, mainR, degree, size);
        draw.lines(2, toPolar((mainR - (size + 3)), degree, mainXY), mainR, size, degree);
    },
    m: function(mainXY, mainR, degree, size) {
        draw.j(mainXY, mainR, degree, size);
        draw.lines(3, toPolar((mainR - (size + 3)), degree, mainXY), mainR, size, degree);
    },
    
    // Letters, semiceircle merged with main circle
    t: function(mainXY, mainR, degree, range, size){
        // Erases hole in main circle
        draw.dot(toPolar(mainR, degree, mainXY), size, background);
        // Draws a circle for an even arc
        draw.circle(toPolar((mainR), degree, mainXY), size, textColor);
        // Erases half the circle using an arc
        range = range * (size / calcArcLength(range, mainR)) + 5;
        draw.arc(mainXY, size/1.5, mainR, (degree+(range/2))*-1, (degree-(range/2))*-1, /*"green");//*/ background);
    },
    wh: function(mainXY, mainR, degree, range, size) {
        draw.t(mainXY, mainR, degree, range, size);
        draw.dots(1, toPolar(mainR, degree, mainXY), size, degree);
    },
    sh: function(mainXY, mainR, degree, range, size) {
        draw.t(mainXY, mainR, degree, range, size);
        draw.dots(2, toPolar(mainR, degree, mainXY), size, degree);
    },
    r: function(mainXY, mainR, degree, range, size) {
        draw.t(mainXY, mainR, degree, range, size);
        draw.dots(3, toPolar(mainR, degree, mainXY), size, degree);
    },
    v: function(mainXY, mainR, degree, range, size) {
        draw.t(mainXY, mainR, degree, range, size);
        draw.lines(1, toPolar((mainR), degree, mainXY), mainR, size, degree);
    },
    w: function(mainXY, mainR, degree, range, size) {
        draw.t(mainXY, mainR, degree, range, size);
        draw.lines(2, toPolar((mainR), degree, mainXY), mainR, size, degree);
    },
    s: function(mainXY, mainR, degree, range, size) {
        draw.t(mainXY, mainR, degree, range, size);
        draw.lines(3, toPolar((mainR), degree, mainXY), mainR, size, degree);
    },
    
    // Letters, circle on main circle
    th: function(mainXY, mainR, degree, size) {
        draw.circle(toPolar((mainR), degree, mainXY), size, textColor);
    },
    gh: function(mainXY, mainR, degree, size) {
        draw.th(mainXY, mainR, degree, size);
        draw.dots(1, toPolar((mainR), degree, mainXY), size, degree);
    },
    y: function(mainXY, mainR, degree, size) {
        draw.th(mainXY, mainR, degree, size);
        draw.dots(2, toPolar((mainR), degree, mainXY), size, degree);
    },
    z: function(mainXY, mainR, degree, size) {
        draw.th(mainXY, mainR, degree, size);
        draw.dots(3, toPolar((mainR), degree, mainXY), size, degree);
    },
    q: function(mainXY, mainR, degree, size) {
        draw.th(mainXY, mainR, degree, size);
        draw.lines(1, toPolar((mainR), degree, mainXY), mainR, size, degree);
    },
    x: function(mainXY, mainR, degree, size) {
        draw.th(mainXY, mainR, degree, size);
        draw.lines(2, toPolar((mainR), degree, mainXY), mainR, size, degree);
    },
    ng: function(mainXY, mainR, degree, size) {
        draw.th(mainXY, mainR, degree, size);
        draw.lines(3, toPolar((mainR), degree, mainXY), mainR, size, degree);
    },
};

/****************************************
 * Button and checkbox functions
****************************************/
// Toggles menu visibility
const menu = document.getElementById("menuDiv");
function toggleMenu() {
    if (menuDiv.style.visibility == 'visible') {
        menuDiv.style.visibility = 'hidden';
    }
    else {
        menuDiv.style.visibility = 'visible';
    }
}

// Show/hide letter labels & redraw
const showLetters = document.getElementById("showLetters");
showLetters.onclick = function() {
    calcAndDrawCircles();
};

// Show/hide word labels & redraw
const showWords = document.getElementById("showWords");
showWords.onclick = function() {
    calcAndDrawCircles();
};

// Show/hide title & redraw
const showTitle = document.getElementById("showTitle");
showTitle.onclick = function() {
    drawAllCircles();
};

// Show/hide the alphabet
const showAlphabet = document.getElementById("showAlphabet");
showAlphabet.onclick = function() {
    if (showAlphabet.checked) {
        spiral.checked = true;
        spiralSlide.value = 21;
        spiralScale.value = 0;
        scaleSize.value = 75;
        createCircles("a b c d e f g 1 h i j k l m n 2 o p 3 q r s 4 t 5 u v w 6 x y z");
    }
    else {
        getText();
    }
};

// Gets text from the textinput and creates circles
const textbox = document.getElementById("textbox");
function getText() {
    if (textbox.value.length >= 1 && !showAlphabet.checked) {
        createCircles(textbox.value);
    }
}

// Show/hide word labels & redraw
const spiral = document.getElementById("formSpiral");
spiral.onclick = function() {
    calcAndDrawCircles();
};

// Changes the total degrees used on the spiral to change the spacing between circles
const spiralSlide = document.getElementById("spiralDegrees");
spiralSlide.oninput = function() {
    if (spiral.checked) {
        calcAndDrawCircles();
    }
};

// Change the extra subtraction to the radius of the spiral, to exxagerate the spiral
const spiralScale = document.getElementById("scaleSpiral");
spiralScale.oninput = function() {
    calcAndDrawCircles();
};

// Changes the scale of the canvas
const scaleSlide = document.getElementById("scaleSize");
scaleSlide.oninput = function() {
    makeBackGradient();
    makeTextGradient();
    calcAndDrawCircles();
};

// Change the height of the canvas
const inputHeight = document.getElementById("inputH");
inputHeight.oninput = function() {
    scale(1);
    canvas.height = inputHeight.value;
    makeBackGradient();
    makeTextGradient();
    calcAndDrawCircles();
};

// Change the width of the canvas
const inputWidth = document.getElementById("inputW");
inputWidth.oninput = function() {
    scale(1);
    canvas.width = inputWidth.value;
    makeBackGradient();
    makeTextGradient();
    calcAndDrawCircles();
};

/****************************************
 * Converting coordinates helper functions
****************************************/
// For converting between radians and degrees
function toRadians(degrees) {
    return (degrees * (Math.PI / 180));
}
function toDegrees(radians) {
    return Math.round((radians * (180 / Math.PI) * 100) / 100 );
}

// For converting from polar to rectanguar coordinates
function toPolarX(radius, degrees, centerOn) {
    var temp = radius * Math.cos(toRadians(degrees));
    temp += centerOn;
    temp = Math.round(temp * 100) / 100; 
    return (temp);
}
function toPolarY(radius, degrees, centerOn) {
    let temp = radius * Math.sin(toRadians(degrees) * -1);
    temp += centerOn;
    temp = Math.round(temp * 100) / 100; 
    return (temp);
}
function toPolar(radius, degrees, centerOn) {
    let temp = [toPolarX(radius, degrees, centerOn[0]), toPolarY(radius, degrees, centerOn[1])];
    return temp;
}

// For finding the length of a section of a circle
function calcArcLength(degrees, radius) {
    return (toRadians(degrees) * (radius/2));
}
function calcArcDegree(arc, radius) {
    return (toDegrees(arc / radius));
}

// For finding the side of an ambiguous triangle
function calcTriSide(degA, sideBC) {
    let degBC = (180 - degA) / 2;
    let sideA = (sideBC / Math.sin(toRadians(degBC)) * Math.sin(toRadians(degA)));
    sideA = Math.round(sideA * 100) / 100;
    return sideA;
}
//for finding the longer side of an ambiguous triangle (the circle radius)
function calcTriRadius(degA, sideA) {
    let degBC = (180 - degA) / 2;
    let sideBC = (sideA / Math.sin(toRadians(degA)) * Math.sin(toRadians(degBC)));
    sideBC = Math.round(sideBC * 100) / 100;
    return sideBC;
}

// Calc spiral radius at degree
function spiralRadius(w, deg) {
    let radians = toRadians(deg + 360);
    return (w * Math.pow(Math.E, (-0.1 * radians)));
}

/****************************************
 * Circle Class
****************************************/
// Array for keeping each circle
var circles = [];
// Array of all the words
var words = [];
let original;

// Block base
class Circle {
    constructor(circleNum, word) {
        this.circleNum = circleNum;
        this.word = word;
        this.degree = -90;
        // Radius equals (min-letter-arclength / averange-radianss-per-letter) + extra-20px
        this.radius = (40 / toRadians(360 / word.length)) + 20; 
        this.x = 0;
        this.y = 0;
        this.ranges = [];
    }
    
    // Calculate the degree range for each letter, adds variety
    calcRanges() {
        if (this.word.length == 1) {
            this.ranges[0] = 190;
        }
        else {
            // Vowels get 10px, consonants get 
            let vowelDeg = calcArcDegree(10, this.radius);
            let consonantDeg = calcArcDegree(40, this.radius);
            let totalDeg = 0;
            
            // Calc minimum letter degree here and use variable
            for (let i = 0; i < this.word.length; i++) {
                let letter = this.word.charAt(i);
                // Vowel degree range
                if (letter == "a" || letter == "e" || letter == "i" || letter == "o" || letter == "u") {
                    this.ranges[i] = vowelDeg;
                    totalDeg += vowelDeg;
                }
                // Consonant degree range
                else {
                    this.ranges[i] = consonantDeg;
                    totalDeg += consonantDeg;
                }
            }
            
            // Add a little variety to each range to fill 360 degrees
            do {
                for (let i = 0; i < this.ranges.length; i++) { 
                    // Temp variable to set ranges and totalDeg to the same number
                    let tempDeg = Math.round(randNum(0, vowelDeg) * 1000) / 1000;
                    
                    this.ranges[i] += tempDeg;
                    totalDeg += tempDeg;
                    if (totalDeg >= 360) {
                        this.ranges[i] -= (totalDeg - 360);
                        totalDeg = 360;
                        break;
                    }
                }
            }
            while(totalDeg < 360);
        }
    }
    
    // Draw everything for this circle
    draw() {
        // First get x and y if they aren't calculated yet
        if (this.x === 0 & this.y === 0) {
            //this.calcCircleXY();
        }
        // Draw base circle
        draw.circle([this.x, this.y], this.radius, textColor);
        
        this.calcRanges();
        let currentDeg = -90 - (this.ranges[0] / 2);
        
        // Determine scale to prevent letters from overlapping in small circles
        let size, sizeScale;
        if (this.word.length == 1) {
            sizeScale = 0.8;
        }
        else if (this.word.length < 6) {
            sizeScale = 3 / 5;
        }
        else if (this.word.length < 10) {
            sizeScale =  2 / 3;
        }
        else if (this.word.length < 16) {
            sizeScale =  5 / 6; //4 / 5;
        }
        else {
            sizeScale = 1;
        }
        
        // Draw letters
        for (let i = 0; i < this.word.length; i++) {
            currentDeg += (this.ranges[i] / 2);
            
            // Determine size, use sizeScale to prevent letters from overlapping
            size = (calcTriSide(this.ranges[i], (this.radius * sizeScale)) / 2) - 4;
            
            switch(this.word.charAt(i)) {
                case "a": 
                    draw.a([this.x, this.y], this.radius, currentDeg);
                    break;
                case "b":
                    draw.b([this.x, this.y], this.radius, currentDeg, size-2);
                    break;
                case "c":
                    draw.c([this.x, this.y], this.radius, currentDeg, size-2);
                    break;
                case "d":
                    draw.d([this.x, this.y], this.radius, currentDeg, size-2);
                    break;
                case "e":
                    draw.e([this.x, this.y], this.radius, currentDeg);
                    break;
                case "f":
                    draw.f([this.x, this.y], this.radius, currentDeg, size-6);
                    break;
                case "g":
                    draw.g([this.x, this.y], this.radius, currentDeg, size-6);
                    break;
                case "h":
                    draw.h([this.x, this.y], this.radius, currentDeg, size-6);
                    break;
                case "i":
                    draw.i([this.x, this.y], this.radius, currentDeg);
                    break;
                case "j":
                    draw.j([this.x, this.y], this.radius, currentDeg, size-2);
                    break;
                case "k":
                    draw.k([this.x, this.y], this.radius, currentDeg, size-2);
                    break;
                case "l":
                    draw.l([this.x, this.y], this.radius, currentDeg, size-2);
                    break;
                case "m":
                    draw.m([this.x, this.y], this.radius, currentDeg, size-2);
                    break;
                case "n":
                    draw.n([this.x, this.y], this.radius, currentDeg, size-2);
                    break;
                case "o":
                    draw.o([this.x, this.y], this.radius, currentDeg);
                    break;
                case "p":
                    draw.p([this.x, this.y], this.radius, currentDeg, size-2);
                    break;
                case "q":
                    draw.q([this.x, this.y], this.radius, currentDeg, size);
                    break;
                case "r":
                    draw.r([this.x, this.y], this.radius, currentDeg, this.ranges[i], size);
                    break;
                case "s":
                    draw.s([this.x, this.y], this.radius, currentDeg, this.ranges[i], size);
                    break;
                case "t":
                    draw.t([this.x, this.y], this.radius, currentDeg, this.ranges[i], size);
                    break;
                case "u":
                    draw.u([this.x, this.y], this.radius, currentDeg);
                    break;
                case "v":
                    draw.v([this.x, this.y], this.radius, currentDeg, this.ranges[i], size);
                    break;
                case "w":
                    draw.w([this.x, this.y], this.radius, currentDeg, this.ranges[i], size);
                    break;
                case "x":
                    draw.x([this.x, this.y], this.radius, currentDeg, size);
                    break;
                case "y":
                    draw.y([this.x, this.y], this.radius, currentDeg, size);
                    break;
                case "z":
                    draw.z([this.x, this.y], this.radius, currentDeg, size);
                    break;
                case "1":
                    draw.gh([this.x, this.y], this.radius, currentDeg, size);
                    break;
                case "2":
                    draw.ng([this.x, this.y], this.radius, currentDeg, size);
                    break;
                case "3":
                    draw.ph([this.x, this.y], this.radius, currentDeg, size-2);
                    break;
                case "4":
                    draw.sh([this.x, this.y], this.radius, currentDeg, this.ranges[i], size);
                    break;
                case "5":
                    draw.th([this.x, this.y], this.radius, currentDeg, size);
                    break;
                case "6":
                    draw.wh([this.x, this.y], this.radius, currentDeg, this.ranges[i], size);
                    break;
                case ";":
                    draw.dot(toPolar(this.radius-7, currentDeg, [this.x, this.y]), 2, textColor);
                    break;
                case "?":
                    draw.dot(toPolar(this.radius-7, currentDeg+(size/this.radius*50), [this.x, this.y]), 2, textColor);
                    draw.dot(toPolar(this.radius-7, currentDeg-(size/this.radius*50), [this.x, this.y]), 2, textColor);
                    break;
                case "!":
                    //draw.dots(3, [this.x, this.y], (this.radius-20)*-1, currentDeg);
                    draw.dot(toPolar(this.radius-7, currentDeg+(size/this.radius*50), [this.x, this.y]), 2, textColor);
                    draw.dot(toPolar(this.radius-7, currentDeg, [this.x, this.y]), 2, textColor);
                    draw.dot(toPolar(this.radius-7, currentDeg-(size/this.radius*50), [this.x, this.y]), 2, textColor);
                    break;
                case '"':
                    draw.lines(1, [this.x, this.y], 0, this.radius, currentDeg+180);
                    break;
                case "'":
                    draw.lines(2, [this.x, this.y], 0, this.radius, currentDeg+180);
                    break;
                case "-":
                    draw.lines(3, [this.x, this.y], 0, this.radius, currentDeg+180);
                    break;
                case ",":
                    draw.dot(toPolar(this.radius, currentDeg, [this.x, this.y]), 3.5, textColor);
                    break;
                case ".":
                    draw.circle(toPolar(this.radius, currentDeg, [this.x, this.y]), 3.5, textColor);
                    break;
                default: 
                    break;
            }
            // Show letters if needed
            if (showLetters.checked) {
                // Print the double letter, not it's corresponding number
                let letter = this.word.charAt(i);
                if (letter == 1) {
                    letter = "gh";
                }
                else if (letter == 2) {
                    letter = "ng";
                }
                else if (letter == 3) {
                    letter = "ph";
                }
                else if (letter == 4) {
                    letter = "sh";
                }
                else if (letter == 5) {
                    letter = "th";
                }
                else if (letter == 6) {
                    letter = "wh";
                }
                draw.text(toPolar((this.radius+35), currentDeg, [this.x, this.y]), 16, letter);
            }
            currentDeg += (this.ranges[i] / 2);
        }
        // Shwo words if needed
        if (showWords.checked) {
            draw.text([this.x, (this.y + this.radius) + 55], 16, original[this.circleNum]);
        }
    }
}

/****************************************
 * Creating Circles
****************************************/
// Draws the circles
function drawAllCircles() {
    draw.empty();
    for(i = 0; i < circles.length; i++) {
        circles[i].draw();
    }
    
    // Display title if needed
    if (showTitle.checked && showAlphabet.checked == false) {
        draw.text([w/2, h/15], 40, original.join(' '));
    }
}

// Calculates each circle's xy coords and then draws
function calcAndDrawCircles() {
    scale(scaleSize.value / 100);
    if (circles.length == 1) {
        // One word is centered
        circles[0].x = w/2;
        circles[0].y = h/2;
    }
    else if (spiral.checked == false || words.length < 5) {
        console.log("no spiral");
        // Get the radius of each circle in order
        let radii = [];
        let totalR = 0;
        for (let i = 0; i < circles.length; i++) {
            radii[i] = circles[i].radius + 170;
            // Add more space between circles to prevent letter labels overlapping
            if (showLetters.checked) {
                radii[i] += 70;
            }
            totalR += radii[i];
        }
        
        // Get each circles range
        let ranges = [];
        for (let i = 0; i < circles.length; i++) {
            let realR = circles[i].radius;
            ranges[i] = (radii[i] / totalR) * 360;
        }
        
        // Current degree starts at 6 o'clock position
        let currentDeg = -90 - (ranges[0]/2);
        
        // Give xy to each circle
        for (let i = 0; i < circles.length; i++) {
            let wordR = calcTriRadius(ranges[i], radii[i]);
            
            currentDeg += (ranges[i] / 2);
            
            circles[i].x = toPolarX(wordR, currentDeg, (w/2));
            circles[i].y = toPolarY(wordR, currentDeg, (h/2));
            if (showWords.checked) {
                circles[i].y -= 20;
            }
            
            currentDeg += (ranges[i] / 2);
        }
    }
    else {
        // Spiral starting degree
        let spiralDeg = -90 - 360;
        
        // Angle difference
        let angleDif = spiralSlide.value;
        
        // Use a constant arc space between each word rather than degrees
        let arcDif = calcArcLength(angleDif, spiralRadius(w/3, spiralDeg));
        
        // Set coords for each circle
        for (let i = 0; i < words.length; i++) {
            let radius = spiralRadius(h/3, spiralDeg) - (i * spiralScale.value);
            if (radius < 0) {
                radius = 0;
            }
            circles[i].x = toPolarX(radius, spiralDeg, (w/2));
            circles[i].y = toPolarY(radius, spiralDeg, (h/2)) - (h/15);
            if (i < words.length - 1) {
                spiralDeg += calcArcDegree(arcDif + circles[i+1].radius, radius);
            }
            else {
                circles[i].x = toPolarX(radius * 0.5, spiralDeg, (w/2));
                circles[i].y = toPolarY(radius * 0.5, spiralDeg, (h/2)) - (h/15);
            }
        }
    }
    drawAllCircles();
}

// You see the mayflies, they know more than we do. They know how beautiful and precious life is because it's fleeting.

// Creates circles and draws them
function createCircles(text) {
    // Reset circles, words, and canvas
    circles = [];
    words = [];
    draw.empty();
    
    // Remove any double/unwanted spaces that could mess up array.join()
    while (text.charAt(0) == " ") {
        text = text.substr(1);
    }
    for (i = 0; i < (text.length - 1); i++) {
        if (text.charAt(i) == " " && text.charAt(i - 1) == " ") {
            text = text.slice(0, i) + text.slice(i + 1, text.length);
            i--;
        }
    }
    while (text.charAt(text.length - 1) == " ") {
        text = text.slice(0, -1);
    }
    
    // Split into words
    words = text.split(" ");
    // Save words for displaying later
    original = words.slice(0, words.length);
    
    // Remove double letters from words here
    for(let w = 0; w < words.length; w++) {
        words[w] = words[w].toLowerCase();
        for(let i = 0; i < (words[w].length - 1); i++) {
            if (words[w].charAt(i) == words[w].charAt(i+1)) {
                console.log("Duplicate '" + words[w].charAt(i) +  "' found in '" + words[w] + "'!");
                words[w] = words[w].slice(0, i) + words[w].slice(i + 1, words[w].length);
                i--;
            }
            else if (words[w].charAt(i) == "g" && words[w].charAt(i+1) == "h") {
                words[w] = words[w].slice(0, i) + "1" + words[w].slice(i+2, words[w].length);
            }
            else if (words[w].charAt(i) == "n" && words[w].charAt(i+1) == "g") {
                words[w] = words[w].slice(0, i) + "2" + words[w].slice(i+2, words[w].length);
            }
            else if (words[w].charAt(i) == "p" && words[w].charAt(i+1) == "h") {
                words[w] = words[w].slice(0, i) + "3" + words[w].slice(i+2, words[w].length);
            }
            else if (words[w].charAt(i) == "s" && words[w].charAt(i+1) == "h") {
                words[w] = words[w].slice(0, i) + "4" + words[w].slice(i+2, words[w].length);
            }
            else if (words[w].charAt(i) == "t" && words[w].charAt(i+1) == "h") {
                words[w] = words[w].slice(0, i) + "5" + words[w].slice(i+2, words[w].length);
            }
            else if (words[w].charAt(i) == "w" && words[w].charAt(i+1) == "h") {
                words[w] = words[w].slice(0, i) + "6" + words[w].slice(i+2, words[w].length);
            }
            else if (words[w].charAt(i) == "q" && words[w].charAt(i+1) == "u") {
                words[w] = words[w].slice(0, i) + "q" + words[w].slice(i+2, words[w].length);
            }
            else if (words[w].charAt(i) == "c" && words[w].charAt(i+1) == "h") {
                words[w] = words[w].slice(0, i) + "c" + words[w].slice(i+2, words[w].length);
            }
            else if (words[w].charAt(i) == "c" && words[w].charAt(i+1) == "k") {
                words[w] = words[w].slice(0, i) + "k" + words[w].slice(i+2, words[w].length);
            }
            
        }
    }
    
    // Create circles and draw
    if (words.length >= 1) {
        for(i = 0; i < words.length; i++) {
            circles[i] = new Circle(i, words[i]);
        }
    }
    
    calcAndDrawCircles();
}

// Get text for title
getText();