import { TIMEOUT } from "node:dns";
import fs from "node:fs";

let sourceCode = getSourceCode();

for (const line of sourceCode) {
    let parsedLine = parseLine(line);
    let parsedTree = parseTree(parsedLine)
 
    console.log(
        `The equation: ${line} \nis equal to: ${evaluateTree(parsedTree)}`);
}

function getSourceCode() {
    let fileLocation = process.argv[2];
    let fileData = fs.readFileSync(fileLocation, "utf-8").split("\n");

    return fileData;
}

function evaluateTree(tree) {
    let leftSide = tree?.leftNode ? Number(evaluateTree(tree.leftNode)) : 0;
    let rightSide = tree?.rightNode ? Number(evaluateTree(tree.rightNode))  : 0;
    const value = tree.value;

    switch (value) {
        case "+":
            return leftSide + rightSide;
        case "-":
            return leftSide - rightSide;
        case "*":
            return leftSide * rightSide;
        case "/":
            if (rightSide === 0) { throw new Error("Division by zero"); }

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

function parseTree(line, start = 0, end = line.length - 1) {
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
            lastOccurence = i
            continue;
        }

        if (bothNotNull && priority[value] > priority[currentValue]) {
            firstOccurence = i;
            lastOccurence = i;
            value = currentValue
        } 

        if (bothNotNull && priority[value] === priority[currentValue]) {
            lastOccurence = i;
        }
    }

    if (value === "-") {
        firstOccurence = lastOccurence;
    }

    return {
        value: value,
        leftNode: parseTree(line, start, firstOccurence - 1),
        rightNode: parseTree(line, firstOccurence + 1, end)
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
