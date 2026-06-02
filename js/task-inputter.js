/*
=====================================
FERAL GREMLIN - TASK INPUTTER + SCHEDULER
=====================================
*/

let taskCounter = 0;
let tasks = [];
let selectedDate = null;

document.addEventListener("DOMContentLoaded", () => {
    waitForTaskPage();
});

function waitForTaskPage() {
    const interval = setInterval(() => {
        const dateInput = document.getElementById("taskDate");
        if (dateInput) {
            clearInterval(interval);
            initializeTaskInputter();
        }
    }, 50);
}

function initializeTaskInputter() {
    setupModal();
    setupDragDrop();
    setupGenerateButton();
    selectedDate = document.getElementById("taskDate");
}

function setupModal() {
    const addTaskBtn = document.getElementById("openTaskModal");
    const finishTaskBtn = document.getElementById("finishTask");
    const cancelTaskBtn = document.getElementById("cancelTask");
    
    addTaskBtn.addEventListener("click", openModal);
    finishTaskBtn.addEventListener("click", createTask);
    cancelTaskBtn.addEventListener("click", closeModal);
}

function openModal() {
    document.getElementById("taskModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("taskModal").classList.add("hidden");
    document.getElementById("taskName").value = "";
    document.getElementById("taskDuration").value = "";

    const defaultMusic =
        document.querySelector(
            'input[name="music"][value="default"]'
        );

    if (defaultMusic) {
        defaultMusic.checked = true;
    }
}

function createTask() {
    const name = document.getElementById("taskName").value.trim();
    const duration = parseInt(document.getElementById("taskDuration").value);
    const music = document.querySelector('input[name="music"]:checked').value;

    if (!name || !duration) {
        alert("Please fill out all fields.");
        return;
    }

    const task = {
        id: taskCounter++,
        name,
        duration,
        priority: "high",
        musicType: music
    };

    tasks.push(task);
    renderTaskCard(task);
    closeModal();
}

function renderTaskCard(task) {
    const card = document.createElement("div");
    card.className = "task-card";
    card.draggable = true;
    card.dataset.id = task.id;
    card.innerHTML = `
        <div class="task-title">${task.name}</div>
        <div class="task-duration">${task.duration} min</div>
    `;

    addDragEvents(card);
    document.getElementById("highTasks").appendChild(card);
}

function setupDragDrop() {
    document.querySelectorAll(".task-dropzone")
        .forEach(zone => {

            zone.addEventListener("dragover", e => {
                e.preventDefault();
            });

            zone.addEventListener("drop", () => {

                const dragging =
                    document.querySelector(".dragging");

                if (!dragging) return;

                const taskId =
                    parseInt(dragging.dataset.id);

                const task =
                    tasks.find(t => t.id === taskId);

                if (!task) return;

                // Update priority based on drop zone
                const priority =
                    zone.id.replace("Tasks", "");

                task.priority = priority;

                zone.appendChild(dragging);
            });
        });
}

function addDragEvents(card) {
    card.addEventListener("dragstart", () => {
        card.classList.add("dragging");
    });

    card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
    });
}

function setupGenerateButton() {
    document.getElementById("generateSchedule").addEventListener("click", () => {
            const date = document.getElementById("taskDate").value;

            if (!date) {
                alert("Select a date first.");
                return;
            }

            selectedDate = date;
            const schedule = generateSchedule(tasks);

            saveSchedule(date, schedule);
            alert("Schedule generated successfully!");
            resetInputter();
        });
}

/* Scheduling Algorithm */
function generateSchedule(taskList) {
    const sorted =
        [...taskList].sort((a, b) => {

            const order = {
                high: 1,
                medium: 2,
                low: 3
            };

            return order[a.priority] - order[b.priority];
        });

    // Available time windows (7 AM - 11 PM default)
    let windows = [
        { start: 420, end: 1380 }
    ];

    const scheduled = [];
    const unscheduled = [];

    for (let task of sorted) {

        const required =
            task.duration + 5; // break time

        let placed = false;

        for (let w of windows) {

            const available =
                w.end - w.start;

            if (available >= required) {

                const start = w.start;
                const end = start + task.duration;

                scheduled.push({
                    ...task,
                    start,
                    end
                });

                // Update window (consume time + break)
                w.start = end + 5;

                placed = true;
                break;
            }
        }

        if (!placed) {
            unscheduled.push(task);
        }
    }

    if (unscheduled.length > 0) {
        console.warn(
            "Some tasks could not be scheduled",
            unscheduled
        );
    }

    return {
        date: selectedDate,
        tasks: scheduled,
        unscheduled
    };
}

/* LOCAL STORAGE */
function saveSchedule(date, schedule) {

    let all =
        JSON.parse(
            localStorage.getItem("fgSchedules")
        ) || {};

    all[date] = schedule;

    localStorage.setItem(
        "fgSchedules",
        JSON.stringify(all)
    );
}

/* RESET UI */
function resetInputter() {
    tasks = [];
    document.getElementById("highTasks").innerHTML = "";
    document.getElementById("mediumTasks").innerHTML = "";
    document.getElementById("lowTasks").innerHTML = "";
    document.getElementById("taskDate").value = "";
}
