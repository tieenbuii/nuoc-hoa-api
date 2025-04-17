const err_src = "/images/unnamed.jpg";
const loadData = async () => {
  try {
    // const arr = ["_id", "name", "price", "slug"];

    // let thead = `<thead><tr>`;
    // arr.forEach((value, index) => {
    //   thead += `<th>${value}</th>`;
    // });
    // thead += "</tr></thead>";
    // $("#sample_data").append(thead);
    // const { data } = await $.ajax({ url: "/api/v1/products/" });
    // let html = "<tbody>";

    // data.data.forEach((val, ind) => {
    //   val.arr = arr;
    //   html += `<tr>`;
    //   arr.forEach((value, index) => {
    //     html += `<td>${val[value]}</td>`;
    //   });
    //   html += `</tr>`;
    // });
    // html += "</tbody>";
    // $("#sample_data").append(html);
    $("#sample_data").DataTable({
      processing: true,
      serverSide: true,
      serverMethod: "get",
      ajax: {
        url: "api/v1/products/getTableProduct",
      },
      columns: [
        {
          data: "images",
          render: function (data) {
            return (
              `<img src="` +
              data[0] +
              `" alt=""height="65" width="65" onerror="this.src='` +
              err_src +
              `';" style="border-radius: 0.275rem;" >`
            );
          },
        },
        {
          data: "title",
          render: function (data) {
            const value = data.length > 39 ? data.slice(0, 40) + "..." : data;
            return '<div class= "my-3">' + value + "</div>";
          },
        },

        {
          data: "price",
          render: function (data) {
            const formattedPrice = Number(data).toLocaleString("vi-VN");
            return '<div class="my-3">' + formattedPrice + " VND</div>";
          },
        },
        {
          data: "inventory",
          render: function (data) {
            return '<div class= "my-3">' + data + "</div>";
          },
        },
        {
          data: null,
          render: function (row) {
            let btnEdit =
              '<button type="button" class="btn btn-primary btn-sm mr-1 edit" data-id="' +
              row.id +
              '"><i class="fa fa-edit"></i></button>';
            let btnDelete =
              '<button type="button" class="btn btn-danger btn-sm delete" data-id="' +
              row.id +
              '"><i class="fa fa-trash-alt"></i></button></div>';
            return `<div class= "my-3">${btnEdit}${btnDelete}</div>`;
          },
        },
      ],
    });

    showAlert("success", "Tải dữ liệu thành công!");
  } catch (err) {
    showAlert("error", err);
  }
};
const loadCategory = function () {
  $.ajax({
    url: "/api/v1/categories",
    method: "GET",
    success: (data) => {
      $("#category").empty();
      data.data.data.forEach((value) => {
        $("#category").append(
          "<option value=" + value.id + ">" + value.name + "</option>"
        );
      });
    },
  });
};
const loadBrand = function () {
  $.ajax({
    url: "/api/v1/brands",
    method: "GET",
    success: (data) => {
      $("#brand").empty();
      data.data.data.forEach((value) => {
        $("#brand").append(
          "<option value=" + value.id + ">" + value.name + "</option>"
        );
      });
    },
  });
};
function reloadData() {
  $("#sample_data").DataTable().ajax.reload();
}
$(document).ready(async function () {
  $("select").select2({
    theme: "bootstrap-5",
  });
  loadData();
  loadCategory();
  loadBrand();
  $(".navbar-nav li").removeClass("active");
  // $(".nav-item")[0].addClass('active');
  $(".navbar-nav li")[3].className = "nav-item active";
});
$("#add_data").click(function () {
  files = [];
  $("#dynamic_modal_title").text("Thêm sản phẩm");
  $("#sample_form")[0].reset();
  $("#category").val(null).trigger("change");
  $("#brand").val(null).trigger("change");
  $("#baseNotes").val(null).trigger("change");
  $("#gender").val(null).trigger("change");
  $("#action").val("Add");
  $("#id").val("");

  $("#action_button").text("Thêm");
  $(".img-show").empty();
  $(".mb-2").show();

  $("#action_modal").modal("show");
});
$(document).on("click", ".edit", function () {
  files = [];
  $("#sample_form")[0].reset();
  const id = $(this).data("id");

  $("#dynamic_modal_title").text("Sửa sản phẩm");

  $("#action").val("Sửa");

  $("#action_button").text("Sửa");

  $("#action_modal").modal("show");
  $(".mb-2").hide();
  $(".img-show").empty();
  $(".edit-show").show();

  $.ajax({
    url: `/api/v1/products/${id}`,
    method: "GET",
    success: function (data) {
      const product = data.data.data;
      $("#id").val(id);
      $("#title").val(product.title);
      $("#category").val(product.category.id).trigger("change");
      $("#brand").val(product.brand.id).trigger("change");
      $("#price").val(product.price);
      $("#promotion").val(product.promotion);
      $("#origin").val(product.origin);
      $("#yearOfLaunch").val(product.yearOfLaunch);
      $("#perfumeGroup").val(product.perfumeGroup);
      $("#inventory").val(product.inventory);
      $("#capacity").val(product.capacity);
      tinymce.get("description").setContent(product.description);
    },
  });
});
$(document).on("click", ".delete", function () {
  const id = $(this).data("id");

  if (confirm("Bạn có chắc xóa sản phẩm này?")) {
    try {
      $.ajax({
        url: `/api/v1/products/${id}`,
        method: "delete",
        success: function (data) {
          showAlert("success", `Xóa thành công sản phẩm`);
          reloadData();
        },
      });
    } catch (error) {
      return showAlert("error", error.responseJSON.message);
    }
  }
});
