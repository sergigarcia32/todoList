// Inputs
const form = document.getElementById("taskForm");
const list = document.getElementById("taskList");
const deleteAllBtn = document.getElementById("deleteAllBtn");

const categoryInput = document.getElementById("taskCategory");
const dayInput = document.getElementById("taskday");
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
const editDay = document.getElementById("editDay");
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
  // Definimos el orden de los días
  const dayOrder = [
    "all days",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
    "domingo",
  ];

  // Ordenamos las tareas según el orden definido
  tasks.sort((a, b) => {
    const indexA = dayOrder.indexOf(a.day.toLowerCase());
    const indexB = dayOrder.indexOf(b.day.toLowerCase());
    return indexA - indexB;
  });

  // Luego generamos los <li> como ya hacías
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "py-3 px-2 flex justify-between items-start";

    li.innerHTML = `
    <div>
      <div>
        <span class="text-sm text-gray-500 bg-gray-200 px-2 py-0.5 rounded">${task.day}</span>
        <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">${task.category}</span>
      </div>
      <p class="font-semibold text-gray-500 text-xs mt-1">Inicio: ${task.startDate}</p>
      <p class="font-semibold text-gray-500 text-xs mt-1">${task.startTime} — ${task.endDate}</p>
      <p class="font-semibold text-gray-800">${task.objective}</p>
      <p class="text-gray-600 text-sm">${task.description}</p>
    </div>
    <div class="space-x-2">
      <button data-id="${task.id}" class="editBtn text-blue-600 hover:underline">Editar</button>
      <button data-id="${task.id}" class="deleteBtn text-red-600 hover:underline">Eliminar</button>
    </div>
  `;

    list.appendChild(li);
  });

  // tasks.forEach((task) => {
  //   const li = document.createElement("li");
  //   li.className = "py-3 px-2 flex justify-between items-start";

  //   li.innerHTML = `
  //     <div>
  //       <div><span class="text-sm text-gray-500 bg-gray-200 px-2 py-0.5 rounded">${task.day}</span>  <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">${task.category}</span></div>
  //        <p class="font-semibold text-gray-500 text-xs mt-1">Inicio: ${task.startDate}</p>
  //       <p class="font-semibold text-gray-500 text-xs mt-1">${task.startTime} — ${task.endDate}</p>
  //       <p class="font-semibold text-gray-800">${task.objective}</p>
  //       <p class="text-gray-600 text-sm">${task.description}</p>

  //     </div>
  //     <div class="space-x-2">
  //       <button data-id="${task.id}" class="editBtn text-blue-600 hover:underline">Editar</button>
  //       <button data-id="${task.id}" class="deleteBtn text-red-600 hover:underline">Eliminar</button>
  //     </div>
  //   `;
  //   list.appendChild(li);
  // });
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
    day: dayInput.value,
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
    editDay.value = taskToEdit.day;
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
  taskToEdit.day = editDay.value;
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

// === Exportar tareas ===
const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importInput");

// === Importar tareas ===
importInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedTasks = JSON.parse(e.target.result);

      if (!Array.isArray(importedTasks)) {
        alert("El archivo no contiene un formato válido.");
        return;
      }

      // Confirmación antes de sobrescribir
      if (
        confirm("¿Quieres reemplazar tus tareas actuales con las importadas?")
      ) {
        tasks = importedTasks;
        saveTasks();
        renderTasks();
        alert("Tareas importadas correctamente ✅");
      }
    } catch (error) {
      alert("Error al leer el archivo. Asegúrate de que sea un JSON válido.");
      console.error(error);
    }
  };
  reader.readAsText(file);
});
// === Exportar tareas y abrir Gmail ===
const exportBtn2 = document.getElementById("exportBtn");

exportBtn2.addEventListener("click", () => {
  if (tasks.length === 0) {
    alert("No hay tareas para exportar.");
    return;
  }

  // Generar archivo JSON
  const dataStr = JSON.stringify(tasks, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Descargar archivo automáticamente
  const a = document.createElement("a");
  a.href = url;
  a.download = "tareas.json";
  a.click();
  URL.revokeObjectURL(url);

  // Abrir Gmail con mensaje prellenado
  // 👈 pon aquí tu correo
  const asunto = encodeURIComponent("Mis tareas exportadas 📋");
  const cuerpo = encodeURIComponent(
    `Hola,\n\nTe envío mis tareas exportadas en el archivo "tareas.json".\n\nAdjunta el archivo descargado antes de enviar.\n\nSaludos 👋`
  );

  // Abrir Gmail sin destinatario
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${asunto}&body=${cuerpo}`;
  window.open(gmailUrl, "_blank");
});

// Inicializar
renderTasks();
