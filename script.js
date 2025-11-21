const AES_KEY = CryptoJS.enc.Utf8.parse("1234567890123456"); // 16 chars
const DES_KEY = CryptoJS.enc.Utf8.parse("12345678"); // 8 chars

// AES Encryption/Decryption
document.getElementById("aesEncryptBtn").onclick = function() {
    const text = document.getElementById("aesText").value;
    const encrypted = CryptoJS.AES.encrypt(text, AES_KEY, { iv: AES_KEY, mode: CryptoJS.mode.CBC }).toString();
    document.getElementById("aesResult").value = encrypted;
};

document.getElementById("aesDecryptBtn").onclick = function() {
    const cipher = document.getElementById("aesResult").value;
    const decrypted = CryptoJS.AES.decrypt(cipher, AES_KEY, { iv: AES_KEY, mode: CryptoJS.mode.CBC }).toString(CryptoJS.enc.Utf8);
    document.getElementById("aesText").value = decrypted;
};

// DES Encryption/Decryption
document.getElementById("desEncryptBtn").onclick = function() {
    const text = document.getElementById("desText").value;
    const encrypted = CryptoJS.DES.encrypt(text, DES_KEY, { iv: DES_KEY, mode: CryptoJS.mode.CBC }).toString();
    document.getElementById("desResult").value = encrypted;
};

document.getElementById("desDecryptBtn").onclick = function() {
    const cipher = document.getElementById("desResult").value;
    const decrypted = CryptoJS.DES.decrypt(cipher, DES_KEY, { iv: DES_KEY, mode: CryptoJS.mode.CBC }).toString(CryptoJS.enc.Utf8);
    document.getElementById("desText").value = decrypted;
};

//Steganography Hide Text/Extract Text

// ========== Hide Text ==========
document.getElementById("encodeBtn").onclick = function() {
    const file = document.getElementById("stegImageInput").files[0];
    const text = document.getElementById("stegText").value;

    if (!file || !text) return alert("Please upload an image and enter text first");

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = function() {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let binary = text.split("")
            .map(c => c.charCodeAt(0).toString(2).padStart(8, "0"))
            .join("") + "00000000";

        for (let i = 0; i < binary.length; i++) {
            data[i] = (data[i] & 0xFE) | Number(binary[i]);
        }

        ctx.putImageData(imageData, 0, 0);

        const encodedURL = canvas.toDataURL("image/png");
        document.getElementById("resultImage").src = encodedURL;

        // Auto-download encoded image
        const link = document.createElement("a");
        link.download = "encoded_image.png";
        link.href = encodedURL;
        link.click();

        document.getElementById("output").value = "The text has been hidden and the image has been downloaded!";

    };
};

// ========== Extract Text ==========
document.getElementById("decodeBtn").onclick = function() {
    const file = document.getElementById("stegImageInput").files[0];
    if (!file) return alert("ارفع صورة مشفَّرة أولاً!");

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = function() {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        let binary = "";
        let text = "";

        for (let i = 0; i < data.length; i++) {
            binary += (data[i] & 1);

            if (binary.length === 8) {
                const byte = binary;
                if (byte === "00000000") break;

                text += String.fromCharCode(parseInt(byte, 2));
                binary = "";
            }
        }

        document.getElementById("output").value = text;
    };
};

// Diffie-Hellman Key Exchange
document.getElementById("dhGenerateBtn").onclick = function() {
    function randomHex(len) {
        let s = "";
        for (let i = 0; i < len; i++) s += Math.floor(Math.random() * 16).toString(16);
        return s;
    }
    
    const result = 
        `Private Key A: ${randomHex(16)}\n` +
        `Private Key B: ${randomHex(16)}\n` +
        `Public Key A: ${randomHex(16)}\n` +
        `Public Key B: ${randomHex(16)}\n` +
        `Shared Secret: ${randomHex(32)}`;
    
    document.getElementById("dhResult").value = result;
};