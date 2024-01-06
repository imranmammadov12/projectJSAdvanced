class Task {
    constructor(title, description, status){
        this.title = title;
        this.description = description;
        this.status = status;
        this.id = uniqId();
        this.createDate = new Date().toLocaleDateString();
    }
}

function uniqId() {
    return Math.random().toString(16).slice(2);
}

class TasksList {
    constructor(){
        this.tasks = [];
    }


    addTask(task) {
        this.tasks.push(task);
    }

    getTaskById(id) {
        return this.tasks.find(task => task.id === id);
    }
}


const addBtn = document.querySelector('#addTaskBtn');

const closeBtn = document.querySelector('.close');

function openModal() {
    document.querySelector('#taskModal').style.display = 'flex';
  }

  function closeModal() {
    document.querySelector('#taskModal').style.display = 'none';
  }

addBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);