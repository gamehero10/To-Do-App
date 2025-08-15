document.addEventListener('DOMContentLoaded', () => {
  // Translations
  const translations = {
    en: {
      addTaskPlaceholder: "Enter a new task...",
      addButton: "Add",
      taskDue: "Due:",
      noDueDate: "No due date",
      uncategorized: "Uncategorized",
      pleaseEnterTask: "Please enter a task.",
      invalidDueDate: "Please enter a valid due date.",
      couldNotDelete: "Could not delete task.",
      couldNotUpdate: "Could not update task.",
      themeToggleLight: "☀️",
      themeToggleDark: "🌙",
      languageLabel: "Language:"
    },
    es: {
      addTaskPlaceholder: "Ingrese una nueva tarea...",
      addButton: "Añadir",
      taskDue: "Para:",
      noDueDate: "Sin fecha límite",
      uncategorized: "Sin categoría",
      pleaseEnterTask: "Por favor ingrese una tarea.",
      invalidDueDate: "Por favor ingrese una fecha válida.",
      couldNotDelete: "No se pudo eliminar la tarea.",
      couldNotUpdate: "No se pudo actualizar la tarea.",
      themeToggleLight: "☀️",
      themeToggleDark: "🌙",
      languageLabel: "Idioma:"
    }
  };

  // Elements
  const taskInput = document.getElementById('taskInput');
  const dateInput = document.getElementById('dateInput');
  const categoryInput = document.getElementById('categoryInput');
  const locationInput = document.getElementById('locationInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const langSelect = document.getElementById('langSelect');

  // Localization helpers
  let currentLang = 'en';

  function t(key) {
    return translations[currentLang][key] || translations['en'][key] || key;
  }

  let tasks = loadTasks();
  let darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;

  // Detect user language
  const userLang = navigator.language.slice(0, 2);
  currentLang = translations[userLang] ? userLang : 'en';
  langSelect.value = currentLang;

  // Save/load tasks
  function saveTasks() {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
      alert('Unable to save your tasks.');
    }
  }

  function loadTasks() {
    try {
      const data = localStorage.getItem('tasks');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load tasks:', error);
      alert('There was a problem loading your tasks.');
      return [];
    }
  }

  // Theme functions
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
      themeToggle.textContent = t('themeToggleLight');
    } else {
      body.classList.remove('dark-mode');
      themeToggle.textContent = t('themeToggleDark');
    }
  }

  themeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    applyTheme();
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  });

  // Localization UI update
  function updateUIStrings() {
    taskInput.placeholder = t('addTaskPlaceholder');
    addTaskBtn.textContent = t('addButton');
    document.querySelector('label[for="langSelect"]').textContent = t('languageLabel');
    renderTasks();
    applyTheme();
  }

  langSelect.addEventListener('change', () => {
    currentLang = langSelect.value;
    updateUIStrings();
  });

  updateUIStrings();

  // Add Task button
  addTaskBtn.addEventListener('click', () => {
    try {
      const text = taskInput.value.trim();
      const dueDate = dateInput.value;
      const category = categoryInput.value.trim();
      const location = locationInput.value.trim();

      if (!text) {
        alert(t('pleaseEnterTask'));
        return;
      }

      if (dueDate && isNaN(Date.parse(dueDate))) {
        alert(t('invalidDueDate'));
        return;
      }

      const newTask = { text, dueDate, category, completed: false };

      const addAndRender = (weather = null) => {
        if (weather) newTask.weather = weather;
        tasks.push(newTask);
        saveTasks();
        renderTasks();
      };

      if (location) {
        fetchWeather(location).then(addAndRender).catch(err => {
          console.warn('Weather fetch failed:', err);
          addAndRender(); // continue without weather
        });
      } else {
        addAndRender();
      }

      taskInput.value = '';
      dateInput.value = '';
      categoryInput.value = '';
      locationInput.value = '';
    } catch (e) {
      console.error('Add task error:', e);
    }
  });

  // Delete and toggle complete with error handling
  window.deleteTask = function(index) {
    try {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert(t('couldNotDelete'));
    }
  };

  window.toggleComplete = function(index) {
    try {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
      alert(t('couldNotUpdate'));
    }
  };

  // Render tasks
  function renderTasks() {
    taskList.innerHTML = '';
    const today = new Date().toISOString().split('T')[0];

    tasks.forEach((task, index) => {
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

      const meta = document.createElement('div');
      meta.className = 'task-meta';

      const due = document.createElement('span');
      due.textContent = task.dueDate ? `${t('taskDue')} ${task.dueDate}` : t('noDueDate');
      meta.appendChild(due);

      const category = document.createElement('span');
      category.className = 'task-category';
      category.textContent = task.category || t('uncategorized');
      meta.appendChild(category);

      if (task.weather) {
        const weather = document.createElement('span');
        weather.textContent = `Weather: ${task.weather}`;
        meta.appendChild(weather);
      }

      taskInfo.appendChild(taskText);
      taskInfo.appendChild(meta);

      const controls = document.createElement('div');
      controls.appendChild(createButton('✓', () => toggleComplete(index)));
      controls.appendChild(createButton('✗', () => deleteTask(index), 'delete-btn'));

      li.appendChild(taskInfo);
      li.appendChild(controls);
      taskList.appendChild(li);
    });
  }

  function createButton(label, onClick, className = '') {
    const btn = document.createElement('button');
    btn.textContent = label;
    if (className) btn.className = className;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function createTaskMeta(task) {
    const meta = document.createElement('div');
    meta.className = 'task-meta';

    const due = document.createElement('span');
    due.textContent = task.dueDate ? `${t('taskDue')} ${task.dueDate}` : t('noDueDate');

    const category = document.createElement('span');
    category.className = 'task-category';
    category.textContent = task.category || t('uncategorized');

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