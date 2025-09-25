// 🔑 Decrypt base64-encoded JSON (info.txt)
function decodeBase64(base64) {
  try {
    return atob(base64);
  } catch (err) {
    Swal.fire("Error", "Failed to decode file info.", "error");
    return null;
  }
}

async function loadInfo() {
  try {
    // Example: replace with your GitHub Pages raw file URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (!id) {
      Swal.fire("Error", "No ID provided in URL", "error");
      return;
    }

    const infoUrl = `https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPO/branch/repo/${id}/info.txt`;

    const res = await fetch(infoUrl);
    if (!res.ok) throw new Error("Info not found");
    const base64 = await res.text();

    const jsonStr = decodeBase64(base64.trim());
    const data = JSON.parse(jsonStr);

    document.getElementById("title").textContent = data.title;
    document.getElementById("description").textContent = data.description;

    const playerContainer = document.getElementById("player-container");

    if (data.mime_type.startsWith("video")) {
      const video = document.createElement("video");
      video.src = data.download_url;
      video.controls = true;
      video.poster = data.thumb_url;
      playerContainer.appendChild(video);
    } else if (data.mime_type.startsWith("audio")) {
      const audio = document.createElement("audio");
      audio.src = data.download_url;
      audio.controls = true;
      playerContainer.appendChild(audio);
    } else if (data.mime_type.startsWith("image")) {
      const img = document.createElement("img");
      img.src = data.download_url;
      playerContainer.appendChild(img);
    } else {
      const link = document.createElement("a");
      link.href = data.download_url;
      link.textContent = "Download File";
      link.className = "download-link";
      playerContainer.appendChild(link);
    }
  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
}

document.addEventListener("DOMContentLoaded", loadInfo);
