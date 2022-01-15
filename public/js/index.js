function showPrice(event) {
  if (event.target.value === "free") {
    $(".price-block").css("display", "none");
    $(".discount-block").css("display", "none");
  } else {
    $(".price-block").css("display", "block");
    $(".discount-block").css("display", "block");
  }
}

function changeToLoading() {
  $(".close").attr("disabled", true);
  $(".cancel-btn").attr("disabled", true);
  $("#addlesson-btn").empty();
  $("#addlesson-btn").append(`
    <div class="text-center">
      <div class="spinner-border spinner-border-sm" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  `);
}

function sortTable(n) {
  let i,
    shouldSwitch,
    switchcount = 0;
  let table = document.getElementById("userTable");
  let switching = true;
  let dir = "asc";

  while (switching) {
    switching = false;
    let rows = table.rows;

    for (i = 1; i < rows.length - 1; i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;

      let x = rows[i].getElementsByTagName("td")[n];
      let y = rows[i + 1].getElementsByTagName("td")[n];

      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          let text = rows[0].getElementsByTagName("th")[n].innerHTML;
          text = text.substring(0, text.length - 1) + "&#9660";
          rows[0].getElementsByTagName("th")[n].innerHTML = text;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          let text = rows[0].getElementsByTagName("th")[n].innerHTML;
          text = text.substring(0, text.length - 1) + "&#9650";
          rows[0].getElementsByTagName("th")[n].innerHTML = text;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

$().ready(() => {
  $(".autoshow").trigger("click");
  $("#searchInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#tableBody tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});
