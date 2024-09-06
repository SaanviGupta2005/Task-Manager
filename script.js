const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const scoreboard = document.getElementById('scoreboard');

let completedTasks = 0;
let score = 0;
let goal = 0;

// Ask for today's score goal
setGoal();

addButton.addEventListener('click', addTask);

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== '') {
    const taskItem = document.createElement('li');

    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', completeTask);

    // Create task text
    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = taskText;

    // Create due date input
    // const dueDateInput = document.createElement('input');
    // dueDateInput.type = 'date';

    // Create score input
    const scoreInput = document.createElement('input');
    scoreInput.type = 'number';
    scoreInput.placeholder = 'Enter score';

    // Create priority select input
    const prioritySelect = document.createElement('select');
    prioritySelect.innerHTML = `
      <option value="low">Low (Multiplier = 1)</option>
      <option value="medium">Medium (Multiplier = 2)</option>
      <option value="high">High (Multiplier = 3)</option>
    `;
    // Create edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', editTask);

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', deleteTask);

    

    // Append elements to the task item
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskTextSpan);
    // taskItem.appendChild(dueDateInput);
    taskItem.appendChild(scoreInput);
    taskItem.appendChild(prioritySelect);
    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);
    

    // Append the task item to the task list
    taskList.appendChild(taskItem);

    taskInput.value = '';
  }
}

function deleteTask(event) {
  const taskItem = event.target.parentElement;
  taskList.removeChild(taskItem);
}

function editTask(event) {
  const taskItem = event.target.parentElement;
  const taskTextSpan = taskItem.querySelector('span');
  const taskText = taskTextSpan.textContent;
  const updatedText = prompt('Enter the updated task:', taskText);
  if (updatedText !== null) {
    taskTextSpan.textContent = updatedText.trim();
  }
}

function completeTask(event) {
  const taskItem = event.target.parentElement;
  taskItem.classList.toggle('completed');

  if (taskItem.classList.contains('completed')) {
    const scoreInput = taskItem.querySelector('input[type="number"]');
    const taskScore = parseInt(scoreInput.value) || 0; // Use the entered score or default to 0 if not entered
    
    // Retrieve the priority value of the task
    const prioritySelect = taskItem.querySelector('select');
    const taskPriority = prioritySelect.value;

    increaseScore(taskScore * getPriorityMultiplier(taskPriority));
    updateScoreboard();

    playCompletionSound();
    showCompletionGif();

    if (score >= goal) {
      alert('Congratulations! You reached your goal for today!');
    }
  } else {
    stopCompletionSound();
    hideCompletionGif();
  }
}

// Function to get the multiplier based on task priority
function getPriorityMultiplier(priority) {
  switch (priority) {
    case 'low':
      return 1;
    case 'medium':
      return 2;
    case 'high':
      return 3;
    default:
      return 1;
  }
}


function playCompletionSound() {
  const alertSound = new Audio('yay-6120.mp3');
  alertSound.play();
}

function stopCompletionSound() {
  const alertSound = new Audio('yay-6120.mp3');
  alertSound.pause();
  alertSound.currentTime = 0;
}

function showCompletionGif() {
  const gifImage = document.createElement('img');
  gifImage.src = 'amj.gif';
  gifImage.alt = 'Completion GIF';

  const gifContainer = document.getElementById('gifContainer');
  gifContainer.innerHTML = ''; // Clear any existing content
  gifContainer.appendChild(gifImage);

  setTimeout(hideCompletionGif, 1000); // Hide the GIF after 1 second (adjust the duration as needed)
}

function hideCompletionGif() {
  const gifContainer = document.getElementById('gifContainer');
  gifContainer.innerHTML = ''; // Remove the GIF image
}

function increaseScore(points) {
  score += points;
}

function updateScoreboard() {
  scoreboard.textContent = `Score: ${score}`;
}

function setGoal() {
  const goalText = prompt('Enter today\'s score goal:');
  if (goalText !== null) {
    goal = parseInt(goalText);
  }
}

// Initialize the scoreboard
updateScoreboard();

// Voice Recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;

let isListening = false;
let tempTask = '';

recognition.addEventListener('result', (event) => {
  const transcript = Array.from(event.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join('');

  if (event.results[0].isFinal) {
    tempTask = transcript;
    taskInput.value = tempTask;
  }
});

recognition.addEventListener('end', () => {
  if (isListening) {
    recognition.start();
  }
});

taskInput.addEventListener('focus', () => {
  isListening = false;
  tempTask = '';
});

taskInput.addEventListener('click', () => {
  isListening = false;
  tempTask = '';
});

taskInput.addEventListener('input', () => {
  isListening = false;
  tempTask = '';
});

taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
    isListening = false;
    tempTask = '';
  }
});

const voiceButton = document.createElement('button');
voiceButton.textContent = 'Voice Input';
voiceButton.addEventListener('click', () => {
  isListening = !isListening;

  if (isListening) {
    recognition.start();
    voiceButton.style.backgroundColor = '#ff5c5c';
  } else {
    recognition.stop();
    voiceButton.style.backgroundColor = '';
  }
});

const inputContainer = document.querySelector('.input-container');
inputContainer.appendChild(voiceButton);
