/* =========================================================
   StayNest — Deals Page

   DEAL CYCLE:
   • Deals ON  → cards visible + 2-day timer ticks
   • Deals OFF → cards hidden + timer frozen at 00:00:00:00
   • Cooldown  → 2 hours happen in the background
   • Cooldown ends → new 2-day deal cycle starts
   ========================================================= */

const ACTIVE_DURATION_MS =
    2 * 24 * 60 * 60 * 1000;

const COOLDOWN_DURATION_MS =
    2 * 60 * 60 * 1000;

const DEAL_DEADLINE_KEY =
    "staynestDealDeadline";

const DEAL_COOLDOWN_KEY =
    "staynestDealCooldown";

const SELECTED_DEAL_KEY =
    "staynestSelectedDeal";

const FAVORITES_KEY =
    "staynestFavorites";


/* =========================
   DOM ELEMENTS
========================= */

const dealCards =
    document.querySelectorAll(".deal-card");

const dealSearch =
    document.getElementById("dealSearch");

const dealFilter =
    document.getElementById("dealFilter");

const dealSort =
    document.getElementById("dealSort");

const noResults =
    document.getElementById("noResults");

const noDeals =
    document.getElementById("noDeals");

const daysEl =
    document.getElementById("days");

const hoursEl =
    document.getElementById("hours");

const minutesEl =
    document.getElementById("minutes");

const secondsEl =
    document.getElementById("seconds");

const dealExpiredMessage =
    document.getElementById("dealExpiredMessage");

const cooldownText =
    document.getElementById("cooldownText");

const favoriteCount =
    document.getElementById("favoriteCount");

const menuBtn =
    document.querySelector(".menu");

const navLinks =
    document.querySelector(".nav-links");

const accountLink =
    document.getElementById("accountLink");

const toast =
    document.getElementById("toast");

const newsletterForm =
    document.getElementById("newsletterForm");

const newsletterEmail =
    document.getElementById("newsletterEmail");

const newsletterMessage =
    document.getElementById("newsletterMessage");


/* =========================
   RUNTIME STATE
========================= */

let activeTimerInterval = null;

let cooldownTimeout = null;

let toastTimeout = null;


/* =========================
   STAY DATA
========================= */

/*
    These are the normal StayNest prices.

    The Deals HTML only stores the discounted
    price in data-price, so we use this map
    to get the original price safely.
*/

const stayPrices = {

    "Oceanview Resort & Spa": 120,

    "The Grand Paris Hotel": 210,

    "Maldives Paradise": 350,

    "Luxury Stay Dubai": 160,

    "Blue Horizon Hotel": 190

};


/* =========================
   LOCAL STORAGE HELPERS
========================= */

function getStoredNumber(key) {

    const value =
        Number(
            localStorage.getItem(key)
        );

    if (
        !Number.isFinite(value) ||
        value <= 0
    ) {
        return null;
    }

    return value;
}


function saveNumber(key, value) {

    localStorage.setItem(
        key,
        String(value)
    );
}


/* =========================
   DEAL CYCLE
========================= */

function startNewDealCycle() {

    const deadline =
        Date.now() +
        ACTIVE_DURATION_MS;

    localStorage.removeItem(
        DEAL_COOLDOWN_KEY
    );

    saveNumber(
        DEAL_DEADLINE_KEY,
        deadline
    );

    return {

        phase: "active",

        deadline

    };
}


function startCooldown() {

    const cooldownEnds =
        Date.now() +
        COOLDOWN_DURATION_MS;

    localStorage.removeItem(
        DEAL_DEADLINE_KEY
    );

    saveNumber(
        DEAL_COOLDOWN_KEY,
        cooldownEnds
    );

    /*
        Remove the previous selected deal
        so it cannot be booked after expiry.
    */

    localStorage.removeItem(
        SELECTED_DEAL_KEY
    );

    return {

        phase: "cooldown",

        cooldownEnds

    };
}


