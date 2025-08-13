document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const dateInput = document.getElementById('dateInput');
  const categoryInput = document.getElementById('categoryInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const taskList = document.getElementById('taskList');
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function saveTheme() {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }

  function applyTheme() {
    if (darkMode) {
      body.classList.add('dark-mode');
      themeToggle.textContent = '☀️';
    } else {
      body.classList.remove('dark-mode');
      themeToggle.textContent = '🌙';
    }
  }

  themeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    applyTheme();
    saveTheme();
  });

  function renderTasks() {
    taskList.innerHTML = '';
    const today = new Date().toISOString().split('T')[0];

    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      if (task.completed) li.classList.add('completed');
      if (task.dueDate && task.dueDate < today && !task.completed) li.classList.add('overdue');

      const taskText = document.createElement('span');
      taskText.className = 'task-text';
      taskText.textContent = task.text;

      const meta = document.createElement('div');
      meta.className = 'task-meta';
      meta.innerHTML = `
        <span>${task.dueDate || 'No due date'}</span>
        <span>${task.category || 'No category'}</span>
      `;

      const controls = document.createElement('div');
      controls.innerHTML = `
        <button onclick="toggleComplete(${index})">✓</button>
        <button class="delete-btn" onclick="deleteTask(${index})">✗</button>
      `;

      li.appendChild(taskText);
      li.appendChild(meta);
      li.appendChild(controls);
      taskList.appendChild(li);
    });
  }

  addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    const dueDate = dateInput.value;
    const category = categoryInput.value.trim();

    if (text === '') {
      alert('Please enter a task.');
      return;
    }

    tasks.push({ text, dueDate, category, completed: false });
    taskInput.value = '';
    dateInput.value = '';
    categoryInput.value = '';
    saveTasks();
    renderTasks();
  });

  clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all tasks?')) {
      tasks = [];
      saveTasks();
      renderTasks();
    }
  });

  window.deleteTask = function(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  };

  window.toggleComplete = function(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  };

  applyTheme();
  renderTasks();
});