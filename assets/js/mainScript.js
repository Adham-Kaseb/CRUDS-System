// the overlay. 👇🏻
let overlay = document.createElement("div");
overlay.className = "overlay";
document.body.appendChild(overlay);

let previousProductDetails;
let isCtrlKeyPressed = false;
let isZKeyPressed = false;

// All IDs Targeted
let Name = document.getElementById("prod__name"); // No: 1
let Price = document.getElementById("price"); // No: 2
let Count = document.getElementById("count"); // No: 5
let Category = document.getElementById("category"); // No: 6
let Submit = document.getElementById("submit"); // No: 7
let CategSearch = document.getElementById("srchByCategory"); // No: 8
let NameSearch = document.getElementById("srchByName"); // No: 9
let Search = document.getElementById("search"); // No: 10
let Delete = document.getElementById("delete"); // No: 11
let Update = document.getElementById("update"); // No: 12
let tempo;
let mood = "CREATE";

// Creating New Product Process.

let productDetails;
if (localStorage.Storage != null) {
  productDetails = JSON.parse(localStorage.Storage);
} else {
  productDetails = [];
}

Submit.onclick = function () {
  let newProduct = {
    objName: Name.value.toLowerCase(),
    objPrice: Price.value,
    objCount: Count.value,
    objCategory: Category.value.toLowerCase(),
  };

  if (mood === "CREATE") {
    if (newProduct.objCount > 1) {
      for (let i = 0; i < newProduct.objCount; i++) {
        productDetails.push(newProduct);
      }
    } else {
      productDetails.push(newProduct);
    }
  } else {
    productDetails[tempo] = newProduct;
    mood = "CREATE";
    Submit.innerHTML = "CREATE";
    Count.style.display = "block";
    Category.style.width = "50%";
  }

  localStorage.setItem("Storage", JSON.stringify(productDetails));

  clearingData();
  dataShowing();
};

// Clear Data Function.
function clearingData() {
  Name.value = "";
  Price.value = "";
  Count.value = "";
  Category.value = "";
}

// Show Data Function.
function dataShowing() {
  let table = "";

  for (let i = 0; i < productDetails.length; i++) {
    table += `
      <tr id="row-${i}">
        <th scope="row" class="index">${i + 1}</th>
        <td>${productDetails[i].objName}</td>
        <td>${productDetails[i].objCategory}</td>
        <td>${productDetails[i].objPrice}</td>
        <th scope="col"><button id="update" id="scrollButton"  onclick = "updateProduct(${i}), scrollToTop()" class="update__button button press inputs ">Update</th>
        <th scope="col"><button id="delete" onclick = "deleteProduct(${i})" class="delete__button button press inputs ">Delete</th>
      </tr>
    `;
  }
  document.getElementById("tbody").innerHTML = table;
  let deleteBtn = document.getElementById("delete__all__area");
  if (productDetails.length > 0) {
    deleteBtn.innerHTML = `
      <button onclick = "deleteAll()" class="delete__alls button press inputs">Delete All (${productDetails.length}) Item</button>
    `;
  } else {
    deleteBtn.innerHTML = "";
  }
}

dataShowing();

// Delete Product Function.
function deleteProduct(i) {
  let tableRow = document.getElementById("row-" + i);
  tableRow.style.opacity = "0";
  tableRow.style.transition = "opacity 0.6s ease-out";

  setTimeout(function () {
    productDetails.splice(i, 1); // if u want to delete one product or more ⬅️⬅️⬅️⬅️⬅️
    localStorage.Storage = JSON.stringify(productDetails);
    dataShowing();
  }, 300);
}

// Delete All Products Function.
function deleteAll() {
  // Store the deleted data in a separate array
  let deletedData = productDetails.slice();

  localStorage.clear();
  productDetails.splice(0);
  dataShowing();

  // Store the deleted data in local storage
  localStorage.setItem("DeletedData", JSON.stringify(deletedData));
}