function getDealState() {

    const now =
        Date.now();

    const deadline =
        getStoredNumber(
            DEAL_DEADLINE_KEY
        );

    const cooldownEnds =
        getStoredNumber(
            DEAL_COOLDOWN_KEY
        );


    /* -------------------------
       ACTIVE DEALS
    ------------------------- */

    if (deadline) {

        if (deadline > now) {

            return {

                phase: "active",

                deadline

            };

        }

        /*
            Deal has expired.
            Immediately enter cooldown.
        */

        return startCooldown();
    }


    /* -------------------------
       COOLDOWN
    ------------------------- */

    if (cooldownEnds) {

        if (cooldownEnds > now) {

            return {

                phase: "cooldown",

                cooldownEnds

            };

        }

        /*
            Cooldown finished.
            Start new deals.
        */

        return startNewDealCycle();
    }


    /*
        First visit.
    */

    return startNewDealCycle();
}


/* =========================
   TIMER
========================= */

function pad(number) {

    return String(
        Math.max(0, number)
    ).padStart(2, "0");
}


function showZeroTimer() {

    if (daysEl) {

        daysEl.textContent =
            "00";
    }

    if (hoursEl) {

        hoursEl.textContent =
            "00";
    }

    if (minutesEl) {

        minutesEl.textContent =
            "00";
    }

    if (secondsEl) {

        secondsEl.textContent =
            "00";
    }
}


function showActiveTimer(deadline) {

    const remaining =
        Math.max(
            0,
            deadline - Date.now()
        );

    const totalSeconds =
        Math.floor(
            remaining / 1000
        );

    const days =
        Math.floor(
            totalSeconds / 86400
        );

    const hours =
        Math.floor(
            (totalSeconds % 86400) /
            3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) /
            60
        );

    const seconds =
        totalSeconds % 60;


    if (daysEl) {

        daysEl.textContent =
            pad(days);
    }

    if (hoursEl) {

        hoursEl.textContent =
            pad(hours);
    }

    if (minutesEl) {

        minutesEl.textContent =
            pad(minutes);
    }

    if (secondsEl) {

        secondsEl.textContent =
            pad(seconds);
    }


    return remaining;
}


/* =========================
   DEAL VISIBILITY
========================= */

function showDealCards() {

    dealCards.forEach(card => {

        card.style.display = "";

    });


    if (noDeals) {

        noDeals.hidden = true;

    }


    if (dealExpiredMessage) {

        dealExpiredMessage.classList.remove(
            "show"
        );

    }


    applyDealControls();
}


function hideDealCards() {

    dealCards.forEach(card => {

        card.style.display = "none";

    });


    if (noDeals) {

        noDeals.hidden = false;

    }


    if (noResults) {

        noResults.hidden = true;

    }
}


/* =========================
   COOLDOWN DISPLAY
========================= */

function freezeTimerForCooldown() {

    /*
        IMPORTANT:
        The timer is completely frozen
        at zero during the cooldown.
    */

    showZeroTimer();


    if (dealExpiredMessage) {

        dealExpiredMessage.textContent =
            "Deals are currently unavailable.";

        dealExpiredMessage.classList.add(
            "show"
        );
    }


    if (cooldownText) {

        cooldownText.textContent =
            "NEW DEALS COMING SOON";
    }
}


/* =========================
   SEARCH / FILTER / SORT
========================= */

