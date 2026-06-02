/*
====================================
CALENDAR PAGE
====================================
*/

document.addEventListener("DOMContentLoaded", () => {
    waitForComponents();
});

let currentDate = new Date();
let balance = 10;
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

/* OPEN SCHEDULE */
function openDaySchedule(day) {
    document.getElementById("scheduleModal").classList.remove("hidden");
    document.getElementById("selectedDateHeading").textContent =
        `${day} ${document.getElementById("monthYear").textContent}`;
    buildScheduleTable();
}

/* TIME TABLE CREATION */
function buildScheduleTable() {
    const body = document.getElementById("scheduleBody");
    body.innerHTML = "";

    for (let hour = 0; hour < 24; hour++) {
        for (
            let minute = 0;
            minute < 60;
            minute += 30
        ) {
            const row = document.createElement("tr");
            const timeCell = document.createElement("td");
            const taskCell = document.createElement("td");
            const displayHour = hour % 12 || 12;
            const ampm =
                hour < 12
                ? "AM"
                : "PM";

            timeCell.textContent =
                `${displayHour}:${minute
                    .toString()
                    .padStart(2,"0")}
                    ${ampm}`;

            taskCell.innerHTML = `
                <div class="task-entry">
                    <span class="task-name">
                        Sample Task
                    </span>
                    <div class="task-controls">
                        <button
                            class="play-btn"
                            aria-label="Play Music">
                            ▶
                        </button>
                        <button
                            class="complete-btn">
                            Mark Complete
                        </button>
                    </div>
                </div>`;

            row.append(
                timeCell,
                taskCell
            );

            body.appendChild(row);
        }
    }

    attachCompleteButtons();
}

/* Complete Tasks */
function attachCompleteButtons() {
    document
        .querySelectorAll(".complete-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    button.parentElement
                        .classList.add(
                            "completed"
                        );

                    showRewardMessage(5);
                }
            );
        });
}

function showRewardMessage(amount) {
    const toast = document.getElementById("rewardToast");
    const message = rewardMessages[Math.floor(Math.random() * rewardMessages.length)];

    toast.textContent =
        `${message} $${amount}!`;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}

/* MODAL */
function closeModal() {
    document.getElementById("scheduleModal").classList.add("hidden");
}
