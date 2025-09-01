const fs = require('fs');

// Function to convert a number from any base to decimal
function baseToDecimal(value, base) {
    let result = 0;
    const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
    
    for (let i = 0; i < value.length; i++) {
        const digit = digits.indexOf(value[i].toLowerCase());
        if (digit >= base) {
            throw new Error(`Invalid digit ${value[i]} for base ${base}`);
        }
        result = result * base + digit;
    }
    return result;
}

// Lagrange interpolation to find polynomial value at x=0
function lagrangeInterpolation(points) {
    let result = 0;
    const n = points.length;
    
    for (let i = 0; i < n; i++) {
        let term = points[i].y;
        
        // Calculate the Lagrange basis polynomial L_i(0)
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                // For x = 0, we get: (0 - x_j) / (x_i - x_j) = -x_j / (x_i - x_j)
                term = term * (-points[j].x) / (points[i].x - points[j].x);
            }
        }
        
        result += term;
    }
    
    return Math.round(result); // Round to nearest integer since we expect integer coefficients
}

// Main function to solve the secret sharing
function solveSecretSharing(testCase) {
    const { keys } = testCase;
    const n = keys.n;
    const k = keys.k;
    
    console.log(`Processing test case with n=${n}, k=${k}`);
    console.log(`Polynomial degree: ${k-1}`);
    
    // Extract and convert all points
    const points = [];
    
    for (let i = 1; i <= n; i++) {
        if (testCase[i.toString()]) {
            const x = i;
            const base = parseInt(testCase[i.toString()].base);
            const value = testCase[i.toString()].value;
            const y = baseToDecimal(value, base);
            
            points.push({ x, y });
            console.log(`Point ${i}: (${x}, ${y}) [${value} in base ${base}]`);
        }
    }
    
    // We only need k points to solve the polynomial
    const selectedPoints = points.slice(0, k);
    console.log(`\nUsing first ${k} points for interpolation:`);
    selectedPoints.forEach(p => console.log(`(${p.x}, ${p.y})`));
    
    // Find the secret (constant term) using Lagrange interpolation
    const secret = lagrangeInterpolation(selectedPoints);
    
    console.log(`\nSecret (constant term): ${secret}`);
    
    return secret;
}

// Test Case 1
console.log("=== TEST CASE 1 ===");
const testCase1 = {
    "keys": {
        "n": 4,
        "k": 3
    },
    "1": {
        "base": "10",
        "value": "4"
    },
    "2": {
        "base": "2",
        "value": "111"
    },
    "3": {
        "base": "10",
        "value": "12"
    },
    "6": {
        "base": "4",
        "value": "213"
    }
};

const secret1 = solveSecretSharing(testCase1);

console.log("\n" + "=".repeat(50) + "\n");

// Test Case 2
console.log("=== TEST CASE 2 ===");
const testCase2 = {
    "keys": {
        "n": 10,
        "k": 7
    },
    "1": {
        "base": "6",
        "value": "13444211440455345511"
    },
    "2": {
        "base": "15",
        "value": "aed7015a346d635"
    },
    "3": {
        "base": "15",
        "value": "6aeeb69631c227c"
    },
    "4": {
        "base": "16",
        "value": "e1b5e05623d881f"
    },
    "5": {
        "base": "8",
        "value": "316034514573652620673"
    },
    "6": {
        "base": "3",
        "value": "2122212201122002221120200210011020220200"
    },
    "7": {
        "base": "3",
        "value": "20120221122211000100210021102001201112121"
    },
    "8": {
        "base": "6",
        "value": "20220554335330240002224253"
    },
    "9": {
        "base": "12",
        "value": "45153788322a1255483"
    },
    "10": {
        "base": "7",
        "value": "1101613130313526312514143"
    }
};

const secret2 = solveSecretSharing(testCase2);

console.log("\n" + "=".repeat(50));
console.log("FINAL RESULTS:");
console.log(`Test Case 1 Secret: ${secret1}`);
console.log(`Test Case 2 Secret: ${secret2}`);