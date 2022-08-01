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

const toggle = document.getElementById('toggle');
const sidebar = document.getElementById('sidebar');

toggle.onclick = function () {
  toggle.classList.toggle('active');
  sidebar.classList.toggle('active');
}
document.onclick = function (e) {
  if (e.target.id !== 'sidebar' && e.target.id !== 'toggle') {
    toggle.classList.remove('active')
    sidebar.classList.remove('active')
  }
}