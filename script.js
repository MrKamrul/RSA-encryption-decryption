// Function to generate a random prime number within a range
function generatePrime(min, max) {
    function isPrime(num) {
        for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
            if (num % i === 0) return false;
        }
        return num > 1;
    }
    
    let prime;
    do {
        prime = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (!isPrime(prime));
    
    return prime;
}

// Function to calculate greatest common divisor (GCD) of two numbers
function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
}

// Function to generate RSA keys
function generateKeys() {
    const min = 100;
    const max = 1000;
    
    // Step 1: Generate two distinct prime numbers, p and q
    let p = generatePrime(min, max);
    let q = generatePrime(min, max);
    
    // Step 2: Calculate n = p * q
    let n = p * q;
    
    // Step 3: Calculate Euler's totient function φ(n)
    let phi = (p - 1) * (q - 1);
    
    // Step 4: Choose an integer e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1
    let e;
    do {
        e = Math.floor(Math.random() * (phi - 2)) + 2;
    } while (gcd(e, phi) !== 1);
    
    // Step 5: Calculate d as the modular multiplicative inverse of e modulo φ(n)
    let d;
    for (let i = 1; i < phi; i++) {
        if ((i * e) % phi === 1) {
            d = i;
            break;
        }
    }
    
    // Public key (e, n)
    let publicKey = { e, n };
    
    // Private key (d, n)
    let privateKey = { d, n };
    
    // Store public and private keys in local storage
    localStorage.setItem('publicKey', JSON.stringify(publicKey));
    localStorage.setItem('privateKey', JSON.stringify(privateKey));
    
    // Display private key
    document.getElementById("privateKeyOutput").textContent = "Private Key: " + JSON.stringify(privateKey);
    
    alert('Keys generated and stored in local storage.');
}

// Function to encrypt plaintext using public key
function encrypt() {
    let publicKey = JSON.parse(localStorage.getItem('publicKey'));
    let plaintext = document.getElementById("plaintext").value;
    
    if (!publicKey) {
        alert('Please generate keys first.');
        return;
    }
    
    // Convert plaintext to ASCII codes
    let asciiCodes = [];
    for (let i = 0; i < plaintext.length; i++) {
        asciiCodes.push(plaintext.charCodeAt(i));
    }
    
    // Encrypt each ASCII code using public key
    let encryptedCodes = asciiCodes.map(code => {
        return BigInt(code) ** BigInt(publicKey.e) % BigInt(publicKey.n);
    });
    
    // Display encrypted message
    let encryptedMessage = encryptedCodes.join(' ');
    document.getElementById("output").textContent = encryptedMessage;
}

// Function to decrypt ciphertext using private key
function decrypt() {
    let privateKey = JSON.parse(localStorage.getItem('privateKey'));
    let ciphertext = document.getElementById("output").textContent;
    
    if (!privateKey) {
        alert('Please generate keys first.');
        return;
    }
    
    // Split ciphertext into individual encrypted codes
    let encryptedCodes = ciphertext.split(' ');
    
    // Decrypt each encrypted code using private key
    let decryptedCodes = encryptedCodes.map(code => {
        return String.fromCharCode(Number(BigInt(code) ** BigInt(privateKey.d) % BigInt(privateKey.n)));
    });
    
    // Display decrypted message
    let decryptedMessage = decryptedCodes.join('');
    document.getElementById("decrypted").textContent = decryptedMessage;
}

