
const brhomebtn = document.querySelector('.brhome-button'); // Assuming you have a home button

// Add an event listener for the home button and navigate to second.html
brhomebtn.addEventListener('click', () => {
  // reload or navigate to the current page (second.html)
  window.location.href = "HomePage.html";
  searchInput.value = "";
});


