/* =========================================================
   StayNest — Persistent Account Navigation
   Keeps the navbar in sync with the logged-in session.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const currentUser = getCurrentUser();

    const accountLinks = document.querySelectorAll(
        "header a[href='login.html'], nav a[href='login.html'], #accountLink, .dashboard-link"
    );

    accountLinks.forEach(link => {
        // Only change navigation links, not ordinary page content links.
        if (!link.closest("header") && !link.closest("nav")) return;

        if (currentUser) {
            link.href = "dashboard.html";
            link.textContent = "◯ Dashboard";
            link.classList.add("logged-in");
            link.classList.remove("active-signin");
        } else {
            link.href = "login.html";
            link.textContent = "◯ Sign in";
            link.classList.remove("logged-in");
            link.classList.add("active-signin");
        }
    });

    // Handle navs that use a non-anchor container around the account link.
    const accountContainers = document.querySelectorAll(
        ".accounts, .nav-actions, .nav-right"
    );

    accountContainers.forEach(container => {
        const link = container.querySelector(
            "#accountLink, a[href='login.html'], a[href='dashboard.html'], .dashboard-link"
        );

        if (!link) return;

        if (currentUser) {
            link.href = "dashboard.html";
            link.textContent = "◯ Dashboard";
            link.classList.add("logged-in");
        } else {
            link.href = "login.html";
            link.textContent = "◯ Sign in";
            link.classList.remove("logged-in");
        }
    });
});

function getCurrentUser() {
    try {
        const user = JSON.parse(
            localStorage.getItem("staynestCurrentUser") || "null"
        );

        if (!user || typeof user !== "object") return null;
        if (!user.email) return null;

        return user;
    } catch {
        return null;
    }
}
