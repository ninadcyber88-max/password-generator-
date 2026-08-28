const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const passwordInput = document.getElementById("password");
const generateButton = document.getElementById("generateButton");
const copyButton = document.getElementById("copyButton");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*()-_=+";

lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
});

function randomCharacter(characters) {
    return characters[
        Math.floor(Math.random() * characters.length)
    ];
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function generatePassword(length) {
    const allCharacters =
        lowercase + uppercase + numbers + symbols;

    const password = [
        randomCharacter(lowercase),
        randomCharacter(uppercase),
        randomCharacter(numbers),
        randomCharacter(symbols)
    ];

    while (password.length < length) {
        password.push(randomCharacter(allCharacters));
    }

    return shuffle(password).join("");
}

function checkStrength(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 3) {
        strengthText.textContent = "🔴 कमकुवत Password";
        strengthBar.style.width = "30%";
    } else if (score <= 5) {
        strengthText.textContent = "🟡 मध्यम Password";
        strengthBar.style.width = "60%";
    } else {
        strengthText.textContent = "🟢 मजबूत Password";
        strengthBar.style.width = "100%";
    }
}

function createPassword() {
    const length = Number(lengthSlider.value);

    const password = generatePassword(length);

    passwordInput.value = password;

    checkStrength(password);

    copyButton.textContent = "📋 Copy";
}

generateButton.addEventListener("click", createPassword);

copyButton.addEventListener("click", async () => {
    const password = passwordInput.value;

    if (!password) {
        createPassword();
    }

    try {
        await navigator.clipboard.writeText(passwordInput.value);

        copyButton.textContent = "✅ Copied!";

        setTimeout(() => {
            copyButton.textContent = "📋 Copy";
        }, 2000);
    } catch {
        passwordInput.select();
        document.execCommand("copy");

        copyButton.textContent = "✅ Copied!";

        setTimeout(() => {
            copyButton.textContent = "📋 Copy";
        }, 2000);
    }
});

createPassword();
