// StayNest Stays
// Guests and signed-in users can favorite stays.

function stayNestFavoritesAllowed() {
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    const cards = Array.from(document.querySelectorAll(".stay-card"));
    const destinationSearch = document.getElementById("destinationSearch");
    const searchButton = document.getElementById("searchButton");
    const sortSelect = document.getElementById("sort");
    const resultsTitle = document.getElementById("resultsTitle");
    const resultsCount = document.getElementById("resultsCount");
    const clearFilters = document.getElementById("clearFilters");
    const pagination = document.getElementById("staysPagination");
    const PAGE_SIZE = 6;
    let currentPage = 1;
    let filteredCards = [...cards];

    const normalize = value => String(value || "").trim().toLowerCase();

    function showMessage(message) {
        alert(message);
    }

    function getFavorites() {
        try {
            const saved = JSON.parse(localStorage.getItem("staynestFavorites") || "[]");
            return Array.isArray(saved) ? saved : [];
        } catch {
            return [];
        }
    }

    function saveFavorites(list) {
        localStorage.setItem("staynestFavorites", JSON.stringify(list));
    }

    function updateFavoriteButtons() {
        const favorites = getFavorites();
        cards.forEach(card => {
            const button = card.querySelector(".favorite");
            if (!button) return;
            const name = card.dataset.name;
            const active = favorites.includes(name);
            button.textContent = active ? "♥" : "♡";
            button.classList.toggle("active", active);
            button.setAttribute("aria-label", active ? `Remove ${name} from favorites` : `Add ${name} to favorites`);
        });
    }

    cards.forEach(card => {
        const favorite = card.querySelector(".favorite");
        const viewButton = card.querySelector(".view-stay");
        const bookButton = card.querySelector(".book-stay");

        favorite?.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            const name = card.dataset.name;
            let favorites = getFavorites();
            if (favorites.includes(name)) {
                favorites = favorites.filter(item => item !== name);
            } else {
                favorites.push(name);
            }
            saveFavorites(favorites);
            updateFavoriteButtons();
        });

        viewButton?.addEventListener("click", () => {
            const name = card.dataset.name;
            localStorage.setItem("staynestSelectedStay", name);
            window.location.href = `stay-details.html?stay=${encodeURIComponent(name)}`;
        });

        bookButton?.addEventListener("click", () => {
            const name = card.dataset.name;
            localStorage.setItem("staynestSelectedStay", name);
            window.location.href = `booking.html?stay=${encodeURIComponent(name)}`;
        });
    });

    function sortCards(list) {
        const value = sortSelect?.value || "popular";
        return [...list].sort((a, b) => {
            const priceA = Number(a.dataset.price);
            const priceB = Number(b.dataset.price);
            const ratingA = Number(a.dataset.rating);
            const ratingB = Number(b.dataset.rating);
            if (value === "price-low") return priceA - priceB;
            if (value === "price-high") return priceB - priceA;
            if (value === "rating") return ratingB - ratingA;
            return 0;
        });
    }

    function renderPagination(total) {
        if (!pagination) return;
        pagination.innerHTML = "";
        const pageCount = Math.ceil(total / PAGE_SIZE);
        if (pageCount <= 1) return;

        const add = (label, page, disabled = false, active = false) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `page-button${active ? " active" : ""}`;
            button.textContent = label;
            button.disabled = disabled;
            button.addEventListener("click", () => {
                currentPage = page;
                renderPage();
                document.getElementById("staysGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
            pagination.appendChild(button);
        };

        add("‹", Math.max(1, currentPage - 1), currentPage === 1);
        for (let page = 1; page <= pageCount; page++) add(String(page), page, false, page === currentPage);
        add("›", Math.min(pageCount, currentPage + 1), currentPage === pageCount);
    }

    function renderPage() {
        const sorted = sortCards(filteredCards);
        const start = (currentPage - 1) * PAGE_SIZE;
        const pageCards = sorted.slice(start, start + PAGE_SIZE);
        const grid = document.getElementById("staysGrid");

        cards.forEach(card => {
            card.style.display = pageCards.includes(card) ? "" : "none";
            grid?.appendChild(card);
        });

        if (resultsCount) {
            resultsCount.textContent = `${filteredCards.length} ${filteredCards.length === 1 ? "property" : "properties"} found`;
        }
        if (resultsTitle) {
            const search = destinationSearch?.value.trim();
            resultsTitle.textContent = search ? `Stays matching "${search}"` : "All stays";
        }
        renderPagination(filteredCards.length);
        updateFavoriteButtons();
    }

    function applyFilters(resetPage = true) {
        const search = normalize(destinationSearch?.value);
        const selectedTypes = Array.from(document.querySelectorAll('input[name="propertyType"]:checked')).map(input => normalize(input.value));
        const selectedRating = document.querySelector('input[name="rating"]:checked');
        const selectedPrice = document.querySelector('input[name="price"]:checked');
        const minimumRating = selectedRating ? Number(selectedRating.value) : 0;
        const maximumPrice = selectedPrice ? Number(selectedPrice.value) : Infinity;

        filteredCards = cards.filter(card => {
            const name = normalize(card.dataset.name);
            const location = normalize(card.dataset.location);
            const type = normalize(card.dataset.type);
            const price = Number(card.dataset.price);
            const rating = Number(card.dataset.rating);
            return (!search || name.includes(search) || location.includes(search)) &&
                (!selectedTypes.length || selectedTypes.includes(type)) &&
                rating >= minimumRating && price <= maximumPrice;
        });

        if (resetPage) currentPage = 1;
        const pageCount = Math.max(1, Math.ceil(filteredCards.length / PAGE_SIZE));
        if (currentPage > pageCount) currentPage = pageCount;
        renderPage();
    }

    function performSearch() {
        const search = destinationSearch?.value.trim() || "";
        if (!search) {
            applyFilters();
            return;
        }
        const found = cards.some(card => normalize(card.dataset.name).includes(normalize(search)) || normalize(card.dataset.location).includes(normalize(search)));
        if (!found) {
            showMessage(`No stays or destinations found for "${search}".`);
            return;
        }
        applyFilters();
    }

    searchButton?.addEventListener("click", performSearch);
    destinationSearch?.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            performSearch();
        }
    });
    sortSelect?.addEventListener("change", () => renderPage());
    document.querySelectorAll('.filter-group input').forEach(input => input.addEventListener("change", () => applyFilters()));

    clearFilters?.addEventListener("click", () => {
        document.querySelectorAll('.filter-group input').forEach(input => input.checked = false);
        applyFilters();
    });

    // Only apply a search when this page was explicitly opened with a search URL.
    // Do NOT reuse the previous destination/search from localStorage here.
    // Otherwise a search can stay stuck when the user leaves Stays and later
    // comes back to the page.
    const params = new URLSearchParams(window.location.search);
    const initialSearch = params.get("search") || params.get("destination") || "";

    if (destinationSearch) {
        destinationSearch.value = initialSearch;
    }

    // If the page was opened normally (no search parameter), always start
    // with the complete stays collection.
    if (!initialSearch) {
        filteredCards = [...cards];
        currentPage = 1;
    }

    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterEmail = document.getElementById("newsletterEmail");
    newsletterForm?.addEventListener("submit", event => {
        event.preventDefault();
        if (newsletterEmail?.value.trim()) {
            localStorage.setItem("staynestNewsletterEmail", newsletterEmail.value.trim());
            newsletterForm.reset();
            showMessage("You're subscribed to StayNest updates!");
        }
    });

    applyFilters();
});
