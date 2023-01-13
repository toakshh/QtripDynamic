import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Get the Adventure Id from the URL
  const searchParams = new URLSearchParams(search).get("adventure");
  return searchParams;
}
//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Fetch the details of the adventure by making an API call
  try {
    let data = await fetch(
      config.backendEndpoint + `/adventures/detail?adventure=${adventureId}`
    );
    let newData = await data.json();
    return newData;
  } catch (e) {
    return null;
  }
}

//Implementation of DOM manipulation to add adventure details to DOM
async function addAdventureDetailsToDOM(adventure) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the details of the adventure to the HTML DOM
  // console.log(adventure.name)
  document.getElementById("adventure-name").innerHTML = adventure.name;
  document.getElementById("adventure-subtitle").innerHTML = adventure.subtitle;
  let imgs = document.getElementById("photo-gallery");
  adventure.images.forEach((valImg) => {
    imgs.innerHTML += `<div>
    <img class="activity-card-image" src=${valImg} alt="image" />
  </div>`;
  });
  document.getElementById(
    "adventure-content"
  ).innerHTML = `<p>${adventure.content}</p>`;
}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the bootstrap carousel to show the Adventure images
  let getImagesDiv = document.getElementById("photo-gallery");
  getImagesDiv.innerHTML = "";

  const newDiv = document.createElement("div");
  newDiv.className = "carousel slide";
  newDiv.setAttribute("id", "carouselExampleIndicators");
  newDiv.setAttribute("data-bs-ride", "true");

  newDiv.innerHTML += `<div class="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button> 
  </div>`;

  const subDiv = document.createElement("div");
  subDiv.className = "carousel-inner";

  images.forEach((item, index) => {
    if (index == 0) {
      subDiv.innerHTML += `
      <div class="carousel-item active">
        <img src=${item} class="activity-card-image d-block w-100" alt="...">
      </div>
      `;
    } else {
      subDiv.innerHTML += `
    <div class="carousel-item">
      <img src=${item} class="activity-card-image d-block w-100" alt="...">
    </div>
    `;
    }
  });
  newDiv.appendChild(subDiv);
  newDiv.innerHTML += `<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>`;

  getImagesDiv.append(newDiv);
}

//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If the adventure is already reserved, display the sold-out message.
  // console.log(adventure.available);
  if (adventure.available) {
    document.getElementById("reservation-panel-sold-out").style.display =
      "none";
    document.getElementById("reservation-panel-available").style.display =
      "block";
    // console.log (adventure.costPerHead)
    document.getElementById("reservation-person-cost").innerHTML =
      adventure.costPerHead.toString();
  } else {
    document.getElementById("reservation-panel-available").style.display =
      "none";
    document.getElementById("reservation-panel-sold-out").style.display =
      "block";
  }
}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  // TODO: MODULE_RESERVATIONS
  // 1. Calculate the cost based on number of persons and update the reservation-cost field
  let totalAmount = parseInt(adventure.costPerHead * persons);
  document.getElementById("reservation-cost").innerHTML = totalAmount;
}

//Implementation of reservation form submission
async function captureFormSubmit(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. Capture the query details and make a POST API call using fetch() to make the reservation
  // 2. If the reservation is successful, show an alert with "Success!" and refresh the page. If the reservation fails, just show an alert with "Failed!".
  // makeRequest(formDataObj);
  // const { id } = adventure;
  // console.log(adventure)
  // document.getElementById("myForm").addEventListener("submit", async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.target);
  //   const formDataObj = {};
  //   formData.forEach((val, ind) => {
  //     formDataObj[ind] = val;
  //   });
  //   formDataObj["adventure"] = adventure;
  //   console.log(formDataObj);
  // });
  // try {
  //   const res = await fetch(`${config.backendEndpoint}/reservations/new`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(formDataObj),
  //   });
  //   if (res.ok) {
  //     alert("Success!");
  //   } else {
  //     let data = await res.json();
  //     alert(`Failed - ${data.message}`);
  //   }
  // } catch (err) {
  //   console.log(err);
  //   alert("Failed - fetch call resulted in error");
  // }
//-----------------------------------
const form = document.getElementById("myForm");
  
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  let url = config.backendEndpoint + "/reservations/new";

  let formElements = form.elements;

  let bodyString = JSON.stringify({
    name: formElements["name"].value,
    date: formElements["date"].value,
    person: formElements["person"].value,
    adventure: adventure.id,
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      body: bodyString,
      headers: { "Content-Type": "application/json",},
    });

    if (res.ok) {
      alert("Success!");
      window.location.reload();
    } else {
      let data = await res.json();
      alert(`Failed - ${data.message}`);
    }
  } catch (err) {
    console.log(err);
    alert("Failed - fetch call resulted in error");
  }
});

}

//Implementation of success banner after reservation
async function showBannerIfAlreadyReserved(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If user has already reserved this adventure, show the reserved-banner, else don't
  if (adventure.reserved) {
    document.getElementById("reserved-banner").style.display = "block"
  }
  else {
    document.getElementById("reserved-banner").style.display = "none"
  }

}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};
