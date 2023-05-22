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
  var input = document.getElementById("searchInput").value.toLowerCase();
  var table = document.getElementById("dataTable");
  var rows = table.getElementsByTagName("tr");

  for (var i = 1; i < rows.length; i++) {
    var rowData = rows[i].getElementsByTagName("td");
    var rowText = "";

    for (var j = 0; j < rowData.length; j++) {
      var cellText = rowData[j].innerText.toLowerCase();
      if (cellText.includes(input)) {
        var startIndex = cellText.indexOf(input);
        var endIndex = startIndex + input.length;
        var highlightedText = cellText.substring(startIndex, endIndex);
        rowData[j].innerHTML = cellText.replace(
          highlightedText,
          '<span class="highlight">' + highlightedText + '</span>'
        );
        rows[i].style.display = "";
      } else {
        rowData[j].innerHTML = cellText;
        rows[i].style.display = "none";
      }
    }
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
