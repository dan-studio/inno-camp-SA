function signup() {
  let id = $('#id').val()
  let pw = $('#pw').val()
  $.ajax({
      type: "POST",
      url: "/signup",
      data: {
        id_give: id, 
        pw_give: pw
      },
      success: function (response) {
          alert(response["msg"])
          window.location.reload()
      }
  });
}