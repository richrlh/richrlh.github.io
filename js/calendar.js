/*
====================================
CALENDAR PAGE
====================================
*/

document.addEventListener("DOMContentLoaded", () => {
    waitForComponents();
});

let currentDate = new Date();
let balance = Number(localStorage.getItem("fgBalance")) || 10;
const rewardMessages = [
    "Yay, you did it! You earned",
    "Woof! Great work! You earned",
    "Your puppy is proud! You earned",
    "Tail wagging activated! You earned"];

/* WAIT FOR HEADER AND SIDEBAR TO LOAD */
function waitForComponents() {
    const interval = setInterval(() => {
        const grid =
            document.getElementById("calendarGrid");
        if (grid) {
            clearInterval(interval);
            initializeCalendar();
        }
    }, 50);
}

function initializeCalendar() {
    renderCalendar();
    document.getElementById("prevMonth").addEventListener("click", previousMonth);
    document.getElementById("nextMonth").addEventListener("click", nextMonth);
    document.getElementById("closeModal").addEventListener("click",closeModal);
}

/* CHANGING MONTHS */
function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function renderCalendar() {
    const grid = document.getElementById("calendarGrid");
    const monthYear = document.getElementById("monthYear");
    grid.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.textContent =
        currentDate.toLocaleString(
            "default",
            {
                month: "long",
                year: "numeric"
            }
        );

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement("div");
        grid.appendChild(blank);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("div");

        cell.className = "day";
        cell.innerHTML = `<div class="day-number">${day}</div>`;
        cell.addEventListener("click", () => openDaySchedule(day));
        grid.appendChild(cell);
    }
}

/*
====================================
CALENDAR - SCHEDULE RENDERER
====================================
*/

function openDaySchedule(day) {

    const dateKey = getSelectedDateKey(day);

    document.getElementById("scheduleModal")
        .classList.remove("hidden");

    document.getElementById("selectedDateHeading")
        .textContent = dateKey;

    const schedules =
        JSON.parse(localStorage.getItem("fgSchedules")) || {};

    const daySchedule =
        schedules[dateKey]?.tasks || [];

    buildScheduleTable(daySchedule);
}

/*
====================================
DATE KEY HELPERS
====================================
*/

function getSelectedDateKey(day) {
    // Create YYYY-MM-DD format to match task-inputter.js
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');

    return `${year}-${month}-${dayStr}`;
}

/*
====================================
BUILD 30-MINUTE GRID
====================================
*/

function buildScheduleTable(tasks) {

    const body =
        document.getElementById("scheduleBody");

    body.innerHTML = "";

    // Convert tasks into slot map
    const slotMap = generateSlotMap(tasks);

    for (let hour = 0; hour < 24; hour++) {

        for (let min = 0; min < 60; min += 30) {

            const timeIndex =
                hour * 60 + min;

            const row =
                document.createElement("tr");

            const timeCell =
                document.createElement("td");

            const taskCell =
                document.createElement("td");

            timeCell.textContent =
                formatTime(hour, min);

            const slotTasks =
                slotMap[timeIndex] || [];

            if (slotTasks.length === 0) {

                taskCell.innerHTML = "";
            }

            else {

                taskCell.innerHTML =
                    slotTasks
                        .map(renderTaskBlock)
                        .join("");
            }

            row.append(timeCell, taskCell);

            body.appendChild(row);
        }
    }

    attachTaskButtons();
}

/*
====================================
MAP TASKS INTO TIME SLOTS
====================================
*/

function generateSlotMap(tasks) {

    const map = {};

    for (let task of tasks) {

        const start = task.start;
        const end = task.end;

        for (let t = start; t < end; t += 30) {

            const slot = Math.floor(t / 30) * 30;

            if (!map[slot]) {
                map[slot] = [];
            }

            map[slot].push(task);
        }
    }

    return map;
}

/*
====================================
RENDER TASK BLOCK
====================================
*/

function renderTaskBlock(task) {

    return `
        <div class="task-entry">

            <span class="task-name">
                ${task.name}
            </span>

            <div class="task-controls">

                <button class="play-btn"
                        data-id="${task.id}">
                    ▶
                </button>

                <button class="complete-btn"
                        data-id="${task.id}">
                    ✓
                </button>

            </div>

        </div>
    `;
}

/*
====================================
TIME FORMATTER
====================================
*/

function formatTime(hour, min) {

    const h = hour % 12 || 12;
    const ampm = hour < 12 ? "AM" : "PM";

    return `${h}:${String(min).padStart(2, "0")} ${ampm}`;
}

/*
====================================
BUTTON LOGIC
====================================
*/

function attachTaskButtons() {

    document.querySelectorAll(".complete-btn")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                const id = parseInt(btn.dataset.id);

                const taskPriority = getTaskPriority(id);

                markTaskComplete(id);

                btn.closest(".task-entry")
                    .style.opacity = "0.4";

                showRewardMessage(taskPriority);
            });
        });

    document.querySelectorAll(".play-btn")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                const id = parseInt(btn.dataset.id);

                alert("Music system coming soon for task " + id);
            });
        });
}

/*
====================================
TASK COMPLETION (LOCAL STATE UPDATE)
====================================
*/

function markTaskComplete(id) {

    const schedules =
        JSON.parse(localStorage.getItem("fgSchedules")) || {};

    for (let date in schedules) {

        let tasks = schedules[date].tasks;

        for (let t of tasks) {

            if (t.id === id) {
                t.completed = true;
            }
        }
    }

    localStorage.setItem(
        "fgSchedules",
        JSON.stringify(schedules)
    );
}

/*
====================================
GET TASK PRIORITY
====================================
*/

function getTaskPriority(id) {

    const schedules =
        JSON.parse(localStorage.getItem("fgSchedules")) || {};

    for (let date in schedules) {

        let tasks = schedules[date].tasks;

        for (let t of tasks) {

            if (t.id === id) {
                return t.priority || "medium";
            }
        }
    }

    return "medium";
}

/*
====================================
REWARD SYSTEM
====================================
*/

function getRewardByPriority(priority) {
    const rewardMap = {
        "high": 5,
        "medium": 1,
        "low": 0.5
    };
    return rewardMap[priority.toLowerCase()] || 1;
}

function showRewardMessage(priority) {
    const amount = getRewardByPriority(priority);
    const toast = document.getElementById("rewardToast");
    const message = rewardMessages[Math.floor(Math.random() * rewardMessages.length)];

    toast.textContent =
        `${message} $${amount.toFixed(2)}!`;

    toast.classList.add("show");

    balance += amount;
    localStorage.setItem("fgBalance", balance);
    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}

/* MODAL */
function closeModal() {
    document.getElementById("scheduleModal").classList.add("hidden");
}
