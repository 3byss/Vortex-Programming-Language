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

let lines = [];
for (const line of fileData) {
    lines.push(parseLine(line));
}

for (const line of lines) {
    let tree = parseTree(line);
}

function evaluateTree(tree) {
    let leftSide = tree?.leftNode ? evaluateTree(tree.leftNode) : 0;
    let rightSide = tree?.rightNode ? evaluateTree(tree.rightNode)  : 0;
    const value = tree.value;

    switch (value) {
            case "+":
                return leftSide + rightSide;
            case "-":
                return leftSide - rightSide;
            case "*":
                return leftSide * rightSide;
            case "/":
                return leftSide / rightSide;
            default:
                if (
                    Number(value)
                    || value === "0"
                    || (value ===  "." && !value.includes(".")) 
                    || (value == "-" && !value.includes("-") && 
                        value.length === 0)
                ) {
                    return value;
                }
        }
}

function parseTree(line) {

    // ['4', '/', '2', '*', '3', '+', '2', '-', '1']
    let tree = {};

    for (const char of line) {
        
    }

    return tree;
}

function parseLine(line) {
    let expressionList = [];
    let currentNumber = line[0];

    for(let i = 1; i <= line.length; i++) {
        let currentValue = line[i];
        if (currentValue === " ") { continue; }

        if (
            Number(currentValue)
            || currentValue === "0"
            || (currentValue ===  "." && !currentNumber.includes(".")) 
            || (currentValue == "-" && !currentNumber.includes("-") && 
                currentNumber.length === 0)
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

    return expressionList;
}
