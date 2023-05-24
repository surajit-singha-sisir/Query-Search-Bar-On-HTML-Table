//Sorting Table
function sortTable(columnIndex) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("dataTable");
    switching = true;
    
    while (switching) {
      switching = false;
      rows = table.rows;
      
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("td")[columnIndex];
        y = rows[i + 1].getElementsByTagName("td")[columnIndex];
        
        if (compareTableData(x.innerHTML, y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      }
      
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  
    resetSortIcons();
    updateSortIcon(columnIndex, shouldSwitch);
  }
  
  function compareTableData(a, b) {
    // Compare the values based on the column type
    if (isNaN(a) || isNaN(b)) {
      // For non-numeric values (e.g., strings)
      return a.toLowerCase() > b.toLowerCase();
    } else {
      // For numeric values
      return parseFloat(a) > parseFloat(b);
    }
  }
  
  function resetSortIcons() {
    var sortIcons = document.getElementsByClassName("fas");
    for (var i = 0; i < sortIcons.length; i++) {
      sortIcons[i].classList.remove("fa-sort-up");
      sortIcons[i].classList.remove("fa-sort-down");
      sortIcons[i].classList.add("fa-sort");
    }
  }
  
  function updateSortIcon(columnIndex, shouldSwitch) {
    var sortIcon = document.getElementById(getSortIconId(columnIndex));
    sortIcon.classList.remove("fa-sort");
    
    if (shouldSwitch) {
      sortIcon.classList.add("fa-sort-up");
    } else {
      sortIcon.classList.add("fa-sort-down");
    }
  }
  
  function getSortIconId(columnIndex) {
    switch (columnIndex) {
      case 0:
        return "eventSortIcon";
      case 1:
        return "dateSortIcon";
      case 2:
        return "answerSortIcon";
        case 3:
        return "descriptionSortIcon";
      default:
        return "";
    }
  }
  


//User Click on ROW and color
document.addEventListener("DOMContentLoaded", function() {
  var table = document.getElementById("dataTable");
  var rows = table.getElementsByTagName("tr");

  for (var i = 0; i < rows.length; i++) {
    rows[i].addEventListener("click", function() {
      if (this.classList.contains("clicked")) {
        this.classList.remove("clicked");
      } else {
        this.classList.add("clicked");
      }
    });
  }
});


//Search Bar Result
function searchTable() {
  var input = document.getElementById("searchInput").value;
  var table = document.getElementById("dataTable");
  var rows = table.getElementsByTagName("tr");

  for (var i = 1; i < rows.length; i++) {
    var rowData = rows[i].getElementsByTagName("td");
    var rowText = "";

    for (var j = 0; j < rowData.length; j++) {
      var cellText = rowData[j].innerText;
      if (cellText.includes(input)) {
        var startIndex = cellText.indexOf(input);
        var endIndex = startIndex + input.length;
        var highlightedText = cellText.substring(startIndex, endIndex);
        rowData[j].innerHTML = cellText.replace(
          new RegExp(highlightedText, "g"),
          '<span class="highlight">' + highlightedText + '</span>'
        );
        rows[i].style.display = "";
      } else {
        rowData[j].innerHTML = cellText;
        rows[i].style.display = "none";
      }

      rowData[j].addEventListener("mouseenter", showQuerySuggestion);
      rowData[j].addEventListener("mouseleave", hideQuerySuggestion);
    }
  }
}


function showQuerySuggestion(event) {
  var cellText = event.target.innerText;
  var query = encodeURIComponent(cellText);
  var tooltip = document.createElement("div");
  tooltip.classList.add("query-suggestion-tooltip");
  tooltip.innerHTML = 'Search for "<a href="https://www.google.com/search?q=' + query + '" target="_blank">' + cellText + '</a>"';
  event.target.appendChild(tooltip);
}


function hideQuerySuggestion(event) {
  var tooltips = event.target.getElementsByClassName("query-suggestion-tooltip");
  for (var i = 0; i < tooltips.length; i++) {
    tooltips[i].remove();
  }
}



// Night Mode Toggle
var nightModeIcon = document.getElementById("nightModeIcon");
var isNightMode = false;

nightModeIcon.addEventListener("click", toggleNightMode);

function toggleNightMode() {
  isNightMode = !isNightMode;

  if (isNightMode) {
    document.body.classList.add("night-mode");
    nightModeIcon.classList.remove("fa-moon");
    nightModeIcon.classList.add("fa-sun");
  } else {
    document.body.classList.remove("night-mode");
    nightModeIcon.classList.remove("fa-sun");
    nightModeIcon.classList.add("fa-moon");
  }
}

//Retrieve DATA from JSON file
var jsonData = []; // Global variable to store the JSON data
var visibleRows = 20; // Number of rows initially visible
var currentVisibleRows = visibleRows; // Counter for tracking the currently visible rows

// Function to fetch JSON data from a file
function fetchJSONData() {
  var filename = "https://raw.githubusercontent.com/surajit-singha-sisir/Excel-File-to-JSON-Converter/master/phraseIdomsBanglaBCS.json";

  fetch(filename)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      jsonData = data; // Store the fetched JSON data
      populateTable(); // Call function to populate the table
    })
    .catch(function(error) {
      console.log("Error fetching JSON data:", error);
    });
}

// Function to populate the table with data
function populateTable() {
  var table = document.getElementById("dataTable");

  for (var i = 0; i < jsonData.length && i < currentVisibleRows; i++) {
    var row = table.insertRow(-1);
    var idCell = row.insertCell(0);
    var questionCell = row.insertCell(1);
    var answerCell = row.insertCell(2);
    var descriptionCell = row.insertCell(3);

    idCell.innerHTML = jsonData[i].id;
    questionCell.innerHTML = jsonData[i].question;
    answerCell.innerHTML = jsonData[i].answer;
    descriptionCell.innerHTML = jsonData[i].description;
  }

  if (jsonData.length > currentVisibleRows) {
    // Show the "Show More" button if there are more rows to reveal
    var showMoreButton = document.getElementsByClassName("show-more-button");
    showMoreButton.addEventListener("click", function() {
      revealMoreRows();
      showMoreButton.style.display = "none"; // Hide the button after revealing more rows
    });
    table.parentNode.appendChild(showMoreButton);
  }
}

// Function to reveal the next 20 rows
function revealMoreRows() {
  var table = document.getElementById("dataTable");
  var remainingRows = jsonData.length - currentVisibleRows;

  // Calculate the number of rows to reveal
  var rowsToReveal = Math.min(visibleRows, remainingRows);
  for (var i = currentVisibleRows; i < currentVisibleRows + rowsToReveal; i++) {
    var row = table.insertRow(-1);
    var idCell = row.insertCell(0);
    var questionCell = row.insertCell(1);
    var answerCell = row.insertCell(2);
    var descriptionCell = row.insertCell(3);

    idCell.innerHTML = jsonData[i].id;
    questionCell.innerHTML = jsonData[i].question;
    answerCell.innerHTML = jsonData[i].answer;
    descriptionCell.innerHTML = jsonData[i].description;
  }

  currentVisibleRows += rowsToReveal;

  if (currentVisibleRows >= jsonData.length) {
    // Remove the "Show More" button if all rows have been revealed
    var showMoreButton = table.parentNode.querySelector("button");
    if (showMoreButton) {
      showMoreButton.parentNode.removeChild(showMoreButton);
    }
  }
}

// Call the function to fetch JSON data and populate the initial rows
fetchJSONData();
