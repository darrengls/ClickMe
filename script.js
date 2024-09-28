const button = document.getElementById('fleeButton');
const buttonWrapper = document.querySelector('.button-wrapper');
const levelDisplay = document.getElementById('levelDisplay');
const speedDisplay = document.getElementById('speedDisplay');
const timeDisplay = document.getElementById('timeDisplay');
const resetButton = document.getElementById('resetButton');

let level = 1;
let speedMultiplier = 1.0;
let proximity = 100; // Initial distance to flee
let startTime;
let timerInterval;

// Center the button initially
function centerButton() {
    buttonWrapper.style.left = '50%';
    buttonWrapper.style.top = '50%';
    buttonWrapper.style.transform = 'translate(-50%, -50%)';
}

window.onload = () => {
    centerButton();
    startLevel();
};

// Function to start a level
function startLevel() {
    speedMultiplier = 1.0 + (level - 1) * 0.5; // Increase speed each level
    proximity = 100 + (level - 1) * 20; // Increase proximity each level
    levelDisplay.textContent = `Level: ${level}`;
    speedDisplay.textContent = `Speed: ${speedMultiplier.toFixed(1)}x`;
    startTime = new Date();
    updateTimer();
}

// Function to update the timer
function updateTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsed = ((new Date() - startTime) / 1000).toFixed(2);
        timeDisplay.textContent = `Time: ${elapsed}s`;
    }, 100);
}

// Function to move the button away from the mouse
function fleeFromMouse(e) {
    const rect = buttonWrapper.getBoundingClientRect();

    // Calculate distances between the mouse and the button
    const distanceX = e.clientX - (rect.left + rect.width / 2);
    const distanceY = e.clientY - (rect.top + rect.height / 2);

    // Check if the mouse is close enough to make the button flee
    if (Math.abs(distanceX) < proximity && Math.abs(distanceY) < proximity) {
        // Calculate new positions for fleeing, ensuring it stays within the viewport
        let newX = rect.left - (distanceX > 0 ? 50 * speedMultiplier : -50 * speedMultiplier);
        let newY = rect.top - (distanceY > 0 ? 50 * speedMultiplier : -50 * speedMultiplier);

        // Adjust positions to prevent sticking to corners
        if (newX < 0) newX = 50; // Prevent from getting stuck on the left edge
        if (newY < 0) newY = 50; // Prevent from getting stuck on the top edge
        if (newX > window.innerWidth - buttonWrapper.offsetWidth) newX = window.innerWidth - buttonWrapper.offsetWidth - 50; // Right edge
        if (newY > window.innerHeight - buttonWrapper.offsetHeight) newY = window.innerHeight - buttonWrapper.offsetHeight - 50; // Bottom edge

        // Move the button to the new position
        gsap.to(buttonWrapper, {
            duration: 0.3 / speedMultiplier, // Adjust speed based on level
            x: newX - window.innerWidth / 2 + buttonWrapper.offsetWidth / 2,
            y: newY - window.innerHeight / 2 + buttonWrapper.offsetHeight / 2,
            ease: 'power1.out',
        });
    }
}

// Event listener for mouse movement
document.addEventListener('mousemove', fleeFromMouse);

// Prevent text selection and ensure button clicks work smoothly
button.addEventListener('mousedown', (e) => e.preventDefault());

// Function when button is clicked
button.addEventListener('click', () => {
    clearInterval(timerInterval); // Stop the timer
    const elapsed = ((new Date() - startTime) / 1000).toFixed(2);
    alert(`Level ${level} completed in ${elapsed} seconds!`);
    level++; // Advance to the next level
    startLevel(); // Start the next level
});

// Reset button functionality
resetButton.addEventListener('click', () => {
    clearInterval(timerInterval); // Stop the timer
    level = 1; // Reset level to 1
    startLevel(); // Restart from level 1
});
