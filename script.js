// ======================================================
// TASKFLOW PRO
// Part 1 - Architecture & Storage
// ======================================================

class TaskFlow {

    constructor() {

        // Storage Keys
        this.STORAGE_KEY = "taskflow_tasks";
        this.THEME_KEY = "taskflow_theme";

        // State
        this.tasks = [];
        this.currentFilter = "all";
        this.currentEditId = null;

        // Elements
        this.elements = {};

        this.initialize();
    }

    // ==================================================
    // APP STARTUP
    // ==================================================

    initialize() {

        this.cacheElements();

        this.loadTasks();

        this.loadTheme();

        this.bindEvents();

        this.render();

        console.log(
            "%cTaskFlow Pro Initialized",
            "color:#4ade80;font-weight:bold;"
        );
    }

    // ==================================================
    // CACHE DOM ELEMENTS
    // ==================================================

    cacheElements() {

        this.elements = {

            // Inputs
            taskTitle:
                document.getElementById("taskTitle"),

            taskCategory:
                document.getElementById("taskCategory"),

            taskPriority:
                document.getElementById("taskPriority"),

            taskDueDate:
                document.getElementById("taskDueDate"),

            searchInput:
                document.getElementById("searchInput"),

            // Buttons
            addTaskBtn:
                document.getElementById("addTaskBtn"),

            exportBtn:
                document.getElementById("exportBtn"),

            importBtn:
                document.getElementById("importBtn"),

            importFile:
                document.getElementById("importFile"),

            menuToggle:
                document.getElementById("menuToggle"),

            saveEditBtn:
                document.getElementById("saveEditBtn"),

            // Containers
            taskList:
                document.getElementById("taskList"),

            // Stats
            totalTasks:
                document.getElementById("totalTasks"),

            completedTasks:
                document.getElementById("completedTasks"),

            pendingTasks:
                document.getElementById("pendingTasks"),

            completionRate:
                document.getElementById("completionRate"),

            productivityScore:
                document.getElementById("productivityScore"),

            progressText:
                document.getElementById("progressText"),

            progressFill:
                document.getElementById("progressFill"),

            taskCounter:
                document.getElementById("taskCounter"),

            // Categories
            workCount:
                document.getElementById("workCount"),

            studyCount:
                document.getElementById("studyCount"),

            personalCount:
                document.getElementById("personalCount"),

            healthCount:
                document.getElementById("healthCount"),

            shoppingCount:
                document.getElementById("shoppingCount"),

            // Modal
            editModal:
                document.getElementById("editModal"),

            editTitle:
                document.getElementById("editTitle"),

            // Sidebar
            sidebar:
                document.getElementById("sidebar"),

            // Toast
            toast:
                document.getElementById("toast")
        };
    }

    // ==================================================
    // STORAGE
    // ==================================================

    loadTasks() {

        try {

            const stored =
                localStorage.getItem(
                    this.STORAGE_KEY
                );

            this.tasks =
                stored
                    ? JSON.parse(stored)
                    : [];

        } catch (error) {

            console.error(
                "Failed to load tasks",
                error
            );

            this.tasks = [];
        }
    }

    saveTasks() {

        try {

            localStorage.setItem(
                this.STORAGE_KEY,
                JSON.stringify(this.tasks)
            );

        } catch (error) {

            console.error(
                "Failed to save tasks",
                error
            );
        }
    }

    // ==================================================
    // THEME STORAGE
    // ==================================================

    loadTheme() {

        const savedTheme =
            localStorage.getItem(
                this.THEME_KEY
            );

        if (!savedTheme) {
            return;
        }

        document.body.dataset.theme =
            savedTheme;
    }

    saveTheme(theme) {

        document.body.dataset.theme =
            theme;

        localStorage.setItem(
            this.THEME_KEY,
            theme
        );
    }

    // ==================================================
    // TASK FACTORY
    // ==================================================

    createTask({

        title,
        category,
        priority,
        dueDate

    }) {

        return {

            id:
                crypto.randomUUID(),

            title,

            category,

            priority,

            dueDate,

            completed: false,

            createdAt:
                new Date().toISOString(),

            updatedAt: null
        };
    }

    // ==================================================
    // EVENT BINDINGS
    // ==================================================

