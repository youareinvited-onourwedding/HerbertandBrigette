
// WEDDING WELCOME POPUP

document.addEventListener("DOMContentLoaded", function () {

  const welcomeOverlay = document.getElementById("welcomeOverlay");
  const enterWebsite = document.getElementById("enterWebsite");

  if (!welcomeOverlay || !enterWebsite) return;

  // Prevent scrolling behind the welcome popup
  document.body.style.overflow = "hidden";

  enterWebsite.addEventListener("click", function () {

    welcomeOverlay.classList.add("is-hidden");

    document.body.style.overflow = "";

  });

});



/* ==========================================
   BACKGROUND IMAGE SLIDER
========================================== */
const slides = document.querySelectorAll(".slide");
const indicators = document.querySelectorAll(".indicator");

let currentSlide = 0;

function changeSlide(){

    slides[currentSlide].classList.remove("active");
    indicators[currentSlide].classList.remove("active");

    currentSlide++;

    if(currentSlide >= slides.length){
        currentSlide = 0;
    }

    slides[currentSlide].classList.add("active");
    indicators[currentSlide].classList.add("active");

}

setInterval(changeSlide, 5000);


/* ==========================================
   ELEMENTS
========================================== */

const menuToggle = document.getElementById("menu-toggle");
const menuWrapper = document.querySelector(".menu-wrapper");
const contentPanel = document.querySelector(".content");

const menuLinks = document.querySelectorAll(".menu a");
const heroButton = document.querySelector(".hero-btn");


/* ==========================================
   SMOOTH SCROLL FUNCTION
========================================== */

function scrollToSection(targetID) {

    const target = document.querySelector(targetID);

    if (!target) return;

    // Desktop
    if (window.innerWidth > 992) {

        contentPanel.scrollTo({

            top: target.offsetTop,
            behavior: "smooth"

        });

    }

    // Tablet & Mobile
    else {

        target.scrollIntoView({

            behavior: "smooth"

        });

    }

}


/* ==========================================
   MENU LINKS
========================================== */

menuLinks.forEach(link => {

    link.addEventListener("click", function(e) {

        e.preventDefault();

        const targetID = this.getAttribute("href");

        scrollToSection(targetID);

        // Close menu automatically
        menuToggle.checked = false;

    });

});


/* ==========================================
   RSVP BUTTON
========================================== */

if (heroButton) {

    heroButton.addEventListener("click", function(e) {

        e.preventDefault();

        scrollToSection("#rsvp");

    });

}


/* ==========================================
   CLOSE MENU WHEN CLICKING OUTSIDE
========================================== */

document.addEventListener("click", function(e) {

    if (!menuWrapper.contains(e.target)) {

        menuToggle.checked = false;

    }

});


/* ==========================================
   CLOSE MENU WHEN WINDOW RESIZES
========================================== */

window.addEventListener("resize", function() {

    menuToggle.checked = false;

});


/* ==========================================
   WEDDING GALLERY LIGHTBOX
========================================== */

const galleryImages = document.querySelectorAll(".gallery-item img");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.querySelector(".lightbox-image");

const closeBtn = document.querySelector(".close-lightbox");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

const currentImage = document.getElementById("current-image");
const totalImages = document.getElementById("total-images");

let currentIndex = 0;

/* Total Images */

totalImages.textContent = galleryImages.length;

/* Open Lightbox */

galleryImages.forEach((image, index) => {

    image.addEventListener("click", () => {

        currentIndex = index;

        showImage();

        lightbox.classList.add("active");

        document.body.style.overflow = "hidden";

    });

});

/* Display Image */

function showImage(){

    lightboxImage.src = galleryImages[currentIndex].src;

    currentImage.textContent = currentIndex + 1;

}

/* Next Image */

nextBtn.addEventListener("click", () => {

    currentIndex++;

    if(currentIndex >= galleryImages.length){

        currentIndex = 0;

    }

    showImage();

});

/* Previous Image */

prevBtn.addEventListener("click", () => {

    currentIndex--;

    if(currentIndex < 0){

        currentIndex = galleryImages.length - 1;

    }

    showImage();

});

/* Close */

function closeLightbox(){

    lightbox.classList.remove("active");

    document.body.style.overflow = "auto";

}

closeBtn.addEventListener("click", closeLightbox);

/* Close when clicking outside image */

lightbox.addEventListener("click", (e)=>{

    if(e.target === lightbox){

        closeLightbox();

    }

});

/* ESC Key */

document.addEventListener("keydown",(e)=>{

    if(!lightbox.classList.contains("active")) return;

    if(e.key === "Escape"){

        closeLightbox();

    }

    if(e.key === "ArrowRight"){

        nextBtn.click();

    }

    if(e.key === "ArrowLeft"){

        prevBtn.click();

    }

});


/* ==========================================
   MOBILE SWIPE SUPPORT
========================================== */

let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener("touchstart",(e)=>{

    touchStartX = e.changedTouches[0].screenX;

});

lightbox.addEventListener("touchend",(e)=>{

    touchEndX = e.changedTouches[0].screenX;

    handleSwipe();

});

function handleSwipe(){

    if(touchEndX < touchStartX - 50){

        nextBtn.click();

    }

    if(touchEndX > touchStartX + 50){

        prevBtn.click();

    }

}


/* ==========================================
            RSVP CONFIGURATION
========================================== */


// Replace with your Google Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyL3VJr4LSyKZTSxF740WfRw1v5MggZZjOPfQw6pXn1JqOeUx6_Zcy8cKL68DhyXf3Y/exec";

