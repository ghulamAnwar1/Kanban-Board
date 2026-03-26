let tasksData = {};
const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const columns = [todo, progress, done];
let dragElement = null;

function addTask(title, desc, column) {
  const div = document.createElement("div");

  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
  <h2>${title}</h2>
  <p>${desc}</p>
  <button>Delete</button>
  `;

  column.appendChild(div);

  div.addEventListener("dragstart", (e) => {
    dragElement = div;
  });

  const deleteButton = div.querySelector("button");
  deleteButton.addEventListener("click", () => {
    div.remove();
    updateTaskCount();
    saveTasks();
  });

  return div;
}

function updateTaskCount() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");
    count.innerText = tasks.length;
  });
}

function saveTasks() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    tasksData[col.id] = Array.from(tasks).map((t) => {
      return {
        title: t.querySelector("h2").innerText,
        desc: t.querySelector("p").innerText,
      };
    });
    localStorage.setItem("tasks", JSON.stringify(tasksData));
  });
}

// Load tasks from localStorage
if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));
  for (const col in data) {
    const column = document.querySelector(`#${col}`);
    if (column) {
      data[col].forEach((task) => {
        addTask(task.title, task.desc, column);
      });
    }
  }
  updateTaskCount();
}

function addDragEventOnColumn(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();

    if (dragElement) {
      column.appendChild(dragElement);
    }
    column.classList.remove("hover-over");

    updateTaskCount();
    saveTasks();
  });
}

addDragEventOnColumn(todo);
addDragEventOnColumn(progress);
addDragEventOnColumn(done);

// Modal related logic
const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");

toggleModalButton.addEventListener("click", () => {
  modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

addTaskButton.addEventListener("click", () => {
  const taskTitle = document.querySelector("#task-title-input").value;
  const taskDesc = document.querySelector("#task-desc-input").value;

  if (taskTitle.trim() === "") {
    alert("Please enter a task title");
    return;
  }

  addTask(taskTitle, taskDesc, todo);

  // Clear inputs
  document.querySelector("#task-title-input").value = "";
  document.querySelector("#task-desc-input").value = "";

  updateTaskCount();
  saveTasks();

  modal.classList.remove("active");
});
