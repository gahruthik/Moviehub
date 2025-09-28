let selectedRating = 0;

// Handle star clicks
document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll(".star");

    stars.forEach(star => {
        star.addEventListener("click", () => {
            selectedRating = Number(star.getAttribute("data-value"));

            // Update star colors
            stars.forEach(s => {
                s.classList.toggle(
                    "selected",
                    Number(s.getAttribute("data-value")) <= selectedRating
                );
            });
        });
    });

    // Load saved reviews from localStorage (unique key for War 2)
    const savedReviews = JSON.parse(localStorage.getItem("war2Reviews")) || [];
    savedReviews.forEach(r => appendReview(r.username, r.text, Number(r.rating)));

    // Update average rating above the image
    updateAverageRating();
});

// Add review function
function addReview() {
    const username = document.getElementById("username").value.trim();
    const review = document.getElementById("reviewText").value.trim();

    if (!username || !review || selectedRating === 0) {
        alert("Please enter your name, review, and select a star rating.");
        return;
    }

    appendReview(username, review, selectedRating);

    // Save review in localStorage using unique key
    const savedReviews = JSON.parse(localStorage.getItem("war2Reviews")) || [];
    savedReviews.push({ username, text: review, rating: selectedRating });
    localStorage.setItem("war2Reviews", JSON.stringify(savedReviews));

    // Reset form
    document.getElementById("username").value = "";
    document.getElementById("reviewText").value = "";
    selectedRating = 0;
    document.querySelectorAll(".star").forEach(s => s.classList.remove("selected"));

    // Update average rating
    updateAverageRating();
}

// Append a single review
function appendReview(username, review, rating) {
    rating = Number(rating);
    const reviewDiv = document.createElement("div");
    reviewDiv.classList.add("review-box");

    let starsHTML = "";
    for (let i = 1; i <= 5; i++) {
        starsHTML += `<span class="star-display ${i <= rating ? 'filled' : ''}">★</span>`;
    }

    reviewDiv.innerHTML = `<strong>${username}</strong> ${starsHTML}<p>${review}</p>`;
    document.getElementById("war2ReviewsList").appendChild(reviewDiv);
}

// Calculate and display average rating above the image
function updateAverageRating() {
    const savedReviews = JSON.parse(localStorage.getItem("war2Reviews")) || [];
    const avgContainer = document.getElementById("averageRating");

    if (savedReviews.length === 0) {
        avgContainer.innerHTML = "★★★★★ (No ratings yet)";
        return;
    }

    const ratings = savedReviews
        .map(r => Number(r.rating))
        .filter(r => !isNaN(r) && r > 0);

    if (ratings.length === 0) {
        avgContainer.innerHTML = "★★★★★ (No valid ratings)";
        return;
    }

    const total = ratings.reduce((sum, r) => sum + r, 0);
    const avg = total / ratings.length;
    const roundedAvg = Math.round(avg);

    let starsHTML = "";
    for (let i = 1; i <= 5; i++) {
        starsHTML += `<span class="star-display ${i <= roundedAvg ? 'filled' : ''}">★</span>`;
    }

    avgContainer.innerHTML = `${starsHTML} (${avg.toFixed(1)})`;
}
