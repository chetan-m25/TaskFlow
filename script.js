const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const tasks = document.querySelectorAll(".task");
const columns = [todo, progress, done];
let dragElement = null;
let tasksData = {};

function buildTaskHTML(tittle, desc) {
  return `
    <div class="task-content">
      <div class="task-main">
        <h2>${tittle}</h2>
        <p>${desc}</p>
      </div>
      <button>Remove</button>
    </div>
  `;
}

function addTask(tittle, desc, column) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");
  div.innerHTML = buildTaskHTML(tittle, desc);
  column.appendChild(div);

  div.addEventListener("drag", () => {
    dragElement = div;
  });

  const deleteButton = div.querySelector("button");
  deleteButton.addEventListener("click", () => {
    div.classList.add("task-removing");
    setTimeout(() => {
      div.remove();
      updateTaskCount();
    }, 120);
  });

  return div;
}

function updateTaskCount() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    tasksData[col.id] = Array.from(tasks).map((t) => {
      return {
        tittle: t.querySelector("h2").innerText,
        desc: t.querySelector("p").innerText,
      };
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
    count.innerText = tasks.length;
  });
}

// load from localStorage
if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));
  for (const col in data) {
    const column = document.querySelector(`#${col}`);
    data[col].forEach((task) => {
      addTask(task.tittle, task.desc, column);
    });
  }
  updateTaskCount();
}

tasks.forEach((task) => {
  task.addEventListener("drag", () => {
    dragElement = task;
  });
});

function addDragEventsOnColumn(column) {
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
    column.appendChild(dragElement);
    column.classList.remove("hover-over");
    updateTaskCount();
  });
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

// Modal logic
const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");
const titleInput = document.querySelector("#task-tittle-input");
const descInput = document.querySelector("#task-desc-input");

function closeModal() {
  modal.classList.remove("active");
}

function openModal() {
  modal.classList.add("active");
  setTimeout(() => {
    titleInput.focus();
  }, 10);
}

toggleModalButton.addEventListener("click", openModal);
modalBg.addEventListener("click", closeModal);

addTaskButton.addEventListener("click", () => {
  const taskTittle = titleInput.value.trim();
  const taskDesc = descInput.value.trim();
  if (taskTittle === "" || taskDesc === "") return;

  addTask(taskTittle, taskDesc, todo);
  updateTaskCount();
  closeModal();

  titleInput.value = "";
  descInput.value = "";
});

// Enter+Ctrl / Enter+Cmd submit
descInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
    addTaskButton.click();
  }
});

// Show today's date
const todayText = document.querySelector("#today-text");
if (todayText) {
  const now = new Date();
  const options = { weekday: "short", day: "numeric", month: "short" };
  todayText.textContent = now.toLocaleDateString(undefined, options);
}
