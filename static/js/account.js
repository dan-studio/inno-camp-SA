function signup() {
  let username = $('#username').val()
  let id = $('#id').val()
  let pw = $('#pw').val()
  let cfpw = $('#cfpw').val()
  if (username == "") {
    alert('이름을 입력하세요')
  } else if (id == "") {
    alert('아이디를 입력하세요')
  } else if (pw == "") {
    alert('비밀번호를 입력하세요')
  } else if (cfpw == "") {
    alert('비밀번호를 다시 한번 입력하세요')
  } else if (cfpw !== pw) {
    alert('비밀번호가 일치하지 않습니다.')
    return false;
  }
  $.ajax({
    type: "POST",
    url: "/api/signup",
    data: {
      username_give: username,
      id_give: id,
      pw_give: pw,
    },
    success: function (response) {
      alert(response["result"])
      window.location.reload()
    }
  });
}

function checkid() {
  let id = $('#id').val()
  let button = document.getElementById('registerSubmit')
  if (id == "") {
    alert('아이디를 입력하세요')
  }
  $.ajax({
    type: "POST",
    url: '/api/signup/checkid',
    data: {
      id_give: id
    },
    success: function (response) {
      if (response['exists']) {
        alert('이미 존재하는 아이디입니다.')
      } else {
        alert('사용 가능한 아이디입니다.')
        button.disabled=false;
      }
    }
  })
}

function signin() {
  let id = $('#ID').val()
  let pw = $('#PW').val()

  if (id == '') {
    alert('아이디를 입력하세요')
  } else if (pw == '') {
    alert('비밀번호를 입력하세요')
  }
  $.ajax({
    type: "POST",
    url: "/api/signin",
    data: {
      id_give: id,
      pw_give: pw
    },
    success: function (response) {
      if (response['result'] == 'success') {
        $.cookie('mytoken', response['token'], {
          path: '/'
        })
        window.location.replace('/')
      } else {
        alert(response['msg'])
      }
    }
  })
}