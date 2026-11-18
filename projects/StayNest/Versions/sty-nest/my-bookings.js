document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       CHECK LOGGED-IN USER
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

    const bookingsList = document.getElementById("bookingsList");
    const emptyState = document.getElementById("emptyState");

    const menuButton = document.getElementById("menuButton");
    const navLinks = document.querySelector(".nav-links");


    /* =========================
       MOBILE MENU
    ========================= */

    if (menuButton && navLinks) {

        menuButton.addEventListener("click", () => {
            navLinks.classList.toggle("show");
        });

    }


    /* =========================
       GET BOOKINGS
    ========================= */

    const allBookings = JSON.parse(
        localStorage.getItem("staynestBookings") || "[]"
    );


    /*
        Only show bookings belonging
        to the currently logged-in user.
    */

    const userEmail = (currentUser.email || "").trim().toLowerCase();

    const userBookings = allBookings.filter(booking => {

        const bookingEmail = (booking.email || "")
            .trim()
            .toLowerCase();

        return bookingEmail === userEmail;

    });


    /* =========================
       EMPTY STATE
    ========================= */

    if (userBookings.length === 0) {

        bookingsList.style.display = "none";
        emptyState.style.display = "block";

        return;
    }


    /* =========================
       DISPLAY BOOKINGS
    ========================= */

    bookingsList.innerHTML = "";


    userBookings
        .slice()
        .reverse()
        .forEach(booking => {

            const card = document.createElement("article");

            card.className = "booking-card";


            /* IMAGE */

            const image = document.createElement("img");

            image.className = "booking-image";

            image.src = booking.image || "./Assets/hero.jpeg";

            image.alt = booking.stay || "StayNest property";


            /* CONTENT */

            const content = document.createElement("div");

            content.className = "booking-content";


            /* TOP */

            const top = document.createElement("div");

            top.className = "booking-top";


            const property = document.createElement("div");

            const title = document.createElement("h3");

            title.textContent = booking.stay || "StayNest Property";


            const location = document.createElement("p");

            location.className = "booking-location";

            location.textContent = booking.location || "Location unavailable";


            property.appendChild(title);

            property.appendChild(location);


            const status = document.createElement("span");

            status.className = "booking-status";

            status.textContent = "Confirmed";


            top.appendChild(property);

            top.appendChild(status);


            /* INFO */

            const info = document.createElement("div");

            info.className = "booking-info";


            const checkIn = createInfoItem(
                "Check-in",
                formatDate(booking.checkIn)
            );

            const checkOut = createInfoItem(
                "Check-out",
                formatDate(booking.checkOut)
            );

            const guests = createInfoItem(
                "Guests",
                formatGuests(booking.guests)
            );

            const rooms = createInfoItem(
                "Rooms",
                `${booking.rooms || 1} ${(booking.rooms || 1) === 1 ? "Room" : "Rooms"}`
            );


            info.appendChild(checkIn);
            info.appendChild(checkOut);
            info.appendChild(guests);
            info.appendChild(rooms);


            /* BOTTOM */

            const bottom = document.createElement("div");

            bottom.className = "booking-bottom";


            const bookingId = document.createElement("p");

            bookingId.className = "booking-id";

            bookingId.innerHTML =
                `Booking ID: <strong>${escapeHTML(booking.id || "N/A")}</strong>`;


            const total = document.createElement("strong");

            total.className = "total-price";

            total.textContent = formatCurrency(booking.total);


            const viewButton = document.createElement("a");

            viewButton.className = "view-booking";

            viewButton.href =
                `find-booking.html?id=${encodeURIComponent(booking.id || "")}`;

            viewButton.textContent = "View Booking";


            const priceAndButton = document.createElement("div");

            priceAndButton.style.display = "flex";
            priceAndButton.style.alignItems = "center";
            priceAndButton.style.gap = "18px";

            priceAndButton.appendChild(total);
            priceAndButton.appendChild(viewButton);


            bottom.appendChild(bookingId);
            bottom.appendChild(priceAndButton);


            /* BUILD CARD */

            content.appendChild(top);
            content.appendChild(info);
            content.appendChild(bottom);

            card.appendChild(image);
            card.appendChild(content);

            bookingsList.appendChild(card);

        });


    /* =========================
       HELPER FUNCTIONS
    ========================= */

    function createInfoItem(label, value) {

        const item = document.createElement("div");

        item.className = "info-item";


        const labelElement = document.createElement("span");

        labelElement.textContent = label;


        const valueElement = document.createElement("strong");

        valueElement.textContent = value;


        item.appendChild(labelElement);
        item.appendChild(valueElement);


        return item;
    }


    function formatDate(dateString) {

        if (!dateString) {
            return "—";
        }

        const date = new Date(`${dateString}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    }


    function formatGuests(guests) {

        if (!guests) {
            return "—";
        }

        const number = Number(guests);

        if (Number.isNaN(number)) {
            return guests;
        }

        return `${number} ${number === 1 ? "Guest" : "Guests"}`;
    }


    function formatCurrency(amount) {

        const number = Number(amount);

        if (Number.isNaN(number)) {
            return "$0";
        }

        return `$${number.toLocaleString("en-US")}`;
    }


    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

});
