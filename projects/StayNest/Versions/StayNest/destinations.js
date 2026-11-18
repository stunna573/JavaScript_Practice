// StayNest Destinations
// Guests and signed-in users can favorite destinations.

function stayNestFavoritesAllowed() {
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("destinationSearch");
    const regionFilter = document.getElementById("regionFilter");
    const sortSelect = document.getElementById("sortDestinations");
    const destinationGrid = document.getElementById("destinationGrid");
    const resultCount = document.getElementById("resultCount");
    const noResults = document.getElementById("noResults");
    const resetButton = document.getElementById("resetSearch");
    const pagination = document.getElementById("destinationPagination");
    const menuButton = document.querySelector(".menu-button");
    const mobileMenu = document.querySelector(".mobile-menu");
    const cards = Array.from(document.querySelectorAll(".destination-card"));
    const PAGE_SIZE = 6;
    let currentPage = 1;
    let filteredCards = [...cards];

    const normalize = value => String(value || "").trim().toLowerCase();

    function showToast(message) {
        let toast = document.querySelector(".toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.className = "toast";
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
    }

    function getDestinationFavorites() {
        try {
            const saved = JSON.parse(localStorage.getItem("staynestDestinationFavorites") || "[]");
            return Array.isArray(saved) ? saved : [];
        } catch {
            return [];
        }
    }

    function saveDestinationFavorites(list) {
        localStorage.setItem("staynestDestinationFavorites", JSON.stringify(list));
    }

    function updateFavoriteButtons() {
        const favorites = getDestinationFavorites();
        cards.forEach(card => {
            const button = card.querySelector(".favorite-button");
            if (!button) return;
            const name = card.dataset.name;
            const active = favorites.includes(name);
            button.textContent = active ? "♥" : "♡";
            button.classList.toggle("active", active);
            button.setAttribute("aria-label", active ? `Remove ${name} from favorites` : `Add ${name} to favorites`);
        });
    }

    cards.forEach(card => {
        const button = card.querySelector(".favorite-button");
        if (button) {
            button.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                const name = card.dataset.name;
                let favorites = getDestinationFavorites();
                if (favorites.includes(name)) {
                    favorites = favorites.filter(item => item !== name);
                    showToast(`${name} removed from favorites.`);
                } else {
                    favorites.push(name);
                    showToast(`${name} added to favorites.`);
                }
                saveDestinationFavorites(favorites);
                updateFavoriteButtons();
            });
        }

        const explore = card.querySelector(".explore-button");
        if (explore) {
            explore.addEventListener("click", () => {
                const destination = explore.dataset.destination || card.dataset.name;
                localStorage.setItem("staynestSelectedDestination", destination);
                window.location.href = `stays.html?destination=${encodeURIComponent(destination)}`;
            });
        }
    });

    function sortCards(list) {
        const value = sortSelect ? sortSelect.value : "popular";
        return [...list].sort((a, b) => {
            if (value === "properties-high") return Number(b.dataset.properties) - Number(a.dataset.properties);
            if (value === "properties-low") return Number(a.dataset.properties) - Number(b.dataset.properties);
            if (value === "name") return a.dataset.name.localeCompare(b.dataset.name);
            return Number(b.dataset.popularity) - Number(a.dataset.popularity);
        });
    }

    function renderPagination(total) {
        if (!pagination) return;
        pagination.innerHTML = "";
        const pageCount = Math.ceil(total / PAGE_SIZE);
        if (pageCount <= 1) return;

        const makeButton = (label, page, disabled = false, active = false) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `page-button${active ? " active" : ""}`;
            button.textContent = label;
            button.disabled = disabled;
            button.addEventListener("click", () => {
                currentPage = page;
                renderPage();
                destinationGrid.scrollIntoView({ behavior: "smooth", block: "start" });
            });
            pagination.appendChild(button);
        };

        makeButton("‹", Math.max(1, currentPage - 1), currentPage === 1);
        for (let page = 1; page <= pageCount; page++) makeButton(String(page), page, false, page === currentPage);
        makeButton("›", Math.min(pageCount, currentPage + 1), currentPage === pageCount);
    }

    function renderPage() {
        const sorted = sortCards(filteredCards);
        const start = (currentPage - 1) * PAGE_SIZE;
        const pageCards = sorted.slice(start, start + PAGE_SIZE);

        cards.forEach(card => {
            card.style.display = pageCards.includes(card) ? "" : "none";
            destinationGrid.appendChild(card);
        });

        if (resultCount) {
            resultCount.textContent = `${filteredCards.length} destination${filteredCards.length === 1 ? "" : "s"}`;
        }

        if (noResults) noResults.classList.toggle("show", filteredCards.length === 0);
        renderPagination(filteredCards.length);
        updateFavoriteButtons();
    }

    function applyFilters(resetPage = true) {
        const search = normalize(searchInput?.value);
        const region = regionFilter?.value || "all";

        filteredCards = cards.filter(card => {
            const name = normalize(card.dataset.name);
            const matchesSearch = !search || name.includes(search) || search.includes(name.split(",")[0]);
            const matchesRegion = region === "all" || card.dataset.region === region;
            return matchesSearch && matchesRegion;
        });

        if (resetPage) currentPage = 1;
        const pageCount = Math.max(1, Math.ceil(filteredCards.length / PAGE_SIZE));
        if (currentPage > pageCount) currentPage = pageCount;
        renderPage();
    }

    searchInput?.addEventListener("input", () => applyFilters());
    regionFilter?.addEventListener("change", () => applyFilters());
    sortSelect?.addEventListener("change", () => renderPage());

    resetButton?.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        if (regionFilter) regionFilter.value = "all";
        if (sortSelect) sortSelect.value = "popular";
        applyFilters();
    });

    menuButton?.addEventListener("click", () => mobileMenu?.classList.toggle("show"));

    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterEmail = document.getElementById("newsletterEmail");
    newsletterForm?.addEventListener("submit", event => {
        event.preventDefault();
        if (newsletterEmail?.value.trim()) {
            localStorage.setItem("staynestNewsletterEmail", newsletterEmail.value.trim());
            showToast("You're subscribed to StayNest updates!");
            newsletterForm.reset();
        }
    });

    const params = new URLSearchParams(window.location.search);
    const initialSearch = params.get("search") || params.get("destination");
    if (initialSearch && searchInput) searchInput.value = initialSearch;

    applyFilters();
});
