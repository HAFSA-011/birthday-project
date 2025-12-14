document.addEventListener("DOMContentLoaded", function () {
    const cakeImg = document.getElementById("cake-img");
    const startAudioText = document.getElementById("start-audio");
    const musicFrame = document.getElementById("music-frame");

startAudioText.addEventListener("click", () => {
    musicFrame.contentWindow.postMessage("START_HAPPY", "*");
    startAudioText.style.display = "none";
});


    let audioContext, analyser;

    function isBlowing() {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) sum += dataArray[i];

        let average = sum / bufferLength;
        return average > 65; // العتبة
    }

    function blowOutCandle() {
    // بدّل الصورة
    cakeImg.src = "img/cake_off.jpg";
    cakeImg.classList.remove("glow");

    // صيفط message لصفحة الموسيقى
    musicFrame.contentWindow.postMessage("STOP_HAPPY_START_CLAP", "*");

    // 🔹 إظهار الجملة بعد النفخ
    const msg = document.getElementById("after-blow");
    msg.classList.remove("hidden");

    setTimeout(() => {
        msg.classList.add("show");
    }, 200);
}

    // كتزاد لكليك فقط Glow باش تبان شاعلة شوية
    cakeImg.addEventListener("click", () => {
        cakeImg.classList.add("glow");
        cakeImg.src = "img/cake_on.jpg";
    });

    // إعداد الميكروفون
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);
                analyser.fftSize = 256;

                setInterval(() => {
                    if (isBlowing()) blowOutCandle();
                }, 200);
            })
            .catch(err => {
                console.log("Microphone error: " + err);
            });
    }
});