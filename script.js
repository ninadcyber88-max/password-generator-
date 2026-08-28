// script.js

const inputPassword =
    document.getElementById("inputPassword");

const togglePassword =
    document.getElementById("togglePassword");

const inputStrengthBar =
    document.getElementById("inputStrengthBar");

const inputStrengthText =
    document.getElementById("inputStrengthText");

const strengthMessage =
    document.getElementById("strengthMessage");

const hashButton =
    document.getElementById("hashButton");

const hashOutput =
    document.getElementById("hashOutput");

const copyHashButton =
    document.getElementById("copyHashButton");

const lengthSlider =
    document.getElementById("length");

const lengthValue =
    document.getElementById("lengthValue");

const passwordInput =
    document.getElementById("password");

const generateButton =
    document.getElementById("generateButton");

const copyButton =
    document.getElementById("copyButton");

const strengthBar =
    document.getElementById("strengthBar");

const strengthText =
    document.getElementById("strengthText");

const generatorMessage =
    document.getElementById("generatorMessage");


/* =====================================
   PASSWORD VISIBILITY
===================================== */

togglePassword.addEventListener("click", () => {

    const hidden =
        inputPassword.type === "password";

    inputPassword.type =
        hidden ? "text" : "password";

    togglePassword.textContent =
        hidden ? "🙈" : "👁️";
});


/* =====================================
   PASSWORD STRENGTH
===================================== */

function calculateStrength(password) {

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
}


function showInputStrength(password) {

    if (!password) {

        inputStrengthBar.style.width = "0%";
        inputStrengthText.textContent = "—";
        strengthMessage.textContent =
            "Password strength येथे दिसेल.";

        return;
    }

    const score =
        calculateStrength(password);

    if (score <= 3) {

        inputStrengthBar.style.width = "30%";
        inputStrengthText.textContent =
            "कमकुवत";
        strengthMessage.textContent =
            "🔴 Password अधिक मजबूत करा.";

    } else if (score <= 5) {

        inputStrengthBar.style.width = "60%";
        inputStrengthText.textContent =
            "मध्यम";
        strengthMessage.textContent =
            "🟡 अजून security वाढवू शकता.";

    } else {

        inputStrengthBar.style.width = "100%";
        inputStrengthText.textContent =
            "मजबूत";
        strengthMessage.textContent =
            "🟢 मजबूत Password.";
    }
}


inputPassword.addEventListener(
    "input",
    () => showInputStrength(inputPassword.value)
);


/* =====================================
   SHA-256 HASH
===================================== */

async function sha256(text) {

    const data =
        new TextEncoder().encode(text);

    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );

    return Array.from(
        new Uint8Array(hashBuffer)
    )
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("");
}


hashButton.addEventListener(
    "click",
    async () => {

        const password =
            inputPassword.value;

        if (!password) {

            inputPassword.focus();

            strengthMessage.textContent =
                "⚠️ आधी Password टाका.";

            return;
        }

        hashButton.disabled = true;
        hashButton.textContent =
            "⏳ Generating...";

        try {

            const hash =
                await sha256(password);

            hashOutput.value = hash;

            showInputStrength(password);

            hashButton.textContent =
                "✅ Hash Generated";

            setTimeout(() => {

                hashButton.textContent =
                    "🔐 Generate SHA-256 Hash";

            }, 1800);

        } catch (error) {

            console.error(error);

            hashButton.textContent =
                "❌ Error";

        } finally {

            hashButton.disabled = false;
        }
    }
);


/* =====================================
   COPY HASH
===================================== */

copyHashButton.addEventListener(
    "click",
    async () => {

        const hash =
            hashOutput.value;

        if (!hash) {

            copyHashButton.textContent =
                "⚠️ Empty";

            setTimeout(() => {

                copyHashButton.textContent =
                    "📋 Copy";

            }, 1500);

            return;
        }

        try {

            await navigator.clipboard.writeText(
                hash
            );

        } catch {

            hashOutput.select();
            document.execCommand("copy");
        }

        copyHashButton.textContent =
            "✅ Copied!";

        setTimeout(() => {

            copyHashButton.textContent =
                "📋 Copy";

        }, 1800);
    }
);


/* =====================================
   SECURE PASSWORD GENERATOR
===================================== */

const lowercase =
    "abcdefghijklmnopqrstuvwxyz";

const uppercase =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const numbers =
    "0123456789";

const symbols =
    "!@#$%^&*()-_=+";


function secureRandom(max) {

    const array =
        new Uint32Array(1);

    crypto.getRandomValues(array);

    return array[0] % max;
}


function randomCharacter(characters) {

    return characters[
        secureRandom(characters.length)
    ];
}


function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            secureRandom(i + 1);

        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];
    }

    return array;
}


function generateSecurePassword(length) {

    const allCharacters =
        lowercase +
        uppercase +
        numbers +
        symbols;

    const password = [

        randomCharacter(lowercase),
        randomCharacter(uppercase),
        randomCharacter(numbers),
        randomCharacter(symbols)

    ];

    while (password.length < length) {

        password.push(
            randomCharacter(allCharacters)
        );
    }

    return shuffle(password).join("");
}


/* =====================================
   GENERATOR STRENGTH
===================================== */

function updateGeneratorStrength(password) {

    const score =
        calculateStrength(password);

    if (score <= 3) {

        strengthBar.style.width = "30%";
        strengthText.textContent =
            "कमकुवत";
        generatorMessage.textContent =
            "🔴 Password कमकुवत आहे.";

    } else if (score <= 5) {

        strengthBar.style.width = "60%";
        strengthText.textContent =
            "मध्यम";
        generatorMessage.textContent =
            "🟡 Password मध्यम आहे.";

    } else {

        strengthBar.style.width = "100%";
        strengthText.textContent =
            "मजबूत";
        generatorMessage.textContent =
            "🟢 Password मजबूत आहे.";
    }
}


/* =====================================
   GENERATE PASSWORD
===================================== */

function createPassword() {

    const length =
        Number(lengthSlider.value);

    const password =
        generateSecurePassword(length);

    passwordInput.value =
        password;

    updateGeneratorStrength(password);

    copyButton.textContent =
        "📋 Copy";
}


lengthSlider.addEventListener(
    "input",
    () => {

        lengthValue.textContent =
            lengthSlider.value;
    }
);


generateButton.addEventListener(
    "click",
    createPassword
);


/* =====================================
   COPY GENERATED PASSWORD
===================================== */

copyButton.addEventListener(
    "click",
    async () => {

        const password =
            passwordInput.value;

        if (!password) {
            createPassword();
        }

        try {

            await navigator.clipboard.writeText(
                passwordInput.value
            );

        } catch {

            passwordInput.select();
            document.execCommand("copy");
        }

        copyButton.textContent =
            "✅ Copied!";

        setTimeout(() => {

            copyButton.textContent =
                "📋 Copy";

        }, 1800);
    }
);


/* =====================================
   INITIAL PASSWORD
===================================== */

createPassword();
