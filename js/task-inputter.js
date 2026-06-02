/*
=====================================
TASK INPUTTER PAGE
=====================================
*/
let taskCounter = 0;

/* WAITING */
document.addEventListener("DOMContentLoaded", () => {
    waitForTaskPage();
});

function waitForTaskPage() {
    const interval = setInterval(() => {
        const button = document.getElementById("openTaskModal");

        if (button) {
            clearInterval(interval);
            initializeTaskInputter();
        }
    }, 50);
}

function initializeTaskInputter() {
    setupModal();
    setupDragDrop();
    setupGenerateButton();
}

/* MODAL */
function setupModal() {
    const modal = document.getElementById("taskModal");

    document
        .getElementById("openTaskModal")
        .addEventListener(
            "click",
            () => {
                modal.classList.remove(
                    "hidden"
                );
            }
        );

    document
        .getElementById("cancelTask")
        .addEventListener(
            "click",
            closeModal
        );

    document
        .getElementById("finishTask")
        .addEventListener(
            "click",
            createTask
        );
}

function closeModal() {
    document.getElementById("taskModal").classList.add("hidden");
}

function createTask() {
    const name = document.getElementById("taskName").value.trim();
    const duration = document.getElementById("taskDuration").value;

    if (!name || !duration) {
        alert("Please enter task name and duration.");
        return;
    }

    taskCounter++;
    const card = document.createElement("div");

    card.className = "task-card";
    card.draggable = true;
    card.id = `task-${taskCounter}`;

    const musicChoice = document.querySelector('input[name="music"]:checked').value;
    card.dataset.music = musicChoice;
    card.innerHTML = `
        <div class="task-title">
            ${name}
        </div>

        <div class="task-duration">
            ${duration} minutes
        </div>
    `;

    addDragEvents(card);

    document.getElementById("highTasks").appendChild(card);
    document.getElementById("taskName").value = "";
    document.getElementById("taskDuration").value = "";
    closeModal();
}

function addDragEvents(card) {
    card.addEventListener(
        "dragstart",
        () => {
            card.classList.add(
                "dragging"
            );
        }
    );

    card.addEventListener(
        "dragend",
        () => {
            card.classList.remove(
                "dragging"
            );
        }
    );
}

function setupDragDrop() {

    document
        .querySelectorAll(
            ".task-dropzone"
        )
        .forEach(zone => {

            zone.addEventListener(
                "dragover",
                e => {

                    e.preventDefault();
                }
            );

            zone.addEventListener(
                "drop",
                () => {

                    const task =
                        document.querySelector(
                            ".dragging"
                        );

                    if (task) {

                        zone.appendChild(task);
                    }
                }
            );
        });
}

function setupGenerateButton() {

    document
        .getElementById(
            "generateSchedule"
        )
        .addEventListener(
            "click",
            () => {

                const date =
                    document
                        .getElementById(
                            "taskDate"
                        )
                        .value;

                if (!date) {

                    alert(
                        "Please select a date first."
                    );

                    return;
                }

                alert(
                    "Schedule generation will be implemented in the next phase."
                );
            }
        );
}
