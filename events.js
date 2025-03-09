let map;
let markers = [];
let savedReviews = [];

function initMap() {
  const mapOptions = {
    center: { lat: 51.5055, lng: 0.0754 }, // the default location to be London Bridge
    zoom: 13,
  };

  // creating the map
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  // creating the serch box
  const searchBox = new google.maps.places.SearchBox(document.getElementById("searchBox"));
  // can search results
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });
  // what it does when someone searches
  searchBox.addListener("places_changed", () => {
    handleSearchResults(searchBox);
  });
  // allow using enter
  document.getElementById("searchBox").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearchResults(searchBox);
    }
  });
  // Loading any saved reviews
  loadSavedReviews();
}

// handling search results and place markers
function handleSearchResults(searchBox) {
  const places = searchBox.getPlaces();
  if (!places || places.length === 0) return;

  // clearning any existing markers
  markers.forEach(marker => marker.setMap(null));
  markers = [];
  const bounds = new google.maps.LatLngBounds();
  places.forEach(place => {
    if (!place.geometry) return;
    // allow you to create a marker
    const marker = new google.maps.Marker({
      map,
      title: place.name,
      position: place.geometry.location,
    });

    markers.push(marker);
    bounds.extend(place.geometry.location);

    // adding selected place to the review list
    addReview(place);
  });

  // adjusting the map
  map.fitBounds(bounds);
}

// adding a review to the sidebar
function addReview(place) {
  const reviewContainer = document.getElementById("review-list");
  // cehecking if the place is already reviewed
  if (savedReviews.some(review => review.name === place.name)) return;
  // making review entry
  const reviewElement = document.createElement("div");
  reviewElement.classList.add("review-item");
  reviewElement.innerHTML = `
    <h3>${place.name}</h3>
    <p>Location: ${place.formatted_address || "Unknown address"}</p>
    <textarea id="review-${place.name}" placeholder="Leave a review..."></textarea>
    <button onclick="saveReview('${place.name}')">Submit Review</button>
  `;
  // Append review to the list
  reviewContainer.appendChild(reviewElement);
  savedReviews.push({ name: place.name, address: place.formatted_address, review: "" });
  localStorage.setItem("reviews", JSON.stringify(savedReviews));
}

// save a review
function saveReview(placeName) {
  const reviewText = document.getElementById(`review-${placeName}`).value;
  if (!reviewText.trim()) {
    alert("Please enter a review before submitting.");
    return;
  }
  // saving review to localStorage
  const reviewIndex = savedReviews.findIndex(review => review.name === placeName);
  if (reviewIndex !== -1) {
    savedReviews[reviewIndex].review = reviewText;
    localStorage.setItem("reviews", JSON.stringify(savedReviews));
    alert(`Review for ${placeName} saved!`);
  }
}

// loading saved reviews from localStorage
function loadSavedReviews() {
  const reviewContainer = document.getElementById("review-list");
  const storedReviews = JSON.parse(localStorage.getItem("reviews")) || [];

  storedReviews.forEach(place => {
    const reviewElement = document.createElement("div");
    reviewElement.classList.add("review-item");
    reviewElement.innerHTML = `
      <h3>${place.name}</h3>
      <p>Location: ${place.address || "Unknown address"}</p>
      <textarea id="review-${place.name}" placeholder="Leave a review...">${place.review || ""}</textarea>
      <button onclick="saveReview('${place.name}')">Submit Review</button>
    `;
    reviewContainer.appendChild(reviewElement);
  });
  savedReviews = storedReviews;
}
// function to see the friends responses
function addFriendResponse() {
    let commentBox = document.getElementById("friend-comment");
    let responseText = commentBox.value.trim();
    
    if (responseText === "") {
        alert("Please write a response before submitting!");
        return;
    }
    let responsesContainer = document.getElementById("responses");
    let newResponse = document.createElement("p");
    newResponse.innerHTML = `<strong>You:</strong> ${responseText}`;
    responsesContainer.appendChild(newResponse);
    // making sure to clear the input box after submitting
    commentBox.value = "";
}

// displaying the user's actual email
document.addEventListener("DOMContentLoaded", function () {
    let userEmail = localStorage.getItem("loggedInUserEmail") || "Logged in as: guest@example.com";
    document.getElementById("userEmail").textContent = userEmail;
});



