
// Favorites are available to both guests and signed-in users.
// Favorites are stored locally in this browser, so no account is required.
function stayNestFavoritesAllowed() {
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       CHECK LOGIN
    ========================= */

    let currentUser = null;

    try {
        currentUser = JSON.parse(
            localStorage.getItem("staynestCurrentUser") || "null"
        );
    } catch {
        currentUser = null;
    }

    

    /* =========================
       ELEMENTS
    ========================= */

    const favoritesGrid =
        document.getElementById("favoritesGrid");

    const emptyState =
        document.getElementById("emptyState");

    const destinationFavoritesGrid =
        document.getElementById("destinationFavoritesGrid");

    const destinationEmptyState =
        document.getElementById("destinationEmptyState");

    const menuButton =
        document.getElementById("menuButton");

    const navLinks =
        document.querySelector(".nav-links");

    if (!favoritesGrid || !emptyState) {
        return;
    }

    /* =========================
       MOBILE MENU
    ========================= */

    if (menuButton && navLinks) {
        menuButton.addEventListener("click", () => {
            navLinks.classList.toggle("show");

            menuButton.setAttribute(
                "aria-expanded",
                String(navLinks.classList.contains("show"))
            );
        });
    }

    /* =========================
       STAY DATA
    ========================= */

    const stays = [
        {
            name: "Oceanview Resort & Spa",
            location: "Bali, Indonesia",
            price: 120,
            rating: 4.8,
            reviews: 2425,
            image: "./Assets/ocean_view.jpeg"
        },
        {
            name: "The Grand Paris Hotel",
            location: "Paris, France",
            price: 210,
            rating: 4.7,
            reviews: 2356,
            image: "./Assets/grand_paris.jpeg"
        },
        {
            name: "Maldives Paradise",
            location: "Maldives",
            price: 350,
            rating: 4.9,
            reviews: 1785,
            image: "./Assets/maldavies_paradise_.jpeg"
        },
        {
            name: "Luxury Stay Dubai",
            location: "Dubai, UAE",
            price: 160,
            rating: 4.6,
            reviews: 1102,
            image: "./Assets/luxury_stay_.jpeg"
        },
        {
            name: "Blue Horizon Hotel",
            location: "New York, USA",
            price: 190,
            rating: 4.7,
            reviews: 1932,
            image: "./Assets/blue_horizon.jpeg"
        }
    ];

    const destinations = [
        {
            name: "Bali, Indonesia",
            properties: 1345,
            image: "./Assets/bali.jpeg"
        },
        {
            name: "Paris, France",
            properties: 2450,
            image: "./Assets/paris.jpeg"
        },
        {
            name: "Dubai, UAE",
            properties: 1676,
            image: "./Assets/dubai.jpeg"
        },
        {
            name: "Maldives",
            properties: 980,
            image: "./Assets/maldavies.jpeg"
        },
        {
            name: "New York, USA",
            properties: 2120,
            image: "./Assets/newyork.jpeg"
        }
    ];

    /* =========================
       STAY FAVORITES
    ========================= */

    function getFavorites() {
        try {
            const saved = JSON.parse(
                localStorage.getItem("staynestFavorites") || "[]"
            );

            return Array.isArray(saved) ? saved : [];
        } catch {
            return [];
        }
    }

    function saveFavorites(favorites) {
        localStorage.setItem(
            "staynestFavorites",
            JSON.stringify(favorites)
        );
    }

    function renderFavorites() {
        const favorites = getFavorites();

        favoritesGrid.innerHTML = "";

        const favoriteStays =
            stays.filter(stay =>
                favorites.includes(stay.name)
            );

        if (favoriteStays.length === 0) {
            favoritesGrid.style.display = "none";
            emptyState.style.display = "block";
            return;
        }

        favoritesGrid.style.display = "grid";
        emptyState.style.display = "none";

        favoriteStays.forEach(stay => {
            const card = document.createElement("article");
            card.className = "favorite-card";

            const imageWrapper = document.createElement("div");
            imageWrapper.className = "favorite-image-wrapper";

            const image = document.createElement("img");
            image.className = "favorite-image";
            image.src = stay.image;
            image.alt = stay.name;

            const removeButton = document.createElement("button");
            removeButton.className = "remove-favorite";
            removeButton.type = "button";
            removeButton.setAttribute(
                "aria-label",
                `Remove ${stay.name} from favorites`
            );
            removeButton.textContent = "♥";

            removeButton.addEventListener("click", () => {
                const updated =
                    getFavorites().filter(item => item !== stay.name);

                saveFavorites(updated);
                renderFavorites();
            });

            imageWrapper.appendChild(image);
            imageWrapper.appendChild(removeButton);

            const content = document.createElement("div");
            content.className = "favorite-content";

            const title = document.createElement("h3");
            title.textContent = stay.name;

            const location = document.createElement("p");
            location.className = "favorite-location";
            location.textContent = stay.location;

            const details = document.createElement("div");
            details.className = "favorite-details";

            const rating = document.createElement("div");
            rating.className = "rating";
            rating.textContent =
                `★ ${stay.rating} (${stay.reviews.toLocaleString()})`;

            const price = document.createElement("div");
            price.className = "price";
            price.innerHTML =
                `$${stay.price.toLocaleString()} <small>/ night</small>`;

            details.appendChild(rating);
            details.appendChild(price);

            const viewButton = document.createElement("a");
            viewButton.className = "view-stay";
            viewButton.href =
                `stay-details.html?stay=${encodeURIComponent(stay.name)}`;
            viewButton.textContent = "View Stay";

            content.appendChild(title);
            content.appendChild(location);
            content.appendChild(details);
            content.appendChild(viewButton);

            card.appendChild(imageWrapper);
            card.appendChild(content);

            favoritesGrid.appendChild(card);
        });
    }

    /* =========================
       DESTINATION FAVORITES
    ========================= */

    function getDestinationFavorites() {
        try {
            const saved = JSON.parse(
                localStorage.getItem("staynestDestinationFavorites") || "[]"
            );

            return Array.isArray(saved) ? saved : [];
        } catch {
            return [];
        }
    }

    function saveDestinationFavorites(favorites) {
        localStorage.setItem(
            "staynestDestinationFavorites",
            JSON.stringify(favorites)
        );
    }

    function renderDestinationFavorites() {
        if (!destinationFavoritesGrid || !destinationEmptyState) {
            return;
        }

        const favorites = getDestinationFavorites();

        destinationFavoritesGrid.innerHTML = "";

        const favoriteDestinations =
            destinations.filter(destination =>
                favorites.includes(destination.name)
            );

        if (favoriteDestinations.length === 0) {
            destinationFavoritesGrid.style.display = "none";
            destinationEmptyState.style.display = "block";
            return;
        }

        destinationFavoritesGrid.style.display = "grid";
        destinationEmptyState.style.display = "none";

        favoriteDestinations.forEach(destination => {
            const card = document.createElement("article");
            card.className = "favorite-card";

            const imageWrapper = document.createElement("div");
            imageWrapper.className = "favorite-image-wrapper";

            const image = document.createElement("img");
            image.className = "favorite-image";
            image.src = destination.image;
            image.alt = destination.name;

            const removeButton = document.createElement("button");
            removeButton.className = "remove-favorite";
            removeButton.type = "button";
            removeButton.textContent = "♥";
            removeButton.setAttribute(
                "aria-label",
                `Remove ${destination.name} from favorite destinations`
            );

            removeButton.addEventListener("click", () => {
                const updated =
                    getDestinationFavorites().filter(
                        item => item !== destination.name
                    );

                saveDestinationFavorites(updated);
                renderDestinationFavorites();
            });

            imageWrapper.appendChild(image);
            imageWrapper.appendChild(removeButton);

            const content = document.createElement("div");
            content.className = "favorite-content";

            const title = document.createElement("h3");
            title.textContent = destination.name;

            const propertyCount = document.createElement("p");
            propertyCount.className = "favorite-location";
            propertyCount.textContent =
                `${destination.properties.toLocaleString()} properties`;

            const viewButton = document.createElement("a");
            viewButton.className = "view-stay";
            viewButton.href =
                `stays.html?search=${encodeURIComponent(destination.name)}`;
            viewButton.textContent = "Explore Stays";

            content.appendChild(title);
            content.appendChild(propertyCount);
            content.appendChild(viewButton);

            card.appendChild(imageWrapper);
            card.appendChild(content);

            destinationFavoritesGrid.appendChild(card);
        });
    }

    renderFavorites();
    renderDestinationFavorites();
});
