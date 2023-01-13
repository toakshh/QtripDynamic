import config from "../conf/index.js";

//Implementation to extract city from query params
function getCityFromURL(search) {
  // TODO: MODULE_ADVENTURES
  // 1. Extract the city id from the URL's Query Param and return it
  let searchData = new URLSearchParams(search).get("city");
  return searchData;
}

//Implementation of fetch call with a paramterized input based on city
async function fetchAdventures(city) {
  // TODO: MODULE_ADVENTURES
  // 1. Fetch adventures using the Backend API and return the data
  try {
    let data = await fetch(config.backendEndpoint + `/adventures?city=${city}`);
    return await data.json();
  } catch (e) {
    return null;
  }
}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures) {
  // TODO: MODULE_ADVENTURES
  // 1. Populate the Adventure Cards and insert those details into the DOM
  adventures.forEach((item) => {
  let ele = document.createElement("div");
  ele.setAttribute("id", item.name);
  ele.className = "col-6 col-lg-3 mb-4";
    ele.innerHTML = `<a href="detail/?adventure=${item.id}" id="${item.id}">
      <div class="tile card adventure-card">
        <img src="${item.image}" class="img-responsive activity-card img" alt=" image">
        <span class="category-banner">${item.category}</span>

          <div class=" card-body text-center d-md-flex justify-content-between flex-column">
            <h5>${item.name}</h5>
            <p><b>Cost per head</b>:${item.costPerHead}</p>
            <p><b>Duration</b>:${item.duration}</p>
          </div>

      </div>
    </a>`;
    document.getElementById("data").append(ele);
  });
}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on Duration and return filtered list
  let durationList=
  list.filter((ele)=>{
    if (ele.duration>= low && ele.duration<=high) return ele;
  })
  return durationList;
}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on their Category and return filtered list
  let newcatList =[];
  categoryList.forEach((i) =>{
    list.forEach((item)=>{
      if (item.category == i){
        newcatList.push(item);
      }
    })
  })
  return newcatList;
}

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
  // TODO: MODULE_FILTERS
  // 1. Handle the 3 cases detailed in the comments above and return the filtered list of adventures
  // 2. Depending on which filters are needed, invoke the filterByDuration() and/or filterByCategory() methods
  let updatedData = [];
  if (!filters.category.length && !filters.duration) {
    updatedData=list;
  } else {
    if (filters.category.length && !filters.duration) 
    {
      updatedData = filterByCategory(list, filters.category);
    } 
    else if (!filters.category.length && filters.duration)
    {
      let [low,high]=filters.duration.split('-');
      updatedData= filterByDuration(list, low, high);
    }
    else if (filters.category.length && filters.duration) {
      let [low,high]=filters.duration.split('-');
      let List1= filterByDuration(list, low, high);
      updatedData=filterByCategory(List1, filters.category);
    }
  }
  // Place holder for functionality to work in the Stubs
  return updatedData;
  
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
  // TODO: MODULE_FILTERS
  // 1. Store the filters as a String to localStorage
  window.localStorage.setItem('filters',JSON.stringify(filters));
  return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
  // TODO: MODULE_FILTERS
  // 1. Get the filters from localStorage and return String read as an object
  let filters= JSON.parse(window.localStorage.getItem('filters')); 
  // Place holder for functionality to work in the Stubs
  return filters;
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
  // TODO: MODULE_FILTERS
  // 1. Use the filters given as input, update the Duration Filter value and Generate Category Pills
  let parent = document.getElementById("category-list");
  filters.category.forEach((item,i)=>{
    parent.innerHTML+=
    `<span class="category-filter">${item} <span id="pillremove" class="ms-2" onclick="FilterRemover(${i})">x</span></span> `
  // filters.category.forEach((item,i) => {
  //   curCatVal.innerHTML +=`<span class="category-filter" >${item}<span id="pillremove" type="button" onclick="FilterRemover(${i})" data-bs-dismiss="modal" aria-label="Close">x</span></span>
  //     `; 

  });
}

export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
};
