
// Favorites are available to both guests and signed-in users.
// Favorites are stored locally in this browser, so no account is required.
function stayNestFavoritesAllowed() {
    return true;
}

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MOBILE MENU
    ========================= */

    const menuButton =
        document.querySelector(".menu-btn");

    const navLinks =
        document.querySelector(".nav-links");

    if (menuButton) {

        menuButton.addEventListener("click", () => {

            navLinks.classList.toggle("mobile-open");

        });

    }


    /* =========================
       FAVORITE COUNT
    ========================= */

    const favoriteCount =
        document.querySelector(".favorite-count");

    const favorites =
        JSON.parse(
            localStorage.getItem("staynestFavorites")
        ) || [];

    if (favoriteCount) {
        favoriteCount.textContent =
            favorites.length;
    }


    /* =========================
       NEWSLETTER
    ========================= */

    const form =
        document.getElementById("newsletterForm");

    const emailInput =
        document.getElementById("newsletterEmail");

    const message =
        document.getElementById("newsletterMessage");


    if (form) {

        form.addEventListener("submit", (event) => {

            event.preventDefault();

            const email =
                emailInput.value.trim();


            if (!email || !email.includes("@")) {

                message.textContent =
                    "Please enter a valid email address.";

                return;
            }


            localStorage.setItem(
                "staynestNewsletter",
                email
            );

            message.textContent =
                "You're subscribed! 🎉";

            form.reset();

        });

    }

});