    bindEvents() {

        // Add Task
        this.elements.addTaskBtn?.addEventListener(
            "click",
            () => this.addTask()
        );

        // Enter Key
        this.elements.taskTitle?.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Enter") {

                    this.addTask();
                }
            }
        );

        // Search
        this.elements.searchInput?.addEventListener(
            "input",
            () => this.render()
        );

        // Filters
        document
            .querySelectorAll(".filter-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(".filter-btn")
                            .forEach(btn =>
                                btn.classList.remove("active")
                            );

                        button.classList.add("active");

                        this.currentFilter =
                            button.dataset.filter;

                        this.render();
                    }
                );
            });

        // Theme Buttons
        document
            .querySelectorAll(".theme-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const theme =
                            button.dataset.theme;

                        this.saveTheme(theme);
                    }
                );
            });
    }

    // ==================================================
    // PLACEHOLDERS
    // (Implemented in next parts)
    // ==================================================

    addTask() {

        console.log(
            "Part 2 → Add Task"
        );
    }

    render() {

        console.log(
            "Part 3 → Render Tasks"
        );
    }
}

// ======================================================
// START APP
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        window.taskFlow =
            new TaskFlow();
    }
);
// ==================================================
// ADD TASK
// ==================================================

addTask() {

    const title =
        this.elements.taskTitle.value.trim();

    const category =
        this.elements.taskCategory.value;

    const priority =
        this.elements.taskPriority.value;

    const dueDate =
        this.elements.taskDueDate.value;

    if (!title) {

        this.showToast(
            "Please enter a task title",
            "error"
        );

        this.elements.taskTitle.focus();

        return;
    }

    const task =
        this.createTask({
            title,
            category,
            priority,
            dueDate
        });

    this.tasks.unshift(task);

    this.saveTasks();

    this.clearForm();

    this.render();

    this.showToast(
        "Task created successfully"
    );
}
// ==================================================
// CLEAR FORM
// ==================================================

clearForm() {

    this.elements.taskTitle.value = "";

    this.elements.taskCategory.selectedIndex = 0;

    this.elements.taskPriority.selectedIndex = 0;

    this.elements.taskDueDate.value = "";

    this.elements.taskTitle.focus();
}
// ==================================================
// TOGGLE TASK
// ==================================================

toggleTask(taskId) {

    this.tasks = this.tasks.map(task => {

        if (task.id !== taskId) {
            return task;
        }

        return {

            ...task,

            completed:
                !task.completed,

            updatedAt:
                new Date().toISOString()
        };
    });

    this.saveTasks();

    this.render();

    this.showToast(
        "Task updated"
    );
}
// ==================================================
// DELETE TASK
// ==================================================

deleteTask(taskId) {

    const task =
        this.tasks.find(
            item => item.id === taskId
        );

    if (!task) {
        return;
    }

    const confirmed =
        window.confirm(
            `Delete "${task.title}" ?`
        );

    if (!confirmed) {
        return;
    }

    this.tasks =
        this.tasks.filter(
            task => task.id !== taskId
        );

    this.saveTasks();

    this.render();

    this.showToast(
        "Task deleted"
    );
}
// ==================================================
// OPEN EDIT MODAL
// ==================================================

openEditModal(taskId) {

    const task =
        this.tasks.find(
            item => item.id === taskId
        );

    if (!task) {
        return;
    }

    this.currentEditId =
        taskId;

    this.elements.editTitle.value =
        task.title;

    this.elements.editModal.classList.add(
        "show"
    );

    this.elements.editTitle.focus();
}
// ==================================================
// CLOSE MODAL
// ==================================================

closeEditModal() {

    this.currentEditId = null;

    this.elements.editModal.classList.remove(
        "show"
    );
}
// ==================================================
// SAVE EDIT
// ==================================================

saveEdit() {

    if (!this.currentEditId) {
        return;
    }

    const newTitle =
        this.elements.editTitle.value.trim();

    if (!newTitle) {

        this.showToast(
            "Task title required",
            "error"
        );

        return;
    }

    this.tasks = this.tasks.map(task => {

        if (
            task.id !==
            this.currentEditId
        ) {
            return task;
        }

        return {

            ...task,

            title: newTitle,

            updatedAt:
                new Date().toISOString()
        };
    });

    this.saveTasks();

    this.closeEditModal();

    this.render();

    this.showToast(
        "Task updated"
    );
}
// ==================================================
// TOAST
// ==================================================

showToast(
    message,
    type = "success"
) {

    const toast =
        this.elements.toast;

    if (!toast) {
        return;
    }

    toast.textContent =
        message;

    toast.className =
        "show";

    if (type === "error") {

        toast.style.background =
            "#ef4444";

        toast.style.color =
            "#ffffff";

    } else {

        toast.style.background =
            "var(--accent)";

        toast.style.color =
            "var(--bg)";
    }

    clearTimeout(
        this.toastTimer
    );

    this.toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2500);
}
// Save Edit Button

