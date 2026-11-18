
// Favorites are available to both guests and signed-in users.
// Favorites are stored locally in this browser, so no account is required.
function stayNestFavoritesAllowed() {
    return true;
}

/* =====================================================
   STAYNEST - DESTINATIONS PAGE JAVASCRIPT
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =================================================
           ELEMENTS
        ================================================= */

        const searchInput =
            document.getElementById(
                "destinationSearch"
            );

        const regionFilter =
            document.getElementById(
                "regionFilter"
            );

        const sortSelect =
            document.getElementById(
                "sortDestinations"
            );

        const destinationGrid =
            document.getElementById(
                "destinationGrid"
            );

        const cards =
            Array.from(
                document.querySelectorAll(
                    ".destination-card"
                )
            );

        const resultCount =
            document.getElementById(
                "resultCount"
            );

        const noResults =
            document.getElementById(
                "noResults"
            );

        const resetButton =
            document.getElementById(
                "resetSearch"
            );

        const menuButton =
            document.querySelector(
                ".menu-button"
            );

        const mobileMenu =
            document.querySelector(
                ".mobile-menu"
            );


        /* =================================================
           TOAST
        ================================================= */

        function showToast(
            message,
            type = "success"
        ) {

            let toast =
                document.querySelector(
                    ".toast"
                );

            if (!toast) {

                toast =
                    document.createElement(
                        "div"
                    );

                toast.className =
                    "toast";

                document.body.appendChild(
                    toast
                );
            }


            toast.textContent =
                message;


            toast.classList.remove(
                "error"
            );


            if (type === "error") {

                toast.classList.add(
                    "error"
                );
            }


            toast.classList.add(
                "show"
            );


            clearTimeout(
                toast.timeout
            );


            toast.timeout =
                setTimeout(
                    () => {

                        toast.classList.remove(
                            "show"
                        );

                    },
                    3000
                );
        }


        /* =================================================
           NORMALIZE TEXT
        ================================================= */

        function normalize(text) {

            return text
                .toLowerCase()
                .trim()
                .replace(/[.,]/g, "")
                .replace(/\s+/g, " ");
        }


        /* =================================================
           FAVORITES
        ================================================= */

        let favorites =
            JSON.parse(
                localStorage.getItem(
                    "staynestDestinationFavorites"
                ) || "[]"
            );


        function updateFavoriteButtons() {

            document.querySelectorAll(
                ".favorite-button"
            ).forEach(
                button => {

                    const card =
                        button.closest(
                            ".destination-card"
                        );

                    if (!card) {
                        return;
                    }


                    const name =
                        card.dataset.name;


                    if (
                        favorites.includes(
                            name
                        )
                    ) {

                        button.textContent =
                            "♥";

                        button.classList.add(
                            "is-favorite"
                        );

                        button.setAttribute(
                            "aria-label",
                            `Remove ${name} from favorites`
                        );

                    } else {

                        button.textContent =
                            "♡";

                        button.classList.remove(
                            "is-favorite"
                        );

                        button.setAttribute(
                            "aria-label",
                            `Add ${name} to favorites`
                        );
                    }
                }
            );
        }


        updateFavoriteButtons();


        /* =================================================
           FAVORITE BUTTON CLICK
        ================================================= */

        document.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        ".favorite-button"
                    );

                if (!button) {
                    return;
                }


                const card =
                    button.closest(
                        ".destination-card"
                    );

                if (!card) {
                    return;
                }


                const name =
                    card.dataset.name;


                if (
                    favorites.includes(
                        name
                    )
                ) {

                    favorites =
                        favorites.filter(
                            item =>
                                item !== name
                        );

                    showToast(
                        `${name} removed from favorites.`
                    );

                } else {

                    favorites.push(
                        name
                    );

                    showToast(
                        `${name} added to favorites.`
                    );
                }


                localStorage.setItem(
                    "staynestDestinationFavorites",
                    JSON.stringify(
                        favorites
                    )
                );


                updateFavoriteButtons();
            }
        );


        /* =================================================
           SORT DESTINATIONS
        ================================================= */

        function sortCards(
            cardList
        ) {

            const sortValue =
                sortSelect.value;


            cardList.sort(
                (a, b) => {

                    const nameA =
                        a.dataset.name;

                    const nameB =
                        b.dataset.name;

                    const propertiesA =
                        Number(
                            a.dataset.properties
                        );

                    const propertiesB =
                        Number(
                            b.dataset.properties
                        );

                    const popularityA =
                        Number(
                            a.dataset.popularity
                        );

                    const popularityB =
                        Number(
                            b.dataset.popularity
                        );


                    if (
                        sortValue ===
                        "properties-high"
                    ) {

                        return (
                            propertiesB -
                            propertiesA
                        );
                    }


                    if (
                        sortValue ===
                        "properties-low"
                    ) {

                        return (
                            propertiesA -
                            propertiesB
                        );
                    }


                    if (
                        sortValue ===
                        "name"
                    ) {

                        return nameA.localeCompare(
                            nameB
                        );
                    }


                    return (
                        popularityB -
                        popularityA
                    );
                }
            );


            cardList.forEach(
                card => {

                    destinationGrid.appendChild(
                        card
                    );
                }
            );
        }


        /* =================================================
           FILTER DESTINATIONS
        ================================================= */

        function filterDestinations() {

            const searchTerm =
                normalize(
                    searchInput.value
                );

            const selectedRegion =
                regionFilter.value;


            const visibleCards =
                cards.filter(
                    card => {

                        const name =
                            normalize(
                                card.dataset.name
                            );

                        const region =
                            card.dataset.region;


                        /*
                           Allows:
                           "Bali"
                           "Bali Indonesia"
                           "bali, indonesia"
                        */

                        const matchesSearch =
                            !searchTerm ||
                            name.includes(
                                searchTerm
                            ) ||
                            searchTerm.includes(
                                name
                                    .split(" ")[0]
                            );


                        const matchesRegion =
                            selectedRegion ===
                                "all" ||
                            region ===
                                selectedRegion;


                        return (
                            matchesSearch &&
                            matchesRegion
                        );
                    }
                );


            sortCards(
                visibleCards
            );


            cards.forEach(
                card => {

                    card.style.display =
                        visibleCards.includes(
                            card
                        )
                            ? ""
                            : "none";
                }
            );


            resultCount.textContent =
                `${visibleCards.length} destination${
                    visibleCards.length === 1
                        ? ""
                        : "s"
                }`;


            if (
                visibleCards.length === 0
            ) {

                noResults.classList.add(
                    "show"
                );

            } else {

                noResults.classList.remove(
                    "show"
                );
            }
        }


        /* =================================================
           SEARCH EVENTS
        ================================================= */

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                filterDestinations
            );


            searchInput.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        filterDestinations();
                    }
                }
            );
        }


        if (regionFilter) {

            regionFilter.addEventListener(
                "change",
                filterDestinations
            );
        }


        if (sortSelect) {

            sortSelect.addEventListener(
                "change",
                filterDestinations
            );
        }


        /* =================================================
           RESET
        ================================================= */

        if (resetButton) {

            resetButton.addEventListener(
                "click",
                () => {

                    searchInput.value =
                        "";

                    regionFilter.value =
                        "all";

                    sortSelect.value =
                        "popular";


                    cards.forEach(
                        card => {

                            card.style.display =
                                "";

                            destinationGrid.appendChild(
                                card
                            );
                        }
                    );


                    noResults.classList.remove(
                        "show"
                    );


                    resultCount.textContent =
                        `${cards.length} destinations`;


                    showToast(
                        "Destination filters reset."
                    );
                }
            );
        }


