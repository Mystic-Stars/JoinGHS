const phrases = ["创新 • 激情 • 团队", "探索 • 成长 • 突破", "梦想 • 实践 • 成就"];
let currentIndex = 0;
const changingText = document.getElementById("changingText");

function changeText() {
    changingText.style.opacity = 0;
    setTimeout(() => {
        changingText.textContent = phrases[currentIndex];
        changingText.style.opacity = 1;
        currentIndex = (currentIndex + 1) % phrases.length;
    }, 500);
}

setInterval(changeText, 3000);