this.elements.saveEditBtn?.addEventListener(
    "click",
    () => this.saveEdit()
);

// Close Modal On Background Click

this.elements.editModal?.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            this.elements.editModal
        ) {

            this.closeEditModal();
        }
    }
);

// ESC Key

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            this.closeEditModal();
        }
    }
);
// ==================================================
// TASK ACTIONS
// ==================================================

this.elements.taskList?.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                "[data-action]"
            );

        if (!button) {
            return;
        }

        const action =
            button.dataset.action;

        const taskId =
            button.dataset.id;

        switch (action) {

            case "delete":

                this.deleteTask(
                    taskId
                );

                break;

            case "edit":

                this.openEditModal(
                    taskId
                );

                break;

            case "toggle":

                this.toggleTask(
                    taskId
                );

                break;
        }
    }
);
// ==================================================
// TASK ACTIONS
// ==================================================

this.elements.taskList?.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                "[data-action]"
            );

        if (!button) {
            return;
        }

        const action =
            button.dataset.action;

        const taskId =
            button.dataset.id;

        switch (action) {

            case "delete":

                this.deleteTask(
                    taskId
                );

                break;

            case "edit":

                this.openEditModal(
                    taskId
                );

                break;

            case "toggle":

                this.toggleTask(
                    taskId
                );

                break;
        }
    }
);
// ==================================================
// RENDER
// ==================================================

render() {

    const filteredTasks =
        this.getFilteredTasks();

    this.renderTasks(
        filteredTasks
    );

    this.updateTaskCounter(
        filteredTasks.length
    );

    this.updateStats();
}
// ==================================================
// FILTER + SEARCH
// ==================================================

getFilteredTasks() {

    let results =
        [...this.tasks];

    // Filter

    switch (
        this.currentFilter
    ) {

        case "pending":

            results =
                results.filter(
                    task =>
                        !task.completed
                );

            break;

        case "completed":

            results =
                results.filter(
                    task =>
                        task.completed
                );

            break;
    }

    // Search

    const searchValue =
        this.elements
            .searchInput
            .value
            .trim()
            .toLowerCase();

    if (searchValue) {

        results =
            results.filter(
                task => {

                    return (

                        task.title
                            .toLowerCase()
                            .includes(
                                searchValue
                            )

                        ||

                        task.category
                            .toLowerCase()
                            .includes(
                                searchValue
                            )

                        ||

                        task.priority
                            .toLowerCase()
                            .includes(
                                searchValue
                            )
                    );
                }
            );
    }

    return results;
}
// ==================================================
// TASK RENDERING
// ==================================================

