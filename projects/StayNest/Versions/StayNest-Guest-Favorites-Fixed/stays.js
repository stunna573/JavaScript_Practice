
// Favorites are available to both guests and signed-in users.
// Favorites are stored locally in this browser, so no account is required.
function stayNestFavoritesAllowed() {
    return true;
}

document.addEventListener("DOMContentLoaded", () => {

    const cards = Array.from(
        document.querySelectorAll(".stay-card")
    );

    const destinationSearch =
        document.getElementById("destinationSearch");

    const searchButton =
        document.getElementById("searchButton");

    const sortSelect =
        document.getElementById("sort");

    const resultsTitle =
        document.getElementById("resultsTitle");

    const resultsCount =
        document.getElementById("resultsCount");

    const clearFilters =
        document.getElementById("clearFilters");

    const checkIn =
        document.getElementById("checkIn");

    const checkOut =
        document.getElementById("checkOut");

    const newsletterForm =
        document.getElementById("newsletterForm");

    const newsletterEmail =
        document.getElementById("newsletterEmail");


    /* ================= HELPERS ================= */

    function showMessage(message) {
        alert(message);
    }


    function normalize(value) {
        return String(value || "")
            .trim()
            .toLowerCase();
    }


    /* ================= URL SEARCH ================= */

    const params =
        new URLSearchParams(window.location.search);

    const urlSearch =
        params.get("search") ||
        params.get("destination");

    const favoritesMode =
        params.get("favorites") === "true";


    if (urlSearch && destinationSearch) {
        destinationSearch.value = urlSearch;
    } else if (!favoritesMode && destinationSearch) {
        destinationSearch.value = "";
    }


    /* ================= FILTERING ================= */

    function filterStays() {

        const searchTerm =
            normalize(destinationSearch.value);

        const selectedTypes =
            Array.from(
                document.querySelectorAll(
                    'input[name="propertyType"]:checked'
                )
            ).map(input => normalize(input.value));

        const selectedRating =
            document.querySelector(
                'input[name="rating"]:checked'
            );

        const selectedPrice =
            document.querySelector(
                'input[name="price"]:checked'
            );


        const minimumRating =
            selectedRating
                ? Number(selectedRating.value)
                : 0;

        const maximumPrice =
            selectedPrice
                ? Number(selectedPrice.value)
                : Infinity;


        cards.forEach(card => {

            const name =
                normalize(card.dataset.name);

            const location =
                normalize(card.dataset.location);

            const type =
                normalize(card.dataset.type);

            const price =
                Number(card.dataset.price);

            const rating =
                Number(card.dataset.rating);


            const matchesSearch =
                !searchTerm ||
                name.includes(searchTerm) ||
                location.includes(searchTerm);

            const matchesType =
                selectedTypes.length === 0 ||
                selectedTypes.includes(type);

            const matchesRating =
                rating >= minimumRating;

            const matchesPrice =
                price <= maximumPrice;


            const matches =
                matchesSearch &&
                matchesType &&
                matchesRating &&
                matchesPrice;


            card.style.display =
                matches ? "" : "none";

        });


        updateResults();
    }


    /* ================= RESULTS ================= */

    function updateResults() {

        const visibleCards =
            cards.filter(card =>
                card.style.display !== "none"
            );


        resultsCount.textContent =
            `${visibleCards.length} ${
                visibleCards.length === 1
                    ? "property"
                    : "properties"
            } found`;


        const searchTerm =
            destinationSearch.value.trim();


        if (favoritesMode) {

            resultsTitle.textContent =
                "My favorites";

        } else if (searchTerm) {

            resultsTitle.textContent =
                `Stays matching "${searchTerm}"`;

        } else {

            resultsTitle.textContent =
                "All stays";
        }
    }


    /* ================= SEARCH ================= */

    function performSearch() {

        const searchTerm =
            destinationSearch.value.trim();


        if (!searchTerm) {

            window.location.href =
                "stays.html";

            return;
        }


        const matchingCard =
            cards.find(card => {

                const name =
                    normalize(card.dataset.name);

                const location =
                    normalize(card.dataset.location);

                const search =
                    normalize(searchTerm);

                return (
                    name.includes(search) ||
                    location.includes(search)
                );

            });


        if (!matchingCard) {

            showMessage(
                `No stays or destinations found for "${searchTerm}".`
            );

            return;
        }


        window.location.href =
            `stays.html?search=${encodeURIComponent(
                searchTerm
            )}`;
    }


    searchButton.addEventListener(
        "click",
        performSearch
    );


    destinationSearch.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                event.preventDefault();
                performSearch();
            }

        }
    );


    /* ================= SORT ================= */

    sortSelect.addEventListener(
        "change",
        () => {

            const grid =
                document.getElementById("staysGrid");

            const sortedCards =
                [...cards].sort((a, b) => {

                    const priceA =
                        Number(a.dataset.price);

                    const priceB =
                        Number(b.dataset.price);

                    const ratingA =
                        Number(a.dataset.rating);

                    const ratingB =
                        Number(b.dataset.rating);


                    switch (sortSelect.value) {

                        case "price-low":
                            return priceA - priceB;

                        case "price-high":
                            return priceB - priceA;

                        case "rating":
                            return ratingB - ratingA;

                        case "popular":
                        default:
                            return 0;
                    }

                });


            sortedCards.forEach(card =>
                grid.appendChild(card)
            );

        }
    );


    /* ================= FILTER EVENTS ================= */

    document
        .querySelectorAll(
            '.filter-group input'
        )
        .forEach(input => {

            input.addEventListener(
                "change",
                filterStays
            );

        });


    clearFilters.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(
                    '.filter-group input'
                )
                .forEach(input => {

                    input.checked = false;

                });


            destinationSearch.value = "";

            cards.forEach(card => {
                card.style.display = "";
            });


            updateResults();

        }
    );


    /* ================= FAVORITES ================= */

    const FAVORITES_KEY =
        "staynestFavorites";


    function getFavorites() {

        try {

            return JSON.parse(
                localStorage.getItem(FAVORITES_KEY)
            ) || [];

        } catch {

            return [];

        }

    }


    function saveFavorites(favorites) {

        localStorage.setItem(
            FAVORITES_KEY,
            JSON.stringify(favorites)
        );

    }


    function updateFavoriteButtons() {

        const favorites =
            getFavorites();


        cards.forEach(card => {

            const button =
                card.querySelector(".favorite");

            const stay =
                card.dataset.name;


            const saved =
                favorites.includes(stay);


            button.classList.toggle(
                "saved",
                saved
            );


            button.textContent =
                saved ? "♥" : "♡";

        });

    }


    document
        .querySelectorAll(".favorite")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const card =
                        button.closest(".stay-card");

                    const stay =
                        card.dataset.name;

                    let favorites =
                        getFavorites();


                    if (favorites.includes(stay)) {

                        favorites =
                            favorites.filter(
                                item => item !== stay
                            );

                    } else {

                        favorites.push(stay);

                    }


                    saveFavorites(favorites);

                    updateFavoriteButtons();

                }
            );

        });


    /* ================= FAVORITES MODE ================= */

    function filterFavorites() {

        const favorites =
            getFavorites();


        cards.forEach(card => {

            const stay =
                card.dataset.name;


            card.style.display =
                favorites.includes(stay)
                    ? ""
                    : "none";

        });


        resultsTitle.textContent =
            "My favorites";


        updateResults();

    }


