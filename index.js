document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
  
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));  
    }
  
    function renderTasks() {
      taskList.innerHTML = '';
      tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
          <span>${task.text}</span>
          <div>
            <button onclick="toggleComplete(${index})">✓</button>
            <button class="delete-btn" onclick="deleteTask(${index})">✗</button>
          </div>
        `;
        taskList.appendChild(li);
      });
    }
  
    addTaskBtn.addEventListener('click', () => {
      const text = taskInput.value.trim();
      if (text !== '') {
        tasks.push({ text, completed: false });
        taskInput.value = '';
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
  
    renderTasks();
  });