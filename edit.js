document.addEventListener('DOMContentLoaded', () => {
    const editTaskForm = document.getElementById('editTaskForm');
    const editTaskTitle = document.getElementById('editTaskTitle');
    const editTaskDescription = document.getElementById('editTaskDescription');
    const editSaveBtn = document.getElementById('editSave');
    const backBtn = document.getElementById('backBtn');

    const taskId = getParameterByName('id');

    const task = getTaskById(taskId);

    if (task) {
        editTaskTitle.value = task.title;
        editTaskDescription.value = task.description;

        editSaveBtn.addEventListener('click', (event) => {
            event.preventDefault();

            task.title = editTaskTitle.value;
            task.description = editTaskDescription.value;

            updateTask(task);

            window.location.href = `details.html?id=${taskId}`;
        });

        backBtn.addEventListener('click', () => {
            history.back();
        });
    } else {
        console.error('Task not found');
    }
});

function getTaskById(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return tasks.find(task => task.id === id);
}

function updateTask(task) {e
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const index = tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
        tasks[index] = task;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}