// Function to show the deleted data in a popup
function showDeletedDataPopup() {
  // Retrieve the deleted data from local storage
  let deletedData = JSON.parse(localStorage.getItem("DeletedData"));

  // Create the overlay div
  let overlay = document.createElement("div");
  overlay.className = "another_overlay";
  overlay.style.zIndex = "9999"; // Set a higher z-index value
  document.body.appendChild(overlay);

  // Create the popup container
  let popupContainer = document.createElement("div");
  popupContainer.className = "popup-container";

  // Create the close button
  let closeButton = document.createElement("span");
  closeButton.className = "close-button";
  closeButton.innerHTML = "&times;";
  closeButton.addEventListener("click", closePopup);

  // Create the table for deleted data
  let table = document.createElement("table");
  table.className = "deleted-data-table";
  let tableHead = document.createElement("thead");
  let tableHeadRow = document.createElement("tr");
  let tableBody = document.createElement("tbody");

  // Create table header
  let headerLabels = ["#", "Name", "Category", "Price"];
  for (let label of headerLabels) {
    let th = document.createElement("th");
    th.textContent = label;
    tableHeadRow.appendChild(th);
  }

  tableHead.appendChild(tableHeadRow);
  table.appendChild(tableHead);

  // Populate table with deleted data
  if (deletedData && deletedData.length > 0) {
    for (let i = 0; i < deletedData.length; i++) {
      let tr = document.createElement("tr");
      let rowData = [
        i + 1,
        deletedData[i].objName,
        deletedData[i].objCategory,
        deletedData[i].objPrice,
      ];

      for (let data of rowData) {
        let td = document.createElement("td");
        td.textContent = data;
        tr.appendChild(td);
      }

      tableBody.appendChild(tr);
    }
  }

  table.appendChild(tableBody);

  // Append elements to the popup container
  popupContainer.appendChild(closeButton);
  popupContainer.appendChild(table);

  // Append the popup container to the overlay
  overlay.appendChild(popupContainer);
}

// Function to close the popup
function closePopup() {
  let overlay = document.querySelector(".another_overlay");
  overlay.style.zIndex = "";
  overlay.remove();
}

function updateProduct(i) {
  Name.value = productDetails[i].objName;
  Category.value = productDetails[i].objCategory;
  Price.value = productDetails[i].objPrice;
  Count.value = productDetails[i].objCount;
  Count.style.display = "none";
  Category.style.width = "100%";
  Submit.innerHTML = "Update";
  mood = "update";
  tempo = i;
}

// Search Area.
let searchMood = "byName";

function getSearchMood(id) {
  let searchBox = document.getElementById("search__input");

  if (id === "srchByName") {
    searchMood = "byName";
    searchBox.placeholder = "Search By Name";
  } else {
    searchMood = "srchByCategory";
    searchBox.placeholder = "Search By Category";
  }
  search__input.focus();
  search__input.value = "";
  dataShowing();
}

function dataSearch(value) {
  let table = "";

  if (searchMood === "byName") {
    for (let i = 0; i < productDetails.length; i++) {
      if (productDetails[i].objName.includes(value)) {
        table += `
          <tr>
            <th scope="row" class="index">${i + 1}</th>
            <td>${productDetails[i].objName}</td>
            <td>${productDetails[i].objCategory}</td>
            <td>${productDetails[i].objPrice}</td>
            <th scope="col"><button id="update" id="scrollButton"  onclick = "updateProduct(${i}), scrollToTop()" class="update__button button ">Update</th>
            <th scope="col"><button id="delete" onclick = "deleteProduct(${i})" class="delete__button button ">Delete</th>
          </tr>
        `;
      }
    }
  } else {
    for (let i = 0; i < productDetails.length; i++) {
      if (productDetails[i].objCategory.includes(value.toLowerCase())) {
        table += `
          <tr>
            <th scope="row" class="index">${i + 1}</th>
            <td>${productDetails[i].objName}</td>
            <td>${productDetails[i].objCategory}</td>
            <td>${productDetails[i].objPrice}</td>
            <th scope="col"><button id="update" id="scrollButton"  onclick = "updateProduct(${i}), scrollToTop()" class="update__button button ">Update</th>
            <th scope="col"><button id="delete" onclick = "deleteProduct(${i})" class="delete__button button ">Delete</th>
          </tr>
        `;
      }
    }
  }
  document.getElementById("tbody").innerHTML = table;
}

// Scroll to Top Function.
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.onscroll = function () {
  var scrollButton = document.getElementById("scrollButton");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollButton.style = "transform: scale(1); transition: all 250ms ;";
  } else {
    scrollButton.style = "transform: scale(0); transition: all 250ms ;";
  }
};

document.getElementById("scrollButton").onclick = scrollToTop;

window.addEventListener("scroll", function () {
  const tr = document.querySelector(".sticky-element");
  const rect = tr.getBoundingClientRect();

  if (rect.top <= 0) {
    tr.classList.add("sticky");
  } else {
    tr.classList.remove("sticky");
  }
});
