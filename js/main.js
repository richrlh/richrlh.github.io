/*
====================================
MAIN APPLICATION FILE
Shared functionality used by all pages
====================================
*/

document.addEventListener("DOMContentLoaded", async () => {
    await loadComponent(
        "sidebar-container",
        "components/sidebar.html"
    );

    await loadComponent(
        "header-container",
        "components/header.html"
    );

    initializeSidebar();
    initializeUsername();
    initializeActiveNav();
});

/* LOAD HTML */
async function loadComponent(containerId, filePath) {
    const response = await fetch(filePath);
    const html = await response.text();
    document.getElementById(containerId).innerHTML = html;
}

/* SIDEBAR */
function initializeSidebar() {
    const hamburger = document.getElementById("hamburger");
    const sidebar = document.getElementById("sidebar");
    if (!hamburger || !sidebar) return;
    hamburger.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    });
}

/* USERNAME */
function initializeUsername() {
    const username = document.getElementById("username");
    if (!username) return;

    username.textContent = localStorage.getItem("fgUsername") || "User";

    username.addEventListener("blur", () => {
        localStorage.setItem("fgUsername", username.textContent.trim());
    });
}

/* SIDEBAR FUNCTIONALITY */
function initializeActiveNav() {
    const currentPage = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => {
        link.classList.remove("active");
        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
        }
    });
}