function applyDealControls() {

    const state =
        getDealState();


    /*
        Never show cards while
        deals are inactive.
    */

    if (
        state.phase !==
        "active"
    ) {

        hideDealCards();

        return;
    }


    const searchValue =
        dealSearch
            ? dealSearch.value
                .trim()
                .toLowerCase()
            : "";


    const filterValue =
        dealFilter
            ? dealFilter.value
            : "all";


    const sortValue =
        dealSort
            ? dealSort.value
            : "featured";


    const cards =
        Array.from(
            dealCards
        );


    const filteredCards =
        cards.filter(card => {

            /*
                Your HTML does NOT have
                data-name.

                So get the stay name
                directly from the h3.
            */

            const name =
                card
                    .querySelector("h3")
                    ?.textContent
                    .trim() || "";


            const location =
                card.dataset.location ||
                "";


            const type =
                card.dataset.type ||
                "";


            const searchableText =
                `${name} ${location} ${type}`
                    .toLowerCase();


            const matchesSearch =
                !searchValue ||
                searchableText.includes(
                    searchValue
                );


            const matchesFilter =
                filterValue === "all" ||
                type.toLowerCase() ===
                filterValue.toLowerCase();


            return (
                matchesSearch &&
                matchesFilter
            );
        });


    let sortedCards =
        [...filteredCards];


    /* BIGGEST DISCOUNT */

    if (
        sortValue === "discount"
    ) {

        sortedCards.sort(
            (a, b) => {

                return (
                    Number(
                        b.dataset.discount || 0
                    ) -
                    Number(
                        a.dataset.discount || 0
                    )
                );

            }
        );
    }


    /* LOWEST PRICE */

    if (
        sortValue === "price-low"
    ) {

        sortedCards.sort(
            (a, b) => {

                return (
                    Number(
                        a.dataset.price || 0
                    ) -
                    Number(
                        b.dataset.price || 0
                    )
                );

            }
        );
    }


    /* HIGHEST RATING */

    if (
        sortValue === "rating"
    ) {

        sortedCards.sort(
            (a, b) => {

                return (
                    Number(
                        b.dataset.rating || 0
                    ) -
                    Number(
                        a.dataset.rating || 0
                    )
                );

            }
        );
    }


    const container =
        document.querySelector(
            ".deals-grid"
        ) ||
        document.querySelector(
            ".deal-grid"
        ) ||
        dealCards[0]?.parentElement;


    if (container) {

        sortedCards.forEach(card => {

            container.appendChild(card);

        });

    }


    cards.forEach(card => {

        card.style.display =
            "none";

    });


    sortedCards.forEach(card => {

        card.style.display =
            "";

    });


    if (noResults) {

        noResults.hidden =
            sortedCards.length !== 0;

    }
}


/* =========================
   FAVORITES
========================= */

function getFavorites() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    FAVORITES_KEY
                ) || "[]"
            );

        return Array.isArray(saved)
            ? saved
            : [];

    } catch {

        return [];

    }
}


function saveFavorites(
    favorites
) {

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(
            favorites
        )
    );
}


function updateFavoriteCount() {

    if (!favoriteCount) {
        return;
    }

    favoriteCount.textContent =
        getFavorites().length;
}


function getCardStayName(card) {

    if (!card) {
        return "";
    }


    /*
        Your View Stay button contains:

        data-stay="Oceanview Resort & Spa"

        So get the name from there.
    */

    const button =
        card.querySelector(
            ".view-deal"
        ) ||
        card.querySelector(
            ".view-stay-btn"
        ) ||
        card.querySelector(
            ".deal-view-btn"
        ) ||
        card.querySelector(
            "[data-action='view-stay']"
        );


    return (
        button?.dataset.stay ||
        card.dataset.stay ||
        card.dataset.name ||
        card
            .querySelector("h3")
            ?.textContent
            .trim() ||
        ""
    );
}


function updateFavoriteButtons() {

    const favorites =
        getFavorites();


    document
        .querySelectorAll(
            ".favorite-btn"
        )
        .forEach(button => {

            const card =
                button.closest(
                    ".deal-card"
                );


            if (!card) {
                return;
            }


            const stayName =
                getCardStayName(
                    card
                );


            const isFavorite =
                favorites.includes(
                    stayName
                );


            button.classList.toggle(
                "active",
                isFavorite
            );


            button.setAttribute(
                "aria-pressed",
                String(
                    isFavorite
                )
            );


            button.textContent =
                isFavorite
                    ? "♥"
                    : "♡";

        });


    updateFavoriteCount();
}


function toggleFavorite(
    card,
    button
) {

    if (
        !card ||
        !button
    ) {
        return;
    }


    const stayName =
        getCardStayName(
            card
        );


    if (!stayName) {
        return;
    }


    const favorites =
        getFavorites();


    const index =
        favorites.indexOf(
            stayName
        );


    if (index === -1) {

        favorites.push(
            stayName
        );

        showToast(
            "Added to favorites"
        );

    } else {

        favorites.splice(
            index,
            1
        );

        showToast(
            "Removed from favorites"
        );
    }


    saveFavorites(
        favorites
    );


    updateFavoriteButtons();
}


