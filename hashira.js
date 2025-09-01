const fs = require('fs');

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

function lagrangeInterpolation(points) {
    let result = 0;
    const n = points.length;
    
    for (let i = 0; i < n; i++) {
        let term = points[i].y;
        
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                term = term * (-points[j].x) / (points[i].x - points[j].x);
            }
        }
        
        result += term;
    }
    
    return Math.round(result);
}

function solveSecretSharing(testCase) {
    const { keys } = testCase;
    const n = keys.n;
    const k = keys.k;
    
    console.log(`Processing test case with n=${n}, k=${k}`);
    console.log(`Polynomial degree: ${k-1}`);
    
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
    
    const selectedPoints = points.slice(0, k);
    console.log(`\nUsing first ${k} points for interpolation:`);
    selectedPoints.forEach(p => console.log(`(${p.x}, ${p.y})`));
    
    const secret = lagrangeInterpolation(selectedPoints);
    
    console.log(`\nSecret (constant term): ${secret}`);
    
    return secret;
}

function processTestCase(filename) {
    try {
        console.log(`\n=== PROCESSING ${filename.toUpperCase()} ===`);
        
        const data = fs.readFileSync(filename, 'utf8');
        const testCase = JSON.parse(data);
        
        const secret = solveSecretSharing(testCase);
        
        return { filename, secret };
    } catch (error) {
        console.error(`Error processing ${filename}:`, error.message);
        return { filename, secret: null, error: error.message };
    }
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log("Usage: node shamir_solver.js <testcase1.json> [testcase2.json] ...");
        console.log("Example: node shamir_solver.js testcase1.json testcase2.json");
        process.exit(1);
    }
    
    const results = [];
    
    for (const filename of args) {
        const result = processTestCase(filename);
        results.push(result);
        console.log("\n" + "=".repeat(50));
    }
    
    console.log("\n" + "=".repeat(20) + " FINAL RESULTS " + "=".repeat(20));
    results.forEach((result, index) => {
        if (result.secret !== null) {
            console.log(`${result.filename}: ${result.secret}`);
        } else {
            console.log(`${result.filename}: ERROR - ${result.error}`);
        }
    });
}

main();
