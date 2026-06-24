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
