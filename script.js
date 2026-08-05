// Select the mobile menu button and navigation.
const menuButton = document.querySelector("#menuButton");
const menu = document.querySelector("#menu");

// Open or close the menu when the button is clicked.
menuButton.addEventListener("click", function () {
  menu.classList.toggle("show");
});

// Select the back-to-top button.
const topButton = document.querySelector("#topButton");

// Show the button after the user scrolls down.
window.addEventListener("scroll", function () {
  if (window.scrollY > 400) {
    topButton.style.display = "block";
  } else {
    topButton.style.display = "none";
  }
});

// Return to the top of the page.
topButton.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
