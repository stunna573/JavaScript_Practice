document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       CHECK LOGGED-IN USER
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

    const bookingsList =
        document.getElementById("bookingsList");

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

            menuButton.setAttribute(
                "aria-expanded",
                String(navLinks.classList.contains("show"))
            );
        });
    }

    /* =========================
       GET BOOKINGS
    ========================= */

    let allBookings = [];

    try {
        const saved =
            JSON.parse(
                localStorage.getItem("staynestBookings") || "[]"
            );

        allBookings = Array.isArray(saved) ? saved : [];
    } catch {
        allBookings = [];
    }

    const userEmail =
        String(currentUser.email || "")
            .trim()
            .toLowerCase();

    const userId =
        String(currentUser.id || "").trim();

    const userBookings =
        allBookings.filter(booking => {
            /*
                New logged-in bookings are tied to the
                account ID. Older bookings are matched
                by email for backward compatibility.
            */
            if (
                userId &&
                booking.userId
            ) {
                return String(booking.userId) === userId;
            }

            const bookingEmail =
                String(
                    booking.email ||
                    booking.guestEmail ||
                    ""
                )
                    .trim()
                    .toLowerCase();

            return bookingEmail === userEmail;
        });

    if (!bookingsList || !emptyState) {
        return;
    }

    /* =========================
       EMPTY STATE
    ========================= */

    if (userBookings.length === 0) {
        bookingsList.innerHTML = "";
        bookingsList.style.display = "none";
        emptyState.style.display = "block";
        return;
    }

    bookingsList.style.display = "grid";
    emptyState.style.display = "none";
    bookingsList.innerHTML = "";

    /* =========================
       DISPLAY BOOKINGS
    ========================= */

    userBookings
        .slice()
        .reverse()
        .forEach(booking => {

            const card =
                document.createElement("article");

            card.className = "booking-card";

            const image =
                document.createElement("img");

            image.className = "booking-image";
            image.src =
                booking.image || "./Assets/hero.jpeg";
            image.alt =
                booking.stay || "StayNest property";

            const content =
                document.createElement("div");

            content.className = "booking-content";

            const top =
                document.createElement("div");

            top.className = "booking-top";

            const property =
                document.createElement("div");

            const title =
                document.createElement("h3");

            title.textContent =
                booking.stay || "StayNest Property";

            const location =
                document.createElement("p");

            location.className =
                "booking-location";

            location.textContent =
                booking.location ||
                "Location unavailable";

            property.appendChild(title);
            property.appendChild(location);

            const status =
                document.createElement("span");

            status.className =
                "booking-status";

            status.textContent =
                "Confirmed";

            top.appendChild(property);
            top.appendChild(status);

            const info =
                document.createElement("div");

            info.className =
                "booking-info";

            info.appendChild(
                createInfoItem(
                    "Check-in",
                    formatDate(booking.checkIn)
                )
            );

            info.appendChild(
                createInfoItem(
                    "Check-out",
                    formatDate(booking.checkOut)
                )
            );

            info.appendChild(
                createInfoItem(
                    "Guests",
                    formatGuests(booking.guests)
                )
            );

            info.appendChild(
                createInfoItem(
                    "Rooms",
                    formatRooms(booking.rooms)
                )
            );

            const bottom =
                document.createElement("div");

            bottom.className =
                "booking-bottom";

            const bookingId =
                document.createElement("p");

            bookingId.className =
                "booking-id";

            bookingId.innerHTML =
                `Booking ID: <strong>${escapeHTML(
                    booking.id || "N/A"
                )}</strong>`;

            const total =
                document.createElement("strong");

            total.className =
                "total-price";

            total.textContent =
                formatCurrency(booking.total);

            const viewButton =
                document.createElement("a");

            viewButton.className =
                "view-booking";

            viewButton.href =
                `find-booking.html?id=${encodeURIComponent(
                    booking.id || ""
                )}`;

            viewButton.textContent =
                "View Booking";

            const priceAndButton =
                document.createElement("div");

            priceAndButton.style.display = "flex";
            priceAndButton.style.alignItems = "center";
            priceAndButton.style.gap = "18px";

            priceAndButton.appendChild(total);
            priceAndButton.appendChild(viewButton);

            bottom.appendChild(bookingId);
            bottom.appendChild(priceAndButton);

            content.appendChild(top);
            content.appendChild(info);
            content.appendChild(bottom);

            card.appendChild(image);
            card.appendChild(content);

            bookingsList.appendChild(card);
        });

    function createInfoItem(label, value) {
        const item =
            document.createElement("div");

        item.className =
            "info-item";

        const labelElement =
            document.createElement("span");

        labelElement.textContent =
            label;

        const valueElement =
            document.createElement("strong");

        valueElement.textContent =
            value;

        item.appendChild(labelElement);
        item.appendChild(valueElement);

        return item;
    }

    function formatDate(dateString) {
        if (!dateString) return "—";

        const date =
            new Date(`${dateString}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    }

    function formatGuests(value) {
        if (!value) return "—";

        const number = Number(value);

        if (!Number.isFinite(number)) {
            return String(value);
        }

        return `${number} ${
            number === 1 ? "Guest" : "Guests"
        }`;
    }

    function formatRooms(value) {
        const number = Number(value || 1);

        if (!Number.isFinite(number) || number < 1) {
            return "1 Room";
        }

        return `${number} ${
            number === 1 ? "Room" : "Rooms"
        }`;
    }

    function formatCurrency(amount) {
        const number = Number(amount);

        if (!Number.isFinite(number)) {
            return "$0";
        }

        return `$${number.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        })}`;
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