/* =================================================
   VIEW STAY
================================================= */

document
    .querySelectorAll(".view-stay")
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const card =
                    button.closest(".stay-card");

                if (!card) {
                    return;
                }

                const stay =
                    card.dataset.name;

                if (!stay) {
                    return;
                }

                localStorage.setItem(
                    "staynestSelectedStay",
                    stay
                );

                window.location.href =
                    `stay-details.html?stay=${encodeURIComponent(stay)}`;

            }
        );

    });

    /* ================= BOOK NOW ================= */

    document
        .querySelectorAll(".book-stay")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const card =
                        button.closest(".stay-card");

                    const stay =
                        card.dataset.name;


                    window.location.href =
                        `booking.html?stay=${encodeURIComponent(
                            stay
                        )}`;

                }
            );

        });


    /* ================= DATE VALIDATION ================= */

    checkIn.addEventListener(
        "change",
        () => {

            if (!checkIn.value) {
                return;
            }


            checkOut.min =
                checkIn.value;


            if (
                checkOut.value &&
                checkOut.value <= checkIn.value
            ) {

                checkOut.value = "";

            }

        }
    );


    checkOut.addEventListener(
        "change",
        () => {

            if (
                checkIn.value &&
                checkOut.value <= checkIn.value
            ) {

                showMessage(
                    "Check-out must be after check-in."
                );

                checkOut.value = "";

            }

        }
    );


    /* ================= NEWSLETTER ================= */

    newsletterForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const email =
                newsletterEmail.value.trim();


            if (!email) {
                return;
            }


            localStorage.setItem(
                "staynestNewsletterEmail",
                email
            );


            showMessage(
                "Thanks for subscribing to StayNest!"
            );


            newsletterForm.reset();

        }
    );


    /* ================= INITIAL LOAD ================= */

    updateFavoriteButtons();


    if (favoritesMode) {

        filterFavorites();

    } else {

        filterStays();

    }


    console.log(
        "StayNest stays page loaded successfully."
    );

});