let maxAllowedSeats = 0;
let companionsList = [];
let pendingReset = false; // Flag to check if form should reset when modal closes
let popupTimer = null;    // Stores the 3-second auto-close timer

// Functions to control Notification Popup Modal with 3-second auto-dismiss
function showPopup(message, icon = "&#8505;", triggerReset = false) {
  pendingReset = triggerReset;
  
  // Clear any existing timer so timers don't overlap
  if (popupTimer) clearTimeout(popupTimer);

  document.getElementById("notificationIcon").innerHTML = icon;
  document.getElementById("notificationMessage").innerText = message;
  document.getElementById("notificationModal").style.display = "flex";

  // Automatically close after 3 seconds (3000 milliseconds)
  popupTimer = setTimeout(() => {
    closeNotificationModal();
  }, 3000);
}

function closeNotificationModal() {
  document.getElementById("notificationModal").style.display = "none";
  
  // If the message was a final confirmation, reset the form when popup disappears
  if (pendingReset) {
    pendingReset = false;
    resetFormAndReturn();
  }
}

// Reset form fields and bring back main RSVP form
function resetFormAndReturn() {
  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("companionInput").value = "";
  
  companionsList = [];
  maxAllowedSeats = 0;
  renderTags();
  
  document.getElementById("companionSubform").style.display = "none";
  document.getElementById("mainFormContainer").style.display = "block";
}

// Handles "Yes, I am coming" click
async function handleYesClick() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();

  if (!firstName || !lastName) {
    showPopup("Please enter both your first name and last name.", "&#9888;");
    return;
  }

  showPopup("Checking guest list...", "&#8987;");

  try {
    const response = await fetch(`${SCRIPT_URL}?action=checkGuest&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`);
    const data = await response.json();

    if (data.status === "already_submitted") {
      showPopup(data.message, "&#8505;");
      return;
    }

    if (data.status === "not_listed") {
      showPopup(data.message, "&#10071;");
      return;
    }

    // Close loading popup immediately
    document.getElementById("notificationModal").style.display = "none";
    if (popupTimer) clearTimeout(popupTimer);

    maxAllowedSeats = Number(data.reservedSeats) || 0;

    if (maxAllowedSeats > 0) {
      document.getElementById("mainFormContainer").style.display = "none";
      document.getElementById("companionSubform").style.display = "block";
      updateSeatsDisplay();
    } else {
      submitRSVP("Yes", []);
    }
  } catch (error) {
    console.error("Error checking guest status:", error);
    showPopup("There was an error verifying your name. Please try again.", "&#10071;");
  }
}

function addCompanion() {
  const input = document.getElementById("companionInput");
  const name = input.value.trim();

  if (!name) return;

  if (companionsList.length >= maxAllowedSeats) {
    showPopup(`You can only reserve up to ${maxAllowedSeats} seat(s).`, "&#8505;");
    return;
  }

  companionsList.push(name);
  input.value = "";
  renderTags();
  updateSeatsDisplay();
}

function removeCompanion(index) {
  companionsList.splice(index, 1);
  renderTags();
  updateSeatsDisplay();
}

function renderTags() {
  const container = document.getElementById("companionTagsContainer");
  container.innerHTML = companionsList
    .map(
      (name, i) => `
    <div class="tag-pill">
      <span>${name}</span>
      <span class="tag-remove" onclick="removeCompanion(${i})">&#10005;</span>
    </div>
  `
    )
    .join("");
}

function updateSeatsDisplay() {
  const remaining = maxAllowedSeats - companionsList.length;
  document.getElementById("availableSeatsCount").innerText = remaining;
}

function submitRSVPWithCompanions() {
  submitRSVP("Yes", companionsList);
}

async function submitRSVP(status, companions = []) {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();

  if (!firstName || !lastName) {
    showPopup("Please enter both your first name and last name.", "&#9888;");
    return;
  }

  showPopup("Submitting your response...", "&#8987;");

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        firstName,
        lastName,
        status,
        companions: companions.join(", ")
      })
    });

    const result = await response.json();

    if (result.status === "already_submitted") {
      showPopup(result.message, "&#8505;");
    } else if (result.status === "not_listed") {
      showPopup(result.message, "&#10071;");
    } else if (result.status === "success") {
      
      // Popup confirmation message (passes true so form resets automatically after 3s)
      if (status === "Yes") {
        showPopup(`Thank you, ${firstName}! We look forward to celebrating with you!`, "&#127881;", true);
      } else {
        showPopup("we are sad to hear that but we completely understand. See you soon!", "&#128075;", true);
      }

    } else {
      showPopup("There was an error saving your response. Please try again.", "&#10071;");
    }
  } catch (error) {
    console.error("Error submitting RSVP:", error);
    showPopup("There was an error saving your response. Please try again.", "&#10071;");
  }
}

async function openGuestListModal() {
  const modal = document.getElementById("guestModal");
  const listContainer = document.getElementById("guestNamesList");

  modal.style.display = "flex";
  listContainer.innerHTML = "<li>Loading...</li>";

  try {
    const response = await fetch(`${SCRIPT_URL}?action=getGuests`);
    const data = await response.json();

    if (data.status === "success" && data.guests.length > 0) {
      listContainer.innerHTML = data.guests.map(name => `<li>${name}</li>`).join("");
    } else {
      listContainer.innerHTML = "<li>No guests found.</li>";
    }
  } catch (error) {
    console.error("Error fetching guest list:", error);
    listContainer.innerHTML = "<li>Unable to load guest list.</li>";
  }
}

function closeGuestListModal() {
  document.getElementById("guestModal").style.display = "none";
}
