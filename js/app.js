// Inputs
const form = document.getElementById("taskForm");
const list = document.getElementById("taskList");
const deleteAllBtn = document.getElementById("deleteAllBtn");

const categoryInput = document.getElementById("taskCategory");
const objectiveInput = document.getElementById("taskObjective");
const descriptionInput = document.getElementById("taskDescription");
const startDateInput = document.getElementById("taskStartDate");
const startTimeInput = document.getElementById("taskStartTime");
const endDateInput = document.getElementById("taskEndDate");

// Modal
const editModal = document.getElementById("editModal");
const closeModal = document.getElementById("closeModal");

const editForm = document.getElementById("editForm");
const editCategory = document.getElementById("editCategory");
const editObjective = document.getElementById("editObjective");
const editDescription = document.getElementById("editDescription");
const editStartDate = document.getElementById("editStartDate");
const editStartTime = document.getElementById("editStartTime");
const editEndDate = document.getElementById("editEndDate");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let taskToEdit = null;

// Render
function renderTasks() {
  list.innerHTML = "";

  if (tasks.length === 0) {
    list.innerHTML = `<li class="text-center text-gray-500 py-4">No hay tareas</li>`;
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "py-3 px-2 flex justify-between items-start";

    li.innerHTML = `
      <div>
        <p class="font-semibold text-gray-800">${task.objective} <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">${task.category}</span></p>
        <p class="text-gray-600 text-sm">${task.description}</p>
        <p class="text-gray-500 text-xs mt-1">Inicio: ${task.startDate} ${task.startTime} — Fin: ${task.endDate}</p>
      </div>
      <div class="space-x-2">
        <button data-id="${task.id}" class="editBtn text-blue-600 hover:underline">Editar</button>
        <button data-id="${task.id}" class="deleteBtn text-red-600 hover:underline">Eliminar</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Crear tarea
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const task = {
    id: Date.now(),
    category: categoryInput.value,
    objective: objectiveInput.value.trim(),
    description: descriptionInput.value.trim(),
    startDate: startDateInput.value,
    startTime: startTimeInput.value,
    endDate: endDateInput.value,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  form.reset();
});

// Editar o eliminar
list.addEventListener("click", (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("editBtn")) {
    taskToEdit = tasks.find((t) => t.id == id);
    editCategory.value = taskToEdit.category;
    editObjective.value = taskToEdit.objective;
    editDescription.value = taskToEdit.description;
    editStartDate.value = taskToEdit.startDate;
    editStartTime.value = taskToEdit.startTime;
    editEndDate.value = taskToEdit.endDate;

    editModal.classList.remove("hidden");
    editModal.classList.add("flex");
  }

  if (e.target.classList.contains("deleteBtn")) {
    tasks = tasks.filter((t) => t.id != id);
    saveTasks();
    renderTasks();
  }
});

// Guardar edición
editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  taskToEdit.category = editCategory.value;
  taskToEdit.objective = editObjective.value.trim();
  taskToEdit.description = editDescription.value.trim();
  taskToEdit.startDate = editStartDate.value;
  taskToEdit.startTime = editStartTime.value;
  taskToEdit.endDate = editEndDate.value;

  tasks = tasks.map((t) => (t.id === taskToEdit.id ? taskToEdit : t));
  saveTasks();
  renderTasks();
  closeEditModal();
});

// Eliminar todo
deleteAllBtn.addEventListener("click", () => {
  if (tasks.length === 0) return alert("No hay tareas para eliminar.");

  if (confirm("¿Seguro que quieres eliminar TODAS las tareas?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

// Cerrar modal
closeModal.addEventListener("click", closeEditModal);
function closeEditModal() {
  editModal.classList.add("hidden");
  editModal.classList.remove("flex");
  taskToEdit = null;
}

// Inicializar
renderTasks();
