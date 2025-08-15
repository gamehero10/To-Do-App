document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const dateInput = document.getElementById('dateInput');
  const categoryInput = document.getElementById('categoryInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Load tasks and theme
  let tasks = loadTasks();
  let darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;

  // Save tasks safely
  function saveTasks() {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
      alert('Unable to save your tasks.');
    }
  }

  // Load tasks safely
  function loadTasks() {
    try {
      const data = localStorage.getItem('tasks');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
      alert('There was a problem loading your tasks.');
      return [];
    }
  }

  // Save and apply theme
  function saveTheme() {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
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
    try {
      darkMode = !darkMode;
      applyTheme();
      saveTheme();
    } catch (error) {
      console.error('Theme toggle error:', error);
      alert('Could not toggle theme.');
    }
  });

  addTaskBtn.addEventListener('click', () => {
    try {
      const text = taskInput.value.trim();
      const dueDate = dateInput.value;
      const category = categoryInput.value.trim();

      if (!text) {
        alert('Please enter a task.');
        return;
      }

      if (dueDate && isNaN(Date.parse(dueDate))) {
        alert('Please enter a valid due date.');
        return;
      }

      tasks.push({ text, dueDate, category, completed: false });

      taskInput.value = '';
      dateInput.value = '';
      categoryInput.value = '';

      saveTasks();
      renderTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Something went wrong while adding the task.');
    }
  });

  window.deleteTask = function(index) {
    try {
      if (index < 0 || index >= tasks.length) throw new Error('Invalid task index');
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Could not delete task.');
    }
  };

  window.toggleComplete = function(index) {
    try {
      if (index < 0 || index >= tasks.length) throw new Error('Invalid task index');
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
      alert('Could not update task.');
    }
  };

  function renderTasks() {
    taskList.innerHTML = '';
    const today = new Date().toISOString().split('T')[0];

    tasks.forEach((task, index) => {
      const li = createTaskItem(task, index, today);
      taskList.appendChild(li);
    });
  }

  function createTaskItem(task, index, today) {
    const li = document.createElement('li');

    if (task.completed) li.classList.add('completed');
    if (task.dueDate && task.dueDate < today && !task.completed) {
      li.classList.add('overdue');
    }

    const taskInfo = document.createElement('div');
    taskInfo.className = 'task-info';

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    const taskMeta = createTaskMeta(task);
    taskInfo.appendChild(taskText);
    taskInfo.appendChild(taskMeta);

    const controls = document.createElement('div');
    controls.appendChild(createButton('✓', () => toggleComplete(index)));
    controls.appendChild(createButton('✗', () => deleteTask(index), 'delete-btn'));

    li.appendChild(taskInfo);
    li.appendChild(controls);

    return li;
  }

  function createTaskMeta(task) {
    const meta = document.createElement('div');
    meta.className = 'task-meta';

    const due = document.createElement('span');
    due.textContent = task.dueDate ? `Due: ${task.dueDate}` : 'No due date';

    const category = document.createElement('span');
    category.className = 'task-category';
    category.textContent = task.category || 'Uncategorized';

    meta.appendChild(due);
    meta.appendChild(category);
    return meta;
  }

  function createButton(text, onClick, className = '') {
    const button = document.createElement('button');
    button.textContent = text;
    if (className) button.classList.add(className);
    button.addEventListener('click', onClick);
    return button;
  }

  // Initialize
  applyTheme();
  renderTasks();
});