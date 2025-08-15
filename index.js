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

  // Create task info block
  const taskInfo = document.createElement('div');
  taskInfo.className = 'task-info';

  const taskText = document.createElement('span');
  taskText.className = 'task-text';
  taskText.textContent = task.text;

  const taskMeta = createTaskMeta(task);
  taskInfo.appendChild(taskText);
  taskInfo.appendChild(taskMeta);

  // Create controls (✓, ✗)
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