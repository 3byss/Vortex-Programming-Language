import { TIMEOUT } from "node:dns";
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

let parsedLines = [];
for (const line of fileData) {
    let parsedLine = parseLine(line);
    console.log(evaluateTree(parseTree(parsedLine)));
}

function evaluateTree(tree) {
    let leftSide = tree?.leftNode ? evaluateTree(tree.leftNode) : 0;
    let rightSide = tree?.rightNode ? evaluateTree(tree.rightNode)  : 0;
    const value = tree.value;

    switch (value) {
        case "+":
            return Number(leftSide) + Number(rightSide);
        case "-":
            return Number(leftSide) - Number(rightSide);
        case "*":
            return Number(leftSide) * Number(rightSide);
        case "/":
            return Number(leftSide) / Number(rightSide);
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

function parseTree(line, start = 0, end = line.length - 1, type = "") {
    if (end - start <= 0) {
        return {
            value: line[start],
            leftNode: null,
            rightNode: null
        }
    }
    
    const priority = {
        "+": 1,
        "-": 2,
        "*": 3,
        "/": 4
    };

    let firstOccurence = -1;
    let lastOccurence = -1;
    let value = line[0];

    for (let i = start; i <= end; i++) {
        let currentValue = line[i];
        let bothNotNull = Boolean(priority[value])
                          && 
                          Boolean(priority[currentValue]);

        let currentValueNotNull = !Boolean(priority[value])
                                  &&
                                  Boolean(priority[currentValue]);

        if (currentValueNotNull) {
            value = currentValue;
            firstOccurence = i;
            continue;
        }

        if (bothNotNull && priority[value] > priority[currentValue]) {
            firstOccurence = i;
            value = currentValue
        } 

        if (bothNotNull && priority[value] === priority[currentValue]) {
            lastOccurence = i;
        }
    }

    return {
        value: value,
        leftNode: parseTree(line, start, firstOccurence - 1, "left"),
        rightNode: parseTree(line, firstOccurence + 1, end, "right")
    }
}

function parseLine(line) {
    let expressionList = [];
    let currentNumber = line[0];

    for (let i = 1; i <= line.length; i++) {
        let currentValue = line[i];
        if (
            currentValue === " " 
            || currentValue === "\r"
            || currentValue === "\n"
        ) { continue; }

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
