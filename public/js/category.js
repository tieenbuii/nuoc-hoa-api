const loadData = async () => {
  try {
    $("#sample_data").DataTable({
      processing: true,
      serverSide: true,
      serverMethod: "get",
      ajax: {
        url: "api/v1/categories/getTableCategory",
      },
      columns: [
        {
          data: "name",
          render: function (data) {
            const value = data.length > 39 ? data.slice(0, 40) + "..." : data;
            return '<div class= "my-3">' + value + "</div>";
          },
        },
        {
          data: null,
          render: function (row) {
            let btnEdit =
              '<button type="button" class="btn btn-primary btn-sm mr-1 edit" data-id="' +
              row._id +
              '"><i class="fa fa-edit"></i></button>';
            let btnDelete =
              '<button type="button" class="btn btn-danger btn-sm delete" data-id="' +
              row._id +
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

function reloadData() {
  $("#sample_data").DataTable().ajax.reload();
}

$("#add_data").click(function () {
  $("#dynamic_modal_title").text("Thêm danh mục");
  $("#sample_form")[0].reset(); 
  $("#action").val("Thêm");
  $("#id").val("");

  $("#action_button").text("Thêm");
  $("#action_modal").modal("show");
});
$(document).on("click", ".edit", function () {
  const id = $(this).data("id");

  $("#dynamic_modal_title").text("Sửa danh mục");

  $("#action").val("Sửa");

  $("#action_button").text("Sửa");

  $("#action_modal").modal("show");
  $.ajax({
    url: `/api/v1/categories/${id}`,
    method: "GET",
    success: function (data) {
      const category = data.data.data;
      $("#name").val(category.name);
      $("#id").val(category._id);
    },
  });
});

$(document).on("click", ".delete", function () {
  const id = $(this).data("id");

  if (confirm("Bạn có chắc xóa danh mục này?")) {
    try {
      $.ajax({
        url: `/api/v1/categories/${id}`,
        method: "delete",
        success: function (data) {
          showAlert("success", `Xóa thành công danh mục`);
          reloadData();
        },
      });
    } catch (error) {
      return showAlert("error", "Đã có lỗi xảy ra");
    }
  }
});

$("#sample_form").on("submit", async (e) => {
  e.preventDefault();
  const action = $("#action").val();
  const method = action == "Add" ? "POST" : "PATCH";
  const data = { name: $("#name").val() };
  const id = $("#id").val();
  const url = `/api/v1/categories/${id}`;
  try {
    await $.ajax({
      url,
      method,
      data,
      beforeSend: function () {
        $("#action_button").attr("disabled", "disabled");
      },
      success: (data) => {
        $("#action_button").attr("disabled", false);
        $("#action_modal").modal("hide");
        showAlert("success", `${action} danh mục thành công!`);
        reloadData();
      },
    });
  } catch (error) {
    $("#action_button").attr("disabled", false);
    return showAlert("error", error.responseJSON.message);
  }
});

$(document).ready(function () {
  $("select").select2({
    theme: "bootstrap-5",
  });
  loadData();
  $(".navbar-nav li").removeClass("active");
  $(".navbar-nav li")[6].className = "nav-item active";
});