/* =========================
   VIEW STAY / SELECT DEAL
========================= */

function handleViewStay(
    button
) {

    const card =
        button.closest(
            ".deal-card"
        );


    if (!card) {
        return;
    }


    /*
        Make sure the deal is still active.
    */

    const state =
        getDealState();


    if (
        state.phase !==
        "active"
    ) {

        showToast(
            "Deals are currently unavailable."
        );

        return;
    }


    /*
        IMPORTANT FIX:

        Your HTML uses:

        button data-stay
        card data-price
        card data-discount

        NOT:

        data-dealPrice
        data-regularPrice
    */

    const stayName =
        button.dataset.stay ||
        card.dataset.stay ||
        card
            .querySelector("h3")
            ?.textContent
            .trim() ||
        "";


    /*
        Discounted price from:

        data-price="78"
    */

    const dealPrice =
        Number(
            card.dataset.price || 0
        );


    /*
        Discount percentage from:

        data-discount="35"
    */

    const discount =
        Number(
            card.dataset.discount || 0
        );


    /*
        Original price comes from
        the StayNest stay data.
    */

    const regularPrice =
        Number(
            stayPrices[stayName] || 0
        );


    const rating =
        Number(
            card.dataset.rating || 0
        );


    const location =
        card.dataset.location || "";


    /*
        Safety check.
    */

    if (
        !stayName ||
        !regularPrice ||
        !dealPrice
    ) {

        console.error(
            "Deal price data missing:",
            {
                stayName,
                regularPrice,
                dealPrice,
                discount
            }
        );

        showToast(
            "Unable to load this deal."
        );

        return;
    }


    /*
        Save selected stay.
    */

    localStorage.setItem(
        "staynestSelectedStay",
        stayName
    );


    /*
        Save the COMPLETE deal.

        Booking.js will read this.
    */

    const selectedDeal = {

        stay:
            stayName,

        regularPrice:
            regularPrice,

        dealPrice:
            dealPrice,

        discount:
            discount,

        rating:
            rating,

        location:
            location,

        expiresAt:
            state.deadline

    };


    localStorage.setItem(
        SELECTED_DEAL_KEY,
        JSON.stringify(
            selectedDeal
        )
    );


    /*
        Go to Stay Details.
    */

    window.location.href =
        `stay-details.html?stay=${encodeURIComponent(
            stayName
        )}`;
}


/* =========================
   TIMER LIFECYCLE
========================= */

function stopActiveTimer() {

    if (
        activeTimerInterval !==
        null
    ) {

        clearInterval(
            activeTimerInterval
        );

        activeTimerInterval =
            null;
    }
}


function cancelCooldownTimeout() {

    if (
        cooldownTimeout !==
        null
    ) {

        clearTimeout(
            cooldownTimeout
        );

        cooldownTimeout =
            null;
    }
}


function scheduleCooldownEnd(
    cooldownEnds
) {

    cancelCooldownTimeout();


    const delay =
        Math.max(
            0,
            cooldownEnds -
            Date.now()
        );


    cooldownTimeout =
        setTimeout(
            () => {

                cooldownTimeout =
                    null;

                syncDealCycle();

            },
            delay + 50
        );
}


function beginActiveTimer(
    deadline
) {

    stopActiveTimer();

    cancelCooldownTimeout();


    showDealCards();


    showActiveTimer(
        deadline
    );


    /*
        Timer ticks ONLY while
        deals are active.
    */

    activeTimerInterval =
        setInterval(
            () => {

                const currentState =
                    getDealState();


                if (
                    currentState.phase !==
                    "active"
                ) {

                    stopActiveTimer();

                    syncDealCycle();

                    return;
                }


                const remaining =
                    showActiveTimer(
                        currentState.deadline
                    );


                if (
                    remaining <= 0
                ) {

                    stopActiveTimer();

                    syncDealCycle();
                }

            },
            1000
        );
}


function beginCooldown(
    cooldownEnds
) {

    stopActiveTimer();


    /*
        NO interval here.

        The visible timer stays
        frozen at 00:00:00:00.
    */

    freezeTimerForCooldown();


    hideDealCards();


    scheduleCooldownEnd(
        cooldownEnds
    );
}


