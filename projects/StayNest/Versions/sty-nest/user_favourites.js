document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       CHECK LOGIN
    ========================= */

    const currentUser = JSON.parse(
        localStorage.getItem("staynestCurrentUser") || "null"
    );

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }


    /* =========================
       ELEMENTS
    ========================= */

    const favoritesGrid =
        document.getElementById("favoritesGrid");

    const emptyState =
        document.getElementById("emptyState");

    const menuButton =
        document.getElementById("menuButton");

    const navLinks =
        document.querySelector(".nav-links");


    /* =========================
       MOBILE MENU
    ========================= */

    if (menuButton && navLinks) {

        menuButton.addEventListener("click", () => {
            navLinks.classList.toggle("show");
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


    /* =========================
       GET FAVORITES
    ========================= */

    let favorites = JSON.parse(
        localStorage.getItem("staynestFavorites") || "[]"
    );


    /*
        Make sure favorites is an array.
    */

    if (!Array.isArray(favorites)) {
        favorites = [];
    }


    /* =========================
       DISPLAY FAVORITES
    ========================= */

    renderFavorites();


    function renderFavorites() {

        favoritesGrid.innerHTML = "";


        /*
            Match saved favorite names
            with our stay data.
        */

        const favoriteStays = stays.filter(stay =>
            favorites.includes(stay.name)
        );


        /* EMPTY */

        if (favoriteStays.length === 0) {

            favoritesGrid.style.display = "none";

            emptyState.style.display = "block";

            return;
        }


        /* SHOW FAVORITES */

        favoritesGrid.style.display = "grid";

        emptyState.style.display = "none";


        favoriteStays.forEach(stay => {

            const card =
                document.createElement("article");

            card.className = "favorite-card";


            /* IMAGE */

            const imageWrapper =
                document.createElement("div");

            imageWrapper.className =
                "favorite-image-wrapper";


            const image =
                document.createElement("img");

            image.className = "favorite-image";

            image.src = stay.image;

            image.alt = stay.name;


            /* REMOVE BUTTON */

            const removeButton =
                document.createElement("button");

            removeButton.className =
                "remove-favorite";

            removeButton.type = "button";

            removeButton.setAttribute(
                "aria-label",
                `Remove ${stay.name} from favorites`
            );

            removeButton.textContent = "♥";


            removeButton.addEventListener("click", () => {

                favorites =
                    favorites.filter(
                        item => item !== stay.name
                    );

                localStorage.setItem(
                    "staynestFavorites",
                    JSON.stringify(favorites)
                );

                renderFavorites();

            });


            imageWrapper.appendChild(image);

            imageWrapper.appendChild(removeButton);


            /* CONTENT */

            const content =
                document.createElement("div");

            content.className =
                "favorite-content";


            const title =
                document.createElement("h3");

            title.textContent = stay.name;


            const location =
                document.createElement("p");

            location.className =
                "favorite-location";

            location.textContent =
                stay.location;


            /* DETAILS */

            const details =
                document.createElement("div");

            details.className =
                "favorite-details";


            const rating =
                document.createElement("div");

            rating.className = "rating";

            rating.innerHTML =
                `<span>★</span> ${stay.rating} (${stay.reviews.toLocaleString()})`;


            const price =
                document.createElement("div");

            price.className = "price";

            price.innerHTML =
                `$${stay.price.toLocaleString()} <small>/ night</small>`;


            details.appendChild(rating);

            details.appendChild(price);


            /* VIEW STAY */

            const viewButton =
                document.createElement("a");

            viewButton.className =
                "view-stay";

            viewButton.href =
                `stay-details.html?stay=${encodeURIComponent(stay.name)}`;

            viewButton.textContent =
                "View Stay";


            content.appendChild(title);

            content.appendChild(location);

            content.appendChild(details);

            content.appendChild(viewButton);


            card.appendChild(imageWrapper);

            card.appendChild(content);


            favoritesGrid.appendChild(card);

        });

    }

});