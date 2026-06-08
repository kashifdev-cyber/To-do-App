// ==============================
// TASKFLOW PRO
// ==============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

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

const filterButtons =
document.querySelectorAll(".filter-btn");

// ==============================
// INITIALIZE
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    loadTheme();

    renderTasks();

    updateStats();

});

// ==============================
// ADD TASK
// ==============================

addTaskBtn.addEventListener("click", addTask);

taskTitle.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        addTask();

    }

});

function addTask() {

    const title = taskTitle.value.trim();

    if (!title) {

        alert("Please enter a task");

        return;

    }

    const task = {

        id: Date.now(),

        title: title,

        category: taskCategory.value,

        priority: taskPriority.value,

        completed: false,

        createdAt: new Date().toISOString()

    };

    tasks.unshift(task);

    saveTasks();

    renderTasks();

    updateStats();

    taskTitle.value = "";

}

// ==============================
// SAVE
// ==============================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}

// ==============================
// RENDER TASKS
// ==============================

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = [...tasks];

    // Filter

    if (currentFilter === "pending") {

        filteredTasks =
        filteredTasks.filter(
            task => !task.completed
        );

    }

    if (currentFilter === "completed") {

        filteredTasks =
        filteredTasks.filter(
            task => task.completed
        );

    }

    // Search

    const search =
    searchInput.value.toLowerCase();

    filteredTasks =
    filteredTasks.filter(task =>
        task.title.toLowerCase()
        .includes(search)
    );

    // Empty

    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
        <div class="task">
            <div>
                No tasks found
            </div>
        </div>
        `;

        return;

    }

    filteredTasks.forEach(task => {

        const taskElement =
        document.createElement("div");

        taskElement.className = "task";

        taskElement.innerHTML = `

        <div class="task-left">

            <input
            type="checkbox"
            ${task.completed ? "checked" : ""}
            onchange="toggleTask(${task.id})">

            <div>

                <div class="task-title"
                style="
                text-decoration:
                ${task.completed
                ? "line-through"
                : "none"};
                opacity:
                ${task.completed
                ? ".6"
                : "1"};
                ">

                ${task.title}

                </div>

                <div class="task-category">

                    ${task.category}

                </div>

            </div>

        </div>

        <div class="task-actions">

            <div class="priority ${task.priority.toLowerCase()}">

                ${task.priority}

            </div>

            <button
            onclick="editTask(${task.id})">

                <i class="fa-solid fa-pen"></i>

            </button>

            <button
            onclick="deleteTask(${task.id})">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>
        `;

        taskList.appendChild(taskElement);

    });

    document.getElementById(
        "taskCounter"
    ).textContent =
    `${filteredTasks.length} Tasks`;

}

// ==============================
// COMPLETE TASK
// ==============================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            task.completed =
            !task.completed;

        }

        return task;

    });

    saveTasks();

    renderTasks();

    updateStats();

}

// ==============================
// DELETE TASK
// ==============================

function deleteTask(id) {

    if (
        !confirm(
            "Delete this task?"
        )
    ) return;

    tasks =
    tasks.filter(
        task => task.id !== id
    );

    saveTasks();

    renderTasks();

    updateStats();

}

// ==============================
// EDIT TASK
// ==============================

function editTask(id) {

    const task =
    tasks.find(
        task => task.id === id
    );

    const newTitle =
    prompt(
        "Edit Task",
        task.title
    );

    if (
        newTitle === null ||
        newTitle.trim() === ""
    ) return;

    task.title =
    newTitle.trim();

    saveTasks();

    renderTasks();

}

// ==============================
// SEARCH
// ==============================

searchInput.addEventListener(
"input",
() => {

    renderTasks();

});

// ==============================
// FILTERS
// ==============================

filterButtons.forEach(btn => {

    btn.addEventListener(
    "click",
    () => {

        filterButtons.forEach(
            b => b.classList.remove(
                "active"
            )
        );

        btn.classList.add(
            "active"
        );

        currentFilter =
        btn.dataset.filter;

        renderTasks();

    });

});

// ==============================
// STATS
// ==============================

function updateStats() {

    const total =
    tasks.length;

    const completed =
    tasks.filter(
        task => task.completed
    ).length;

    const pending =
    total - completed;

    const rate =
    total === 0
    ? 0
    : Math.round(
        completed /
        total *
        100
    );

    document.getElementById(
        "totalTasks"
    ).textContent =
    total;

    document.getElementById(
        "completedTasks"
    ).textContent =
    completed;

    document.getElementById(
        "pendingTasks"
    ).textContent =
    pending;

    document.getElementById(
        "completionRate"
    ).textContent =
    rate + "%";

    document.getElementById(
        "productivityScore"
    ).textContent =
    rate + "%";

    document.getElementById(
        "progressText"
    ).textContent =
    rate + "%";

    document.getElementById(
        "progressFill"
    ).style.width =
    rate + "%";

    updateCategoryStats();

}

// ==============================
// CATEGORY COUNTS
// ==============================

function updateCategoryStats() {

    const categories = {

        Work: 0,
        Study: 0,
        Personal: 0,
        Health: 0,
        Shopping: 0

    };

    tasks.forEach(task => {

        if (
            categories[
                task.category
            ] !== undefined
        ) {

            categories[
                task.category
            ]++;

        }

    });

    document.getElementById(
        "workCount"
    ).textContent =
    categories.Work;

    document.getElementById(
        "studyCount"
    ).textContent =
    categories.Study;

    document.getElementById(
        "personalCount"
    ).textContent =
    categories.Personal;

    document.getElementById(
        "healthCount"
    ).textContent =
    categories.Health;

    document.getElementById(
        "shoppingCount"
    ).textContent =
    categories.Shopping;

}

// ==============================
// THEMES
// ==============================

function setTheme(theme) {

    const root =
    document.documentElement;

    const themes = {

        blue: {
            primary:"#00c2ff",
            secondary:"#0066ff"
        },

        purple: {
            primary:"#7c5cff",
            secondary:"#c04cff"
        },

        green: {
            primary:"#00d68f",
            secondary:"#00ff99"
        },

        orange: {
            primary:"#ff9800",
            secondary:"#ff5e00"
        },

        red: {
            primary:"#ff4d6d",
            secondary:"#ff0055"
        }

    };

    root.style.setProperty(
        "--primary",
        themes[theme].primary
    );

    root.style.setProperty(
        "--secondary",
        themes[theme].secondary
    );

    localStorage.setItem(
        "theme",
        theme
    );

}

// ==============================
// LOAD THEME
// ==============================

function loadTheme() {

    const savedTheme =
    localStorage.getItem(
        "theme"
    );

    if (savedTheme) {

        setTheme(savedTheme);

    }

}

// ==============================
// KEYBOARD SHORTCUTS
// ==============================

document.addEventListener(
"keydown",
(e) => {

    if (
        e.ctrlKey &&
        e.key === "f"
    ) {

        e.preventDefault();

        searchInput.focus();

    }

});

// ==============================
// DEMO TASKS
// ==============================

if (tasks.length === 0) {

    tasks = [

        {
            id:1,
            title:"Build Portfolio Website",
            category:"Work",
            priority:"High",
            completed:false
        },

        {
            id:2,
            title:"Complete JavaScript Project",
            category:"Study",
            priority:"Medium",
            completed:false
        },

        {
            id:3,
            title:"Gym Workout",
            category:"Health",
            priority:"Low",
            completed:true
        }

    ];

    saveTasks();

}