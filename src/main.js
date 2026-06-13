import fs from "node:fs";

/* 
    By adding in any txt file into the CLI arguments for the main.js file this program can do calculations using parsing techniques. However it gives faulty answers because the lack of an Abstract Syntax Tree(AST) which will be implemented next within the transpiler.

    This is better used for smaller equations that utilize one operation 
    e.g 8 + 9, 8 * 8, 3 / 1, 8 / 2.5, etc.
    
    But this doesnt stop it from doing larger calculations you can hand it 
    8,000,000 * 12 or even larger as it is entirely javascript under the hood.
*/

// https://ruslanspivak.com/lsbasi-part7/ <--- A link about abstract syntax trees
let fileLocation = process.argv[2];
let fileData = fs.readFileSync(fileLocation, "utf-8").split("\n");

for (const line of fileData) {
    console.log(parseLine(line));
}

function parseLine(line) {
    let expressionList = [];
    let currentNumber = line[0];

    for(let i = 1; i <= line.length; i++) {
        let currentValue = line[i];
        if (currentValue === " ") { continue; }

        if (
            parseInt(currentValue)
            || currentValue === "0"
            || (currentValue ===  "." && !currentNumber.includes(".")) 
            || (currentValue == "-" && !currentNumber.includes("-"))
        ) {
            currentNumber += currentValue;
            continue;
        }
        else {
            expressionList.push(currentNumber);
            currentNumber = "";
        }

        switch (currentValue) {
            case "+":
                expressionList.push(currentValue);
                currentNumber = "";
                break;
            case "-":
                expressionList.push(currentValue);
                currentNumber = "";
                break;
            case "*":
                expressionList.push(currentValue);
                currentNumber = "";
                break;
            case "/":
                expressionList.push(currentValue);
                currentNumber = "";
                break;
        }

    }

    let value = Number(expressionList[0]);
    for (let i = 1; i < expressionList.length - 1; i++) {
        let expression = expressionList[i];
        let nextValue = Number(expressionList[i + 1]);
        
        switch (expression) {
            case "+":
                value += nextValue;
                break;
            case "-":
                value -= nextValue
                break;
            case "*":
                value *= nextValue;
                break;
            case "/":
                value /= nextValue;
                break;
        }
    }

    return value
}