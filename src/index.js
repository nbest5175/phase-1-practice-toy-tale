let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Fetch and render toys on page load
  fetchToys();

  // Add event listener for toy form submission
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const name = toyForm.name.value;
    const image = toyForm.image.value;
    const likes = 0; // Default likes for a new toy
    const newToy = { name, image, likes };
    addNewToy(newToy);
    toyForm.reset();
  });

  // Add event listener for toy "Like" buttons
  toyCollection.addEventListener("click", (event) => {
    if (event.target.classList.contains("like-btn")) {
      const toyId = event.target.id;
      likeToy(toyId);
    }
  });

  // Fetch Andy's Toys
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then((response) => response.json())
      .then((toys) => {
        toys.forEach((toy) => renderToy(toy));
      })
      .catch((error) => console.error("Error fetching toys:", error));
  }

  // Add Toy Info to the Card
  function renderToy(toy) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(card);
  }

  // Add a New Toy
  function addNewToy(newToy) {
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((toy) => {
        renderToy(toy);
      })
      .catch((error) => console.error("Error adding new toy:", error));
  }

  // Increase a Toy's Likes
  function likeToy(toyId) {
    const card = document.querySelector(`.card button[id="${toyId}"]`);
    const likesElement = card.previousSibling;
    let likes = parseInt(likesElement.textContent.split(" ")[0]);

    likes++;

    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        likesElement.textContent = `${updatedToy.likes} Likes`;
      })
      .catch((error) => console.error("Error updating likes:", error));
  }
});