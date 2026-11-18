
// Favorites are available to both guests and signed-in users.
// Favorites are stored locally in this browser, so no account is required.
function stayNestFavoritesAllowed() {
    return true;
}

/* =====================================================
   STAYNEST - HOME PAGE JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const searchButton = document.getElementById("Search");
    const guestSelect = document.getElementById("Guest");

    const destinationInput = document.querySelector(
        ".search-field.destination input"
    );

    const dateInputs = document.querySelectorAll(
        '.search-field input[type="date"]'
    );

    const checkInInput = dateInputs[0];
    const checkOutInput = dateInputs[1];

    const destinationCards =
        document.querySelectorAll(".destination-card");

    const stayCards =
        document.querySelectorAll(".stay-card");

    const favoriteButtons =
        document.querySelectorAll(".favorite");

    const newsletterForm =
        document.querySelector(".newsletter-form");

    const newsletterInput =
        document.querySelector(".newsletter-form input");

    const menuButton =
        document.querySelector(".menu");

    const nav =
        document.querySelector(".navbar");

    function showMessage(message, type = "success") {
        const oldMessage = document.querySelector(".staynest-message");
        if (oldMessage) oldMessage.remove();

        const messageBox = document.createElement("div");
        messageBox.className = "staynest-message";
        messageBox.textContent = message;

        Object.assign(messageBox.style, {
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            zIndex: "9999",
            boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
            backgroundColor: type === "error" ? "#ffe5e5" : "#e7f8ed",
            color: type === "error" ? "#b42318" : "#147a3d"
        });

        document.body.appendChild(messageBox);

        setTimeout(() => messageBox.remove(), 3000);
    }

    function normalize(text) {
        return String(text || "")
            .toLowerCase()
            .trim()
            .replace(/[.,]/g, "")
            .replace(/\s+/g, " ");
    }

    function formatLocalDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    /* =========================
       DATE SETUP
    ========================= */

    const today = new Date();
    const todayString = formatLocalDate(today);

    if (checkInInput) checkInInput.min = todayString;
    if (checkOutInput) checkOutInput.min = todayString;

    if (checkInInput && !checkInInput.value) {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        checkInInput.value = formatLocalDate(tomorrow);
    }

    if (checkOutInput && !checkOutInput.value) {
        const dayAfter = new Date(today);
        dayAfter.setDate(dayAfter.getDate() + 2);
        checkOutInput.value = formatLocalDate(dayAfter);
    }

    if (
        checkInInput &&
        checkOutInput &&
        checkInInput.value
    ) {
        const checkInDate =
            new Date(`${checkInInput.value}T00:00:00`);
        const nextDay = new Date(checkInDate);
        nextDay.setDate(nextDay.getDate() + 1);

        checkOutInput.min = formatLocalDate(nextDay);

        if (
            !checkOutInput.value ||
            checkOutInput.value <= checkInInput.value
        ) {
            checkOutInput.value = formatLocalDate(nextDay);
        }
    }

    checkInInput?.addEventListener("change", () => {
        if (!checkInInput.value || !checkOutInput) return;

        const checkInDate =
            new Date(`${checkInInput.value}T00:00:00`);
        const nextDay = new Date(checkInDate);
        nextDay.setDate(nextDay.getDate() + 1);

        checkOutInput.min = formatLocalDate(nextDay);

        if (
            !checkOutInput.value ||
            checkOutInput.value <= checkInInput.value
        ) {
            checkOutInput.value = formatLocalDate(nextDay);
        }
    });

    /* =========================
       SEARCH
    ========================= */

    function findSearchResult(query) {
        const normalizedQuery = normalize(query);
        if (!normalizedQuery) return null;

        for (const card of stayCards) {
            const nameElement =
                card.querySelector(".stay-content h3");
            const locationElement =
                card.querySelector(".location");

            const name = normalize(
                nameElement?.textContent
            );
            const location = normalize(
                locationElement?.textContent
            );

            if (
                name === normalizedQuery ||
                name.includes(normalizedQuery) ||
                location.includes(normalizedQuery)
            ) {
                return {
                    type: "stay",
                    value: nameElement?.textContent.trim()
                };
            }
        }

        for (const card of destinationCards) {
            const nameElement =
                card.querySelector(".destination-info h4");
            if (!nameElement) continue;

            const destination =
                nameElement.textContent.trim();
            const normalizedDestination =
                normalize(destination);

            if (
                normalizedDestination === normalizedQuery ||
                normalizedDestination.includes(normalizedQuery) ||
                normalizedQuery.includes(
                    normalizedDestination.split(" ")[0]
                )
            ) {
                return {
                    type: "destination",
                    value: destination
                };
            }
        }

        return null;
    }

    function performSearch() {
        const query = destinationInput?.value.trim() || "";
        const checkIn = checkInInput?.value || "";
        const checkOut = checkOutInput?.value || "";
        const guests = guestSelect?.value || "";

        if (!query) {
            showMessage(
                "Please enter a destination or stay.",
                "error"
            );
            destinationInput?.focus();
            return;
        }

        if (!checkIn || !checkOut) {
            showMessage(
                "Please select your check-in and check-out dates.",
                "error"
            );
            return;
        }

        if (checkIn < todayString) {
            showMessage(
                "Check-in cannot be in the past.",
                "error"
            );
            return;
        }

        if (checkOut <= checkIn) {
            showMessage(
                "Check-out must be after check-in.",
                "error"
            );
            return;
        }

        const result = findSearchResult(query);

        if (!result) {
            showMessage(
                `No destination or stay found for "${query}".`,
                "error"
            );
            return;
        }

        localStorage.setItem("staynestLastSearch", query);
        localStorage.setItem(
            "staynestSearchDates",
            JSON.stringify({ checkIn, checkOut, guests })
        );

        if (result.type === "destination") {
            localStorage.setItem(
                "staynestSelectedDestination",
                result.value
            );
            window.location.href =
                `destinations.html?search=${encodeURIComponent(result.value)}`;
        } else {
            localStorage.setItem(
                "staynestSelectedStay",
                result.value
            );
            window.location.href =
                `stays.html?search=${encodeURIComponent(result.value)}`;
        }
    }

    searchButton?.addEventListener("click", performSearch);

    destinationInput?.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            performSearch();
        }
    });

    /* =========================
       CARD NAVIGATION
    ========================= */

    destinationCards.forEach(card => {
        card.style.cursor = "pointer";

        card.addEventListener("click", event => {
            if (event.target.closest(".favorite-button")) return;

            const name =
                card.querySelector(".destination-info h4")
                    ?.textContent.trim();

            if (!name) return;

            localStorage.setItem(
                "staynestSelectedDestination",
                name
            );

            window.location.href =
                `destinations.html?search=${encodeURIComponent(name)}`;
        });
    });

    stayCards.forEach(card => {
        card.style.cursor = "pointer";

        card.addEventListener("click", event => {
            if (event.target.closest(".favorite")) return;

            const name =
                card.querySelector(".stay-content h3")
                    ?.textContent.trim();

            if (!name) return;

            localStorage.setItem(
                "staynestSelectedStay",
                name
            );

            window.location.href =
                `stays.html?search=${encodeURIComponent(name)}`;
        });
    });

    /* =========================
       FAVORITES
    ========================= */

    let favorites = [];

    try {
        const saved = JSON.parse(
            localStorage.getItem("staynestFavorites") || "[]"
        );
        favorites = Array.isArray(saved) ? saved : [];
    } catch {
        favorites = [];
    }

    function updateFavoriteButtons() {
        favoriteButtons.forEach(button => {
            const card = button.closest(".stay-card");
            const name =
                card?.querySelector(".stay-content h3")
                    ?.textContent.trim();

            if (!name) return;

            button.textContent =
                favorites.includes(name) ? "♥" : "♡";
        });
    }

    favoriteButtons.forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            const card = button.closest(".stay-card");
            const name =
                card?.querySelector(".stay-content h3")
                    ?.textContent.trim();

            if (!name) return;

            if (favorites.includes(name)) {
                favorites =
                    favorites.filter(item => item !== name);
                showMessage(`${name} removed from favorites.`);
            } else {
                favorites.push(name);
                showMessage(`${name} added to favorites.`);
            }

            localStorage.setItem(
                "staynestFavorites",
                JSON.stringify(favorites)
            );

            updateFavoriteButtons();
        });
    });

    updateFavoriteButtons();

    function updateHomeFavoriteCount() {
        const countEl = document.getElementById("homeFavoriteCount");
        if (!countEl) return;

        countEl.textContent = String(favorites.length);
    }

    updateHomeFavoriteCount();

    /* =========================
       DESTINATION FAVORITES
    ========================= */

    let destinationFavorites = [];

    try {
        const savedDestinationFavorites = JSON.parse(
            localStorage.getItem("staynestDestinationFavorites") || "[]"
        );

        destinationFavorites =
            Array.isArray(savedDestinationFavorites)
                ? savedDestinationFavorites
                : [];
    } catch {
        destinationFavorites = [];
    }

    function updateDestinationFavoriteButtons() {
        document.querySelectorAll(".destination-favorite").forEach(button => {
            const card = button.closest(".destination-card");
            const name = card
                ?.querySelector(".destination-info h4")
                ?.textContent.trim();

            if (!name) return;

            const isFavorite = destinationFavorites.includes(name);

            button.textContent = isFavorite ? "♥" : "♡";
            button.classList.toggle("is-favorite", isFavorite);
            button.setAttribute("aria-pressed", String(isFavorite));
            button.setAttribute(
                "aria-label",
                `${isFavorite ? "Remove" : "Add"} ${name} to favorites`
            );
        });
    }

    document.querySelectorAll(".destination-favorite").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            const card = button.closest(".destination-card");
            const name = card
                ?.querySelector(".destination-info h4")
                ?.textContent.trim();

            if (!name) return;

            if (destinationFavorites.includes(name)) {
                destinationFavorites =
                    destinationFavorites.filter(item => item !== name);

                showMessage(`${name} removed from favorite destinations.`);
            } else {
                destinationFavorites.push(name);
                showMessage(`${name} added to favorite destinations.`);
            }

            localStorage.setItem(
                "staynestDestinationFavorites",
                JSON.stringify(destinationFavorites)
            );

            updateDestinationFavoriteButtons();
        });
    });

    updateDestinationFavoriteButtons();

    /* =========================
       HOME DEAL TIMER SYNC
       Uses the exact same localStorage
       state as deals.js.
    ========================= */

    const homeDays = document.getElementById("homeDays");
    const homeHours = document.getElementById("homeHours");
    const homeMinutes = document.getElementById("homeMinutes");
    const homeSeconds = document.getElementById("homeSeconds");

    let homeTimer = null;

    function getStoredNumber(key) {
        const value = Number(localStorage.getItem(key));

        if (!Number.isFinite(value) || value <= 0) {
            return null;
        }

        return value;
    }

    function saveNumber(key, value) {
        localStorage.setItem(key, String(value));
    }

    function startNewHomeDealCycle() {
        const deadline =
            Date.now() + (2 * 24 * 60 * 60 * 1000);

        localStorage.removeItem("staynestDealCooldown");
        saveNumber("staynestDealDeadline", deadline);

        return {
            phase: "active",
            deadline
        };
    }

    function startHomeCooldown() {
        const cooldownEnds =
            Date.now() + (2 * 60 * 60 * 1000);

        localStorage.removeItem("staynestDealDeadline");
        saveNumber("staynestDealCooldown", cooldownEnds);

        localStorage.removeItem("staynestSelectedDeal");

        return {
            phase: "cooldown",
            cooldownEnds
        };
    }

    function getHomeDealState() {
        const now = Date.now();

        const deadline =
            getStoredNumber("staynestDealDeadline");

        const cooldownEnds =
            getStoredNumber("staynestDealCooldown");

        if (deadline) {
            if (deadline > now) {
                return {
                    phase: "active",
                    deadline
                };
            }

            return startHomeCooldown();
        }

        if (cooldownEnds) {
            if (cooldownEnds > now) {
                return {
                    phase: "cooldown",
                    cooldownEnds
                };
            }

            return startNewHomeDealCycle();
        }

        return startNewHomeDealCycle();
    }

    function padHomeTimer(number) {
        return String(Math.max(0, number)).padStart(2, "0");
    }

    function renderHomeTimer(deadline) {
        const remaining = Math.max(0, deadline - Date.now());
        const totalSeconds = Math.floor(remaining / 1000);

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (homeDays) homeDays.textContent = padHomeTimer(days);
        if (homeHours) homeHours.textContent = padHomeTimer(hours);
        if (homeMinutes) homeMinutes.textContent = padHomeTimer(minutes);
        if (homeSeconds) homeSeconds.textContent = padHomeTimer(seconds);

        return remaining;
    }

    function renderHomeZeroTimer() {
        if (homeDays) homeDays.textContent = "00";
        if (homeHours) homeHours.textContent = "00";
        if (homeMinutes) homeMinutes.textContent = "00";
        if (homeSeconds) homeSeconds.textContent = "00";
    }

    function syncHomeDealTimer() {
        const state = getHomeDealState();

        if (homeTimer !== null) {
            clearInterval(homeTimer);
            homeTimer = null;
        }

        if (state.phase !== "active") {
            renderHomeZeroTimer();

            // Do not tick during cooldown.
            return;
        }

        renderHomeTimer(state.deadline);

        homeTimer = setInterval(() => {
            const currentState = getHomeDealState();

            if (currentState.phase !== "active") {
                clearInterval(homeTimer);
                homeTimer = null;
                renderHomeZeroTimer();
                return;
            }

            const remaining = renderHomeTimer(currentState.deadline);

            if (remaining <= 0) {
                clearInterval(homeTimer);
                homeTimer = null;

                // Force the shared state into cooldown.
                getHomeDealState();
                renderHomeZeroTimer();
            }
        }, 1000);
    }

    syncHomeDealTimer();

    // If the Deals page changes the shared state in another tab,
    // update the Home timer automatically.
    window.addEventListener("storage", event => {
        if (
            event.key === "staynestDealDeadline" ||
            event.key === "staynestDealCooldown"
        ) {
            syncHomeDealTimer();
        }
    });

    /* =========================
       MOBILE MENU
    ========================= */

    if (menuButton && nav) {
        menuButton.addEventListener("click", () => {
            nav.classList.toggle("mobile-menu-open");

            let mobileMenu =
                document.querySelector(".staynest-mobile-menu");

            if (!mobileMenu) {
                mobileMenu = document.createElement("ul");
                mobileMenu.className = "staynest-mobile-menu";

                const pages = [
                    ["Home", "index.html"],
                    ["Destinations", "destinations.html"],
                    ["Stays", "stays.html"],
                    ["Deals", "deals.html"],
                    ["Find a Booking", "find-booking.html"],
                    ["Contact", "contact.html"]
                ];

                pages.forEach(([name, href]) => {
                    const item = document.createElement("li");
                    const link = document.createElement("a");

                    link.textContent = name;
                    link.href = href;

                    item.appendChild(link);
                    mobileMenu.appendChild(item);
                });

                nav.appendChild(mobileMenu);
            }

            mobileMenu.classList.toggle("show");
        });
    }

    /* =========================
       NEWSLETTER
    ========================= */

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", event => {
            event.preventDefault();

            const email = newsletterInput?.value.trim() || "";
            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );
                return;
            }

            localStorage.setItem(
                "staynestNewsletterEmail",
                email
            );

            newsletterForm.reset();
            showMessage(
                "You're subscribed! Welcome to StayNest."
            );
        });
    }

});
