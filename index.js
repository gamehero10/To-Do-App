document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const dateInput = document.getElementById('dateInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = '';
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      if (task.completed) li.classList.add('completed');
      if (task.dueDate && task.dueDate < today && !task.completed) li.classList.add('overdue');

      const taskInfo = document.createElement('div');
      taskInfo.className = 'task-info';

      const taskText = document.createElement('span');
      taskText.className = 'task-text';
      taskText.textContent = task.text;

      const taskDate = document.createElement('div');
      taskDate.className = 'task-date';
      taskDate.textContent = task.dueDate ? `Due: ${task.dueDate}` : 'No due date';

      taskInfo.appendChild(taskText);
      taskInfo.appendChild(taskDate);

      const controls = document.createElement('div');
      controls.innerHTML = `
        <button onclick="toggleComplete(${index})">✓</button>
        <button class="delete-btn" onclick="deleteTask(${index})">✗</button>
      `;

      li.appendChild(taskInfo);
      li.appendChild(controls);

      taskList.appendChild(li);
    });
  }

  addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    const dueDate = dateInput.value;

    if (text === '') {
      alert('Please enter a task.');
      return;
    }

    tasks.push({ text, dueDate, completed: false });
    taskInput.value = '';
    dateInput.value = '';
    saveTasks();
    renderTasks();
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

  renderTasks();
});