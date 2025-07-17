function getTimeString(time) {
  const years = parseInt(time / 31536000);
  let remainingSeconds = time % 31536000;
  const days = parseInt(remainingSeconds / 86400);
  remainingSeconds = remainingSeconds % 86400;
  const hours = parseInt(remainingSeconds / 3600);
  remainingSeconds = remainingSeconds % 3600;
  const minutes = parseInt(remainingSeconds / 60);
  remainingSeconds = remainingSeconds % 60;
  if (years > 0) {
    return `${years}y ${days}d ${hours}h ${minutes}m ${remainingSeconds}s ago`;
  }else if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s ago`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s ago`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s ago`;
  } else {
    return `${remainingSeconds}s ago`;
  }
}


// 1 - fetch, load and show Categories on html
// Remove active class from all buttons
const removeActiveClass = () => {
  const buttons = document.querySelectorAll(".category-btn");
  // buttons.forEach((button) => {
  //   button.classList.remove("active");
  // });
  for(let btn of buttons) {
    btn.classList.remove("active");
  }
}
// Load videos for a specific category
const loadCategoryVideos = (id) => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      // clear previous active button
      removeActiveClass();
      const activeBtn = document.getElementById(`btn-${id}`);
      activeBtn.classList.add("active");
      showVideos(data.category);
    })
    .catch((error) => console.error("ERROR:", error));
};
// Create loadCategories
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => showCategories(data.categories))
    .catch((error) => console.error("Error fetching categories:", error));
};
const loadVideos = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/videos")
    .then((res) => res.json())
    .then((data) => showVideos(data.videos))
    .catch((error) => console.error("Error fetching videos:", error));
};
// Create showCategories
const showCategories = (data) => {
  const categoryContainer = document.getElementById("categories");
  data.forEach((item) => {
    //Create a button
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `<button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class="category-btn btn bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded">${item.category}</button>`;
    categoryContainer.appendChild(buttonContainer);
  });
};
// Call the function to load categories
loadCategories();
// Create showVideos
const showVideos = (videos) => {
  const videoContainer = document.getElementById("videos");
    videoContainer.innerHTML = ""; // Clear previous videos
    if (videos.length === 0) {
        videoContainer.classList.remove("grid");
        videoContainer.innerHTML = `
        <div class="flex justify-center mb-[10px]"><img src="assets/Icon.png" alt="Placeholder image"></div>
        <p class="text-center font-bold">No videos found.</p>`;
    }else {
        videoContainer.classList.add("grid");
    }
  videos.forEach((video) => {
    // Create a video cardF
    const videoCard = document.createElement("div");
    videoCard.classList.add("bg-white", "card", "card-compact");
    videoCard.innerHTML = `
        <figure class="h-[200px] relative">
            <img
            src="${video.thumbnail}"
            alt="Thumbnail for ${video.title}"  class="w-full object-cover"/>
            ${video.others.views ? `<span class="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">${video.others.views} views</span>` : ""}
            ${
                video.others.posted_date ? `<span class="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">${getTimeString(video.others.posted_date)}</span>` : ""
            }
            
        </figure>
        <div class="px-0 py-2 flex gap-4 mt-2">
            <div class="">
            <img src="${video.authors[0].profile_picture}" alt="${video.authors[0].profile_name}" class="w-10 h-10 object-cover rounded-full"/>
            </div>
            <div>
                <h2 class="font-bold">${video.title}</h2>
                <div class="flex items-center gap-2 mt-[5px]">
                <p>${video.authors[0].profile_name}</p>
                ${video.authors[0].verified ? `<img src="https://img.icons8.com/?size=100&id=D9RtvkuOe31p&format=png&color=000000" class="w-5 h-5 inline-block"/>` : ""}
                </div>
            </div>
            
        </div>`;
    videoContainer.appendChild(videoCard);
  });
};
// Call the function to load videos
loadVideos();
