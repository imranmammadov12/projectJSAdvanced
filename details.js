document.addEventListener('DOMContentLoaded', () => {
    const detailsTitle = document.getElementById('detailsTitle');
    const detailsDescription = document.getElementById('detailsDescription');
    const detailsStatus = document.getElementById('detailsStatus');
    const detailsCreateDate = document.getElementById('detailsCreateDate');

    const taskId = getParameterByName('id');
    console.log('Task ID from URL:', taskId);

    if (taskId) {  
        const task = getTaskById(taskId);

        if (task) {
            detailsTitle.textContent = task.title;
            detailsDescription.textContent = task.description;
            detailsStatus.textContent = task.status;
            detailsCreateDate.textContent = task.createDate;
        } else {
            console.error('Task not found');
        }
    } else {
        console.error('TaskId is missing');
    }
});

function getTaskById(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIds = tasks.map(task => task.id);
    console.log('All task IDs in localStorage:', taskIds);
    const foundTask = tasks.find(task => task.id === id);
    return foundTask;
}