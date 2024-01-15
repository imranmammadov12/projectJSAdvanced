class Task {
    constructor(title, description, status){
        this.title = title;
        this.description = description;
        this.status = status;
        this.id = uniqId();
        this.createDate = new Date().toLocaleDateString();
    }

    setStatus(status) {
        this.status = status;
    }
}

function uniqId() {
    return Math.random().toString(16).slice(2);
}

class TasksList {
    constructor(){
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    addTask(task) {
        this.tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        console.log('Task added to localStorage:', task); ///////////
    }
    updateTask(task) {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
            this.tasks[index] = task;
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        }
    }

    removeTaskById(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        updatedTasks();
    }
}

const addBtn = document.querySelector('#addTaskBtn');
const removeSelectedTaskBtn = document.querySelector('#removeSelectedTaskBtn');
const closeBtn = document.querySelector('.close');
const sortSelect = document.getElementById('sortSelect');
const filterSelect = document.getElementById('filterSelect');

function openModal() {
    document.querySelector('#taskModal').style.display = 'flex';
}

function closeModal() {
    document.querySelector('#taskModal').style.display = 'none';
}

addBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);

const taskTitle = document.querySelector('#taskTitle');
const taskDesc = document.querySelector('#taskDescription');
const saveBtn = document.querySelector('#save');

const tasksList = new TasksList();

/// regexp

const validWordRegex = /^[A-Za-zА-Яа-яёЁ\d\s]+$/;
const minWordLength = 1;
const maxWordLength = 16;

function isValidWord(word) {
return validWordRegex.test(word) && word.length >= minWordLength && word.length <= maxWordLength;
}


saveBtn.addEventListener('click', (event) => {
event.preventDefault();

const titleValue = taskTitle.value;
const descriptionValue = taskDesc.value;

if (
    !isValidWord(titleValue) ||
    !isValidWord(descriptionValue)
) {
    alert(`Invalid input. Title and description should consist only of English letters, Russian letters, or numbers and have a length between ${minWordLength} and ${maxWordLength} characters.`);
    return;
}

const task = new Task(titleValue, descriptionValue, "notDone");

tasksList.addTask(task);

updatedTasks();

closeModal();
});

removeSelectedTaskBtn.addEventListener('click', () => {
    const selectedTasks = document.querySelectorAll('.task-item input[type="checkbox"]:checked');
    selectedTasks.forEach(checkbox => {
        const taskId = checkbox.getAttribute('data-task-id');
        tasksList.removeTaskById(taskId);
    });
});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('task-link')) {
        event.preventDefault();
        const url = event.target.href;
        window.location.href = url;
    }

    if (event.target.classList.contains('edit-task')) {
        event.preventDefault();
        const taskId = event.target.getAttribute('data-task-id');
        console.log('Task ID on edit click:', taskId); //........
        window.location.href = `edit.html?id=${taskId}`;
    }
});

sortSelect.addEventListener('change', updatedTasks);
filterSelect.addEventListener('change', updatedTasks);

window.addEventListener('load', () => {
    updatedTasks();
});

function updatedTasks() {
    const taskListContainer = document.querySelector('.task-list');
    taskListContainer.innerHTML = '';

    const sortValue = sortSelect.value;
    const filterValue = filterSelect.value;

    const filteredTasks = tasksList.tasks.filter(task => {
        if (filterValue === 'all') return true;
        return (filterValue === 'done' && task.status === 'done') || (filterValue === 'notDone' && task.status === 'notDone');
    });

    filteredTasks.sort((a, b) => {
        if (sortValue === 'date') {
            return new Date(b.createDate) - new Date(a.createDate);
        } else if (sortValue === 'name') {
            return a.title.localeCompare(b.title);
        }
        return 0;
    });

    filteredTasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');

        const titleElement = document.createElement('h3');
        titleElement.classList.add('task-title');
        titleElement.textContent = task.title;

        const editButton = document.createElement('button');
        editButton.classList.add('edit-task');
        editButton.textContent = 'Edit';
        editButton.setAttribute('data-task-id', task.id);

        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('data-task-id', task.id);

        const statusLabel = document.createElement('label');
        statusLabel.textContent = 'Status:';

        const statusSelect = document.createElement('select');
        statusSelect.classList.add('task-status-control');
        const optionNotDone = document.createElement('option');
        optionNotDone.value = 'notDone';
        optionNotDone.textContent = 'Not Done';
        const optionDone = document.createElement('option');
        optionDone.value = 'done';
        optionDone.textContent = 'Done';

        statusSelect.appendChild(optionNotDone);
        statusSelect.appendChild(optionDone);

        statusSelect.value = task.status; 

        statusSelect.addEventListener('change', (event) => {
            const selectedStatus = event.target.value;
            task.setStatus(selectedStatus);
            tasksList.updateTask(task); 
            updatedTasks(); 
        });

        const descriptionElement = document.createElement('p');
        descriptionElement.classList.add('task-description');
        
        const linkElement = document.createElement('a');
        linkElement.classList.add('task-link');
        linkElement.textContent = task.description;
        linkElement.href = `details.html?id=${task.id}`;

        descriptionElement.appendChild(linkElement);

        taskItem.appendChild(titleElement);
        taskItem.appendChild(editButton);
        taskItem.appendChild(checkbox);
        taskItem.appendChild(statusLabel);
        taskItem.appendChild(statusSelect);
        taskItem.appendChild(descriptionElement); 

        taskListContainer.appendChild(taskItem);
    });
}
