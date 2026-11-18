document.addEventListener("DOMContentLoaded", () => {

    // Get the currently logged-in user
    const currentUser = JSON.parse(
        localStorage.getItem("staynestCurrentUser") || "null"
    );


    // ==========================================
    // PROTECT DASHBOARD
    // ==========================================

    // If nobody is logged in,
    // send them back to the Login page.

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }


    // ==========================================
    // GET HTML ELEMENTS
    // ==========================================

    const userName =
        document.getElementById("userName");

    const summaryName =
        document.getElementById("summaryName");

    const summaryEmail =
        document.getElementById("summaryEmail");

    const userInitial =
        document.getElementById("userInitial");

    const logoutButton =
        document.getElementById("logoutButton");

    const menuButton =
        document.getElementById("menuButton");

    const navLinks =
        document.querySelector(".nav-links");


    // ==========================================
    // USER INFORMATION
    // ==========================================

    const name =
        currentUser.name || "Traveler";

    const email =
        currentUser.email || "";


    // Hero greeting
    userName.textContent =
        name.split(" ")[0];


    // Profile summary
    summaryName.textContent =
        name;

    summaryEmail.textContent =
        email;


    // User's first initial
    userInitial.textContent =
        name.charAt(0).toUpperCase();


    // ==========================================
    // MOBILE MENU
    // ==========================================

    if (menuButton && navLinks) {

        menuButton.addEventListener("click", () => {

            navLinks.classList.toggle("show");

        });

    }


    // ==========================================
    // LOGOUT
    // ==========================================

    logoutButton.addEventListener("click", () => {

        // Remove ONLY the current login session.
        //
        // Do NOT delete:
        // - staynestAccounts
        // - staynestBookings
        // - favorites

        localStorage.removeItem(
            "staynestCurrentUser"
        );


        // Send user back to Login
        window.location.href =
            "login.html";

    });

});