const basket = document.querySelector('.basket');
const ball = document.querySelector('.ball');
const levelElement = document.getElementById('level');
const attemptsElement = document.getElementById('attempts');
const countElement = document.getElementById('count');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score'); // Score element
const colors = ['red', 'blue', 'green', 'yellow'];

let currentLevel = 1;
let currentAttempt = 3;
let ballCount = 0;
let dropSpeed = 1000; // Initial drop speed in milliseconds
let score = 0; // Initialize score
let gameInterval;
let startTime;
const timeLimit = 5 * 60 * 1000; // 5 minutes in milliseconds
let basketRotation = 0;

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function dropBall() {
    const ballColor = getRandomColor();
    ball.style.backgroundColor = ballColor;
    ball.style.top = '-50px'; // Starting position adjusted to match CSS
    ball.style.left = '50%';
    
    // Animate the ball falling down
    let topPosition = -50; // Starting position adjusted to match CSS
    const fallInterval = setInterval(() => {
        topPosition += 2; // Reduced speed of falling
        ball.style.top = `${topPosition}px`;
        
        // Check if the ball has reached the basket
        if (topPosition > 150) { // Adjusted to match reduced distance
            clearInterval(fallInterval);
            checkMatch(ballColor);
        }
    }, dropSpeed / 50);
}

function checkMatch(ballColor) {
    const sectionAngle = 90;
    const basketRotationAngle = (360 - basketRotation) % 360;
    
    // Determine which section is currently at the top
    const sectionIndex = Math.floor((basketRotationAngle % 360) / sectionAngle);
    const sectionColor = colors[sectionIndex];
    
    if (ballColor === sectionColor) {
        ballCount++;
        countElement.innerText = ballCount;
        score += 10; // Increase score for a correct match
        scoreElement.innerText = score; // Update the score display

        if (ballCount >= 500) {
            alert('You reached 500 balls! Proceeding to the next level.');
            increaseLevel();
        } else if (ballCount >= 400 && (Date.now() - startTime) < timeLimit) {
            alert('You reached 400 balls before time elapsed! Proceeding to the next level.');
            increaseLevel();
        }
    } else {
        currentAttempt--;
        attemptsElement.innerText = currentAttempt;
        score -= 5; // Deduct score for an incorrect match
        score = Math.max(score, 0); // Ensure score doesn't go below zero
        scoreElement.innerText = score; // Update the score display

        if (currentAttempt <= 0) {
            alert('No more attempts left. Game Over.');
            clearInterval(gameInterval);
        }
    }
}

function increaseLevel() {
    if (currentLevel < 10) {
        currentLevel++;
        levelElement.innerText = currentLevel;
        dropSpeed -= 100; // Increase the speed
        ballCount = 0;
        countElement.innerText = ballCount;
        currentAttempt = 3;
        attemptsElement.innerText = currentAttempt;
        startTime = Date.now(); // Reset the timer for the new level
    } else {
        alert('Congratulations! You completed all levels.');
        clearInterval(gameInterval);
    }
}

document.addEventListener('click', () => {
    basketRotation = (basketRotation + 90) % 360;
    basket.style.transform = `rotate(${basketRotation}deg)`;
});

function updateTimer() {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(timeLimit - elapsedTime, 0);
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    timerElement.innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    if (remainingTime <= 0) {
        alert('Time is up!');
        clearInterval(gameInterval);
    }
}

function startGame() {
    startTime = Date.now();
    score = 0; // Reset score at the beginning of the game
    scoreElement.innerText = score; // Update score display
    dropBall();
    gameInterval = setInterval(() => {
        if ((Date.now() - startTime) > timeLimit) {
            alert('Time is up!');
            clearInterval(gameInterval);
        } else {
            dropBall();
            updateTimer();
        }
    }, dropSpeed + 2000); // Adjusted to allow for drop speed changes
}
const restartButton = document.getElementById('restart-btn');

restartButton.addEventListener('click', () => {
    window.location.href = 'index1.html'; // Replace 'game.html' with your game page URL
});

startGame();
