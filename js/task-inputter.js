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
            const schedule = generateSchedule(tasks, selectedDate);

            saveSchedule(date, schedule);
            alert("Schedule generated successfully!");
            resetInputter();
        });
}

function toMinutes(h, m = 0) {
    return h * 60 + m;
}

function getDayName(dateStr) {
    return new Date(dateStr)
        .toLocaleDateString("en-US", { weekday: "short" })
        .toLowerCase();
}

/* Adjust in order to change 7 AM to 11 PM */
function createBaseWindow() {
    return [
        { start: 420, end: 1380 }
    ];
}

function applyBlockedTime(windows, date) {
    const blocked =
        JSON.parse(localStorage.getItem("fgBlockedTime")) || [];

    let result = [...windows];

    for (let block of blocked) {
        // SINGLE DATE BLOCK
        if (block.type === "single" && block.date === date) {
            result = cutWindow(result, block.start, block.end);
        }

        // RECURRING BLOCK
        if (block.type === "recurring") {
            const day = getDayName(date);

            if (block.days.includes(day)) {
                result = cutWindow(result, block.start, block.end);
            }
        }
    }

    return result;
}

function cutWindow(windows, start, end) {
    let updated = [];

    for (let w of windows) {

        // no overlap
        if (end <= w.start || start >= w.end) {
            updated.push(w);
            continue;
        }

        // LEFT SPLIT
        if (start > w.start) {
            updated.push({
                start: w.start,
                end: start
            });
        }

        // RIGHT SPLIT
        if (end < w.end) {
            updated.push({
                start: end,
                end: w.end
            });
        }
    }

    return updated.sort((a, b) => a.start - b.start);
}

function generateSchedule(taskList, date) {
    const sorted = [...taskList].sort((a, b) => {
        const order = {
            high: 1,
            medium: 2,
            low: 3
        };

        return order[a.priority] - order[b.priority];
    });

    let windows = createBaseWindow();
    windows = applyBlockedTime(windows, date);

    const scheduled = [];
    const unscheduled = [];

    for (let task of sorted) {
        const needed = task.duration + 5;
        let placed = false;

        for (let w of windows) {
            const available = w.end - w.start;
            if (available >= needed) {
                const start = w.start;
                const end = start + task.duration;

                scheduled.push({
                    ...task,
                    start,
                    end
                });

                // update window (consume time + break)
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
        date,
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
