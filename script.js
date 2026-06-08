// ==============================
// TASKFLOW PRO CLEAN VERSION
// ==============================

let tasks = [];
localStorage.removeItem("tasks");
let currentFilter = "all";

// ==============================
// ELEMENTS
// ==============================

const taskList = document.getElementById("taskList");
const taskTitle = document.getElementById("taskTitle");
const taskCategory = document.getElementById("taskCategory");
const taskPriority = document.getElementById("taskPriority");
const addTaskBtn = document.getElementById("addTaskBtn");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");

// ==============================
// INIT
// ==============================

document.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    renderTasks();
    updateStats();
});

// ==============================
// ADD TASK
// ==============================

function addTask() {
    const title = taskTitle.value.trim();
    if (!title) return alert("Please enter a task");

    const task = {
        id: Date.now(),
        title,
        category: taskCategory.value,
        priority: taskPriority.value,
        completed: false
    };

    tasks.unshift(task);
    saveTasks();
    renderTasks();
    updateStats();

    taskTitle.value = "";
}

addTaskBtn.addEventListener("click", addTask);

taskTitle.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

// ==============================
// SAVE
// ==============================

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ==============================
// RENDER TASKS
// ==============================

function renderTasks() {
    taskList.innerHTML = "";

    let filtered = [...tasks];

    // FILTER
    if (currentFilter === "pending") {
        filtered = filtered.filter(t => !t.completed);
    }

    if (currentFilter === "completed") {
        filtered = filtered.filter(t => t.completed);
    }

    // SEARCH
    const search = searchInput.value.toLowerCase();
    filtered = filtered.filter(t =>
        (t.title || "").toLowerCase().includes(search)
    );

    // EMPTY STATE
    if (filtered.length === 0) {
        taskList.innerHTML = `
            <div class="task" style="text-align:center; padding:20px; opacity:0.7;">
                🚀 No tasks found. Add your first task!
            </div>
        `;

        document.getElementById("taskCounter").textContent =
            `${tasks.length} Total Tasks`;

        return;
    }

    // RENDER TASKS
    filtered.forEach(task => {
        const div = document.createElement("div");
        div.className = "task";

        const priority = task.priority || "Low";
        const category = task.category || "General";

        div.innerHTML = `
            <div class="task-left">
                <input type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})">

                <div>
                    <div class="task-title"
                        style="text-decoration:${task.completed ? "line-through" : "none"};
                        opacity:${task.completed ? 0.6 : 1}">
                        ${task.title}
                    </div>

                    <div class="task-category">
                        ${category}
                    </div>
                </div>
            </div>

            <div class="task-actions">
                <div class="priority ${priority.toLowerCase()}">
                    ${priority}
                </div>

                <button onclick="editTask(${task.id})">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button onclick="deleteTask(${task.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        taskList.appendChild(div);
    });

    document.getElementById("taskCounter").textContent =
        `${filtered.length} Tasks`;
}

// ==============================
// TASK ACTIONS
// ==============================

function toggleTask(id) {
    tasks = tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
    );

    saveTasks();
    renderTasks();
    updateStats();
}

function deleteTask(id) {
    if (!confirm("Delete this task?")) return;

    tasks = tasks.filter(t => t.id !== id);

    saveTasks();
    renderTasks();
    updateStats();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newTitle = prompt("Edit Task", task.title);

    if (!newTitle || !newTitle.trim()) return;

    task.title = newTitle.trim();

    saveTasks();
    renderTasks();
}

// ==============================
// SEARCH
// ==============================

searchInput.addEventListener("input", renderTasks);

// ==============================
// FILTERS
// ==============================

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// ==============================
// STATS
// ==============================

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    const rate = total ? Math.round((completed / total) * 100) : 0;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;

    document.getElementById("completionRate").textContent = rate + "%";
    document.getElementById("productivityScore").textContent = rate + "%";

    document.getElementById("progressText").textContent = rate + "%";
    document.getElementById("progressFill").style.width = rate + "%";

    updateCategoryStats();
}

// ==============================
// CATEGORY STATS
// ==============================

function updateCategoryStats() {
    const categories = {
        Work: 0,
        Study: 0,
        Personal: 0,
        Health: 0,
        Shopping: 0
    };

    tasks.forEach(t => {
        if (categories[t.category] !== undefined) {
            categories[t.category]++;
        }
    });

    document.getElementById("workCount").textContent = categories.Work;
    document.getElementById("studyCount").textContent = categories.Study;
    document.getElementById("personalCount").textContent = categories.Personal;
    document.getElementById("healthCount").textContent = categories.Health;
    document.getElementById("shoppingCount").textContent = categories.Shopping;
}

// ==============================
// THEME
// ==============================

function setTheme(theme) {
    const root = document.documentElement;

    const themes = {
        blue: { primary: "#00c2ff", secondary: "#0066ff" },
        purple: { primary: "#7c5cff", secondary: "#c04cff" },
        green: { primary: "#00d68f", secondary: "#00ff99" },
        orange: { primary: "#ff9800", secondary: "#ff5e00" },
        red: { primary: "#ff4d6d", secondary: "#ff0055" }
    };

    if (!themes[theme]) return;

    root.style.setProperty("--primary", themes[theme].primary);
    root.style.setProperty("--secondary", themes[theme].secondary);

    localStorage.setItem("theme", theme);
}

function loadTheme() {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
}

// ==============================
// SHORTCUT
// ==============================

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        searchInput.focus();
    }
});