/* =================================================
   READ SEARCH FROM URL
================================================= */

const params =
    new URLSearchParams(
        window.location.search
    );


/*
   Search system:

   destinations.html
   → SHOW ALL DESTINATIONS

   destinations.html?search=Bali
   → SHOW ONLY BALI

   destinations.html?destination=Bali
   → SHOW ONLY BALI
*/

const urlSearch =
    params.get("search") ||
    params.get("destination");


if (
    urlSearch &&
    searchInput
) {

    searchInput.value =
        urlSearch;

    filterDestinations();

} else {

    // No search in URL = reset to normal
    if (searchInput) {
        searchInput.value = "";
    }

    filterDestinations();
}

        /* =================================================
           EXPLORE STAYS
        ================================================= */

        document.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        ".explore-button"
                    );

                if (!button) {
                    return;
                }


                const destination =
                    button.dataset.destination;


                if (!destination) {
                    return;
                }


                localStorage.setItem(
                    "staynestSelectedDestination",
                    destination
                );


                window.location.href =
                    `stays.html?search=${encodeURIComponent(
                        destination
                    )}`;
            }
        );


        /* =================================================
           MOBILE MENU
        ================================================= */

        if (
            menuButton &&
            mobileMenu
        ) {

            menuButton.addEventListener(
                "click",
                () => {

                    mobileMenu.classList.toggle(
                        "show"
                    );


                    const isOpen =
                        mobileMenu.classList.contains(
                            "show"
                        );


                    menuButton.textContent =
                        isOpen
                            ? "✕"
                            : "☰";
                }
            );


            mobileMenu
                .querySelectorAll("a")
                .forEach(
                    link => {

                        link.addEventListener(
                            "click",
                            () => {

                                mobileMenu.classList.remove(
                                    "show"
                                );

                                menuButton.textContent =
                                    "☰";
                            }
                        );
                    }
                );
        }


        /* =================================================
           NEWSLETTER
        ================================================= */

        const newsletterForm =
            document.getElementById(
                "newsletterForm"
            );

        const newsletterEmail =
            document.getElementById(
                "newsletterEmail"
            );


        if (newsletterForm) {

            newsletterForm.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    const email =
                        newsletterEmail
                            ? newsletterEmail.value.trim()
                            : "";


                    const emailPattern =
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                    if (!email) {

                        showToast(
                            "Please enter your email.",
                            "error"
                        );

                        return;
                    }


                    if (
                        !emailPattern.test(
                            email
                        )
                    ) {

                        showToast(
                            "Please enter a valid email address.",
                            "error"
                        );

                        return;
                    }


                    localStorage.setItem(
                        "staynestNewsletterEmail",
                        email
                    );


                    newsletterEmail.value =
                        "";


                    showToast(
                        "You're subscribed to StayNest!"
                    );
                }
            );
        }


        /* =================================================
           APP BUTTONS
        ================================================= */

        document.querySelectorAll(
            ".app-buttons button"
        ).forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        showToast(
                            "The StayNest app is coming soon!"
                        );
                    }
                );
            }
        );


        console.log(
            "StayNest Destinations JS loaded successfully."
        );

    }
);