function syncDealCycle() {

    const state =
        getDealState();


    if (
        state.phase ===
        "active"
    ) {

        beginActiveTimer(
            state.deadline
        );

    } else {

        beginCooldown(
            state.cooldownEnds
        );
    }
}


/* =========================
   TOAST
========================= */

function showToast(
    message
) {

    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );
}


/* =========================
   MOBILE MENU
========================= */

function setupMobileMenu() {

    if (
        !menuBtn ||
        !navLinks
    ) {
        return;
    }


    menuBtn.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle(
                "mobile-open"
            );


            const isOpen =
                navLinks.classList.contains(
                    "mobile-open"
                );


            menuBtn.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !navLinks.contains(
                    event.target
                ) &&
                !menuBtn.contains(
                    event.target
                )
            ) {

                navLinks.classList.remove(
                    "mobile-open"
                );


                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

        }
    );
}


/* =========================
   ACCOUNT LINK
========================= */

function setupAccountLink() {

    if (!accountLink) {
        return;
    }


    const currentUser =
        localStorage.getItem(
            "staynestCurrentUser"
        );


    if (currentUser) {

        accountLink.textContent =
            "Dashboard";

        accountLink.href =
            "dashboard.html";

    } else {

        accountLink.textContent =
            "Sign in";

        accountLink.href =
            "login.html";
    }
}


/* =========================
   NEWSLETTER
========================= */

function setupNewsletter() {

    if (!newsletterForm) {
        return;
    }


    newsletterForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const email =
                newsletterEmail?.value
                    .trim() || "";


            if (!email) {

                if (newsletterMessage) {

                    newsletterMessage.textContent =
                        "Please enter your email.";
                }

                return;
            }


            localStorage.setItem(
                "staynestNewsletterEmail",
                email
            );


            if (newsletterMessage) {

                newsletterMessage.textContent =
                    "You're subscribed! ✈️";
            }


            newsletterForm.reset();

        }
    );
}


/* =========================
   EVENT LISTENERS
========================= */

function setupDealEvents() {

    dealCards.forEach(
        card => {

            const favoriteButton =
                card.querySelector(
                    ".favorite-btn"
                );


            /*
                IMPORTANT:
                Your HTML uses .view-deal.
            */

            const viewButton =
                card.querySelector(
                    ".view-deal"
                ) ||
                card.querySelector(
                    ".view-stay-btn"
                ) ||
                card.querySelector(
                    ".deal-view-btn"
                ) ||
                card.querySelector(
                    "[data-action='view-stay']"
                );


            if (favoriteButton) {

                favoriteButton.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        event.stopPropagation();

                        toggleFavorite(
                            card,
                            favoriteButton
                        );

                    }
                );
            }


            if (viewButton) {

                viewButton.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        handleViewStay(
                            viewButton
                        );

                    }
                );
            }

        }
    );


    if (dealSearch) {

        dealSearch.addEventListener(
            "input",
            () => {

                if (
                    getDealState()
                        .phase ===
                    "active"
                ) {

                    applyDealControls();
                }

            }
        );
    }


    if (dealFilter) {

        dealFilter.addEventListener(
            "change",
            () => {

                if (
                    getDealState()
                        .phase ===
                    "active"
                ) {

                    applyDealControls();
                }

            }
        );
    }


    if (dealSort) {

        dealSort.addEventListener(
            "change",
            () => {

                if (
                    getDealState()
                        .phase ===
                    "active"
                ) {

                    applyDealControls();
                }

            }
        );
    }
}


/* =========================
   PAGE VISIBILITY
========================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (!document.hidden) {

            syncDealCycle();

            updateFavoriteButtons();
        }

    }
);


window.addEventListener(
    "focus",
    () => {

        syncDealCycle();

        updateFavoriteButtons();

    }
);


/* =========================
   INITIALIZE
========================= */

function initializeDealsPage() {

    setupMobileMenu();

    setupAccountLink();

    setupNewsletter();

    setupDealEvents();

    updateFavoriteButtons();

    syncDealCycle();
}


initializeDealsPage();