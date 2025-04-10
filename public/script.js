// === Helper Functions ===
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// === UI Functions ===
function showMessage(message, type) {
  const statusMessage = document.getElementById("statusMessage");
  statusMessage.textContent = message;
  statusMessage.classList.add(type);
  statusMessage.style.display = "block";
}

function resetButton() {
  const btnText = document.getElementById("btnText");
  const spinner = document.getElementById("spinner");
  const accessBtn = document.getElementById("accessBtn");

  btnText.style.display = "block";
  spinner.style.display = "none";
  accessBtn.disabled = false;
}

// === Main Function ===
function checkAccess() {
  const correctPassword = "1234";
  const password = document.getElementById("password").value.trim();
  const btnText = document.getElementById("btnText");
  const spinner = document.getElementById("spinner");
  const statusMessage = document.getElementById("statusMessage");
  const accessBtn = document.getElementById("accessBtn");

  statusMessage.style.display = "none";
  statusMessage.className = "status-message";

  btnText.style.display = "none";
  spinner.style.display = "block";
  accessBtn.disabled = true;

  if (password !== correctPassword) {
    setTimeout(() => {
      showMessage("Incorrect password. Please try again.", "error");
      resetButton();
    }, 800);
    return;
  }

  showMessage("Password verified. Getting your location...", "success");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;

      const allowedLat = 28.449795421689224; // your location
      const allowedLon = 77.28346790184364;
      const maxDistanceInKm = 1.0;

      const distance = getDistanceFromLatLonInKm(userLat, userLon, allowedLat, allowedLon);

      setTimeout(() => {
        if (distance <= maxDistanceInKm) {
          showMessage("Access granted! Redirecting...", "success");
          setTimeout(() => {
            window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSf32P5zqx8g1SfnvVx60GuCwcvVmmM7maan1TpUYCb_XM2vxA/viewform?usp=header";
          }, 1000);
        } else {
          showMessage("Access denied: You are outside the allowed 1km range.", "error");
          resetButton();
        }
      }, 1000);
    },
    () => {
      showMessage("Location access denied. Cannot verify your location.", "error");
      resetButton();
    }
  );
}

// === Enable Enter Key ===
document.getElementById("password").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    checkAccess();
  }
});