renderTasks(tasks) {

    const container =
        this.elements.taskList;

    if (!container) {
        return;
    }

    // Empty State

    if (
        tasks.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-clipboard-list"></i>

                <h3>
                    No Tasks Found
                </h3>

                <p>
                    Create your first task
                    to get started.
                </p>

            </div>

        `;

        return;
    }

    container.innerHTML =
        tasks
            .map(task =>
                this.createTaskCard(
                    task
                )
            )
            .join("");
}
// ==================================================
// TASK TEMPLATE
// ==================================================

createTaskCard(task) {

    const dueDate =
        task.dueDate
            ? this.formatDate(
                task.dueDate
            )
            : "No Deadline";

    return `

        <article
            class="task
            ${task.completed
                ? "completed"
                : ""}"
        >

            <div class="task-left">

                <button
                    class="task-check"
                    data-action="toggle"
                    data-id="${task.id}"
                >

                    <i class="
                    fa-solid
                    ${task.completed
                        ? "fa-circle-check"
                        : "fa-circle"}
                    "></i>

                </button>

                <div>

                    <h4
                        class="task-title"
                    >
                        ${task.title}
                    </h4>

                    <div
                        class="task-meta"
                    >

                        <span
                            class="category"
                        >
                            ${task.category}
                        </span>

                        <span
                            class="
                            priority
                            ${task.priority.toLowerCase()}
                            "
                        >
                            ${task.priority}
                        </span>

                        <span
                            class="due-date"
                        >
                            ${dueDate}
                        </span>

                    </div>

                </div>

            </div>

            <div
                class="task-actions"
            >

                <button
                    data-action="edit"
                    data-id="${task.id}"
                    title="Edit"
                >

                    <i
                    class="fa-solid fa-pen">
                    </i>

                </button>

                <button
                    data-action="delete"
                    data-id="${task.id}"
                    title="Delete"
                >

                    <i
                    class="fa-solid fa-trash">
                    </i>

                </button>

            </div>

        </article>

    `;
}
// ==================================================
// DATE FORMAT
// ==================================================

formatDate(date) {

    const options = {

        year: "numeric",

        month: "short",

        day: "numeric"
    };

    return new Date(
        date
    ).toLocaleDateString(
        undefined,
        options
    );
}
// ==================================================
// DATE FORMAT
// ==================================================

formatDate(date) {

    const options = {

        year: "numeric",

        month: "short",

        day: "numeric"
    };

    return new Date(
        date
    ).toLocaleDateString(
        undefined,
        options
    );
}

// ==================================================
// TASK COUNTER
// ==================================================

updateTaskCounter(count) {

    this.elements.taskCounter.textContent =

        count === 1
            ? "1 Task"
            : `${count} Tasks`;
}
results.sort(
    (a, b) => {

        const priorityOrder = {

            High: 1,

            Medium: 2,

            Low: 3
        };

        return (
            priorityOrder[
                a.priority
            ]
            -
            priorityOrder[
                b.priority
            ]
        );
    }
);
// ==================================================
// DASHBOARD STATS
// ==================================================

updateStats() {

    const totalTasks =
        this.tasks.length;

    const completedTasks =
        this.tasks.filter(
            task => task.completed
        ).length;

    const pendingTasks =
        totalTasks - completedTasks;

    const completionRate =
        totalTasks > 0
            ? Math.round(
                (completedTasks / totalTasks) * 100
            )
            : 0;

    // Dashboard Cards

    this.elements.totalTasks.textContent =
        totalTasks;

    this.elements.completedTasks.textContent =
        completedTasks;

    this.elements.pendingTasks.textContent =
        pendingTasks;

    this.elements.completionRate.textContent =
        `${completionRate}%`;

    // Productivity Widget

    this.elements.productivityScore.textContent =
        `${completionRate}%`;

    // Progress Bar

    this.elements.progressText.textContent =
        `${completionRate}%`;

    this.elements.progressFill.style.width =
        `${completionRate}%`;

    // Categories

    this.updateCategoryStats();
}
// ==================================================
// CATEGORY ANALYTICS
// ==================================================

updateCategoryStats() {

    const stats = {

        Work: 0,

        Study: 0,

        Personal: 0,

        Health: 0,

        Shopping: 0
    };

    this.tasks.forEach(task => {

        if (
            stats.hasOwnProperty(
                task.category
            )
        ) {

            stats[
                task.category
            ]++;
        }
    });

    this.elements.workCount.textContent =
        stats.Work;

    this.elements.studyCount.textContent =
        stats.Study;

    this.elements.personalCount.textContent =
        stats.Personal;

    this.elements.healthCount.textContent =
        stats.Health;

    this.elements.shoppingCount.textContent =
        stats.Shopping;
}
// ==================================================
// PRODUCTIVITY LEVEL
// ==================================================

getProductivityLevel() {

    const total =
        this.tasks.length;

    if (!total) {

        return {
            text: "No Data",
            className: "neutral"
        };
    }

    const completed =
        this.tasks.filter(
            task => task.completed
        ).length;

    const score =
        Math.round(
            (completed / total) * 100
        );

    if (score >= 90) {

        return {
            text: "Excellent",
            className: "excellent"
        };
    }

    if (score >= 70) {

        return {
            text: "Good",
            className: "good"
        };
    }

    if (score >= 40) {

        return {
            text: "Average",
            className: "average"
        };
    }

    return {
        text: "Needs Focus",
        className: "poor"
    };
}
const level =
    this.getProductivityLevel();

const levelElement =
    document.getElementById(
        "productivityLevel"
    );

if (levelElement) {

    levelElement.textContent =
        level.text;

    levelElement.className =
        level.className;
}
// ==================================================
// OVERDUE TASKS
// ==================================================

getOverdueTasks() {

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    return this.tasks.filter(task => {

        if (
            !task.dueDate ||
            task.completed
        ) {

            return false;
        }

        const dueDate =
            new Date(
                task.dueDate
            );

        return dueDate < today;
    }).length;
}
// ==================================================
// UPCOMING TASKS
// ==================================================

getUpcomingTasks() {

    const today =
        new Date();

    const nextWeek =
        new Date();

    nextWeek.setDate(
        today.getDate() + 7
    );

    return this.tasks.filter(task => {

        if (
            !task.dueDate ||
            task.completed
        ) {

            return false;
        }

        const dueDate =
            new Date(
                task.dueDate
            );

        return (
            dueDate >= today &&
            dueDate <= nextWeek
        );
    }).length;
}
