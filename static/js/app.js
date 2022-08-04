// sideNav
const toggle = document.getElementById('toggle');
const sidebar = document.getElementById('sidebar');

toggle.onclick = function (){
  toggle.classList.toggle('active');
  sidebar.classList.toggle('active');
}
document.onclick = function (e) {
  if (e.target.id !== 'sidebar' && e.target.id !== 'toggle') {
    toggle.classList.remove('active')
    sidebar.classList.remove('active')
  }
}

function show_card() {

  $.ajax({
    type: "GET",
    url: "/showcard",
    data: {},
    success: function (response) {
      let cardlist = response['all_card']
      for (let i = 0; i < cardlist.length; i++) {
        let num = cardlist[i]['num']
        let title = cardlist[i]['short_title']
        let comment = cardlist[i]['comment']
        let url = cardlist[i]['url']
        let image = cardlist[i]['image']
        let temp_html = `<div class="col">
                                            <div class="card h-100">
                                                <img src="${image}" class="card-img-top in_card_image" alt="...">
                                                <div class="card-body">
                                                    <h5 class="card-title" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="openmodal(${num})">${title}</h5>
                                                    <p class="card-text " data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="openmodal(${num})" id="show" >${comment}</p>
                                                </div>
                                            </div>
                                        </div>`

        $('#card_list').append(temp_html)

      }
    }
  })
}

function openmodal(num) {

    // 모달이 열릴 때 댓글 불러오기
    $(document).ready(function () {
        $('#commentsList').empty()
        listComments(num);
        $('#newpost').hide()
        $('#commentWrap').show();
        $('#commentBox').show();
    });

  $('#modal').empty()

  $.ajax({
    type: "POST",
    url: "/openmodal",
    data: {
      num_give: num
    },
    success: function (response) {
      let cardlist = response['select_card']
      let comment = cardlist['comment']
      let short_title = cardlist['short_title']
      let title = cardlist['title']
      let desc = cardlist['desc']
      let url = cardlist['url']
      let image = cardlist['image']

      // 모달 열릴 때 댓글박스 html 태그 변수
      let temp_commentBox = `
        <input type="text" class="form-control" id="commentInput" placeholder="내용을 입력하세요"
        aria-label="내용을 입력하세요" aria-describedby="button-addon2" style="margin-right: 15px;">
        <input type="hidden" value="${num}" id="numOfCard">
      `
      let temp_html = `<div>
                                  <img src="${image}" class="card-img-top in_modal_image" alt="...">
                                  <div class="card-body">
                                    <h5 class="card-title">${title}</h5>
                                    <p class="card-text"> ${comment}</p>
                                    <p class="card-text">${desc}</p>
                                    <a href="${url}" target="_blank" class="btn btn-primary">페이지로 이동</a>
                                  </div>
                                </div>`

      $('#staticBackdropLabel').text(short_title)
      $('#modal').append(temp_html)
      $('#commentBox').prepend(temp_commentBox)
    }
  })
}

// 댓글 입력 취소용
function deleteCommentBox() {
    $('#commentInput').remove()
}

function savecard() {
  $('#modal').empty()
  $('#newpost').show()
  $('#commentWrap').hide();
  $('#commentBox').hide();
  let temp_html = `<div >
                        <div class="input-group mb-3">
                          <span class="input-group-text" id="basic-addon1">글제목</span>
                          <input type="text" id="short_title" class="form-control" placeholder="짧게 지어주세요" aria-label="Username" aria-describedby="basic-addon1">
                       </div> 
                       <div class="input-group mb-3">
                          <span class="input-group-text" id="basic-addon3">올리려고 하는 url</span>
                          <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3">
                        </div> 
                       <div>
                          <div class="input-group mb-3">
                              <label class="input-group-text" for="inputGroupSelect01">Options</label>
                              <select class="form-select" id="inputGroupSelect01">
                                <option selected>어떤 종류인가요?</option>
                                <option value="blog">유용한 블로그</option>
                                <option value="website">유용한 사이트</option>
                              </select>
                            </div>
                        </div>
                        <div class="input-group">
                              <span class="input-group-text">설명을 해주세요</span>
                              <textarea class="form-control" aria-label="With textarea" id="save_comment"></textarea>
                            </div>
</div> `
  $('#modal').append(temp_html)
  $('#staticBackdropLabel').text('추가해tHub')
}

function savedata() {
  let short_title = $('#short_title').val()
  let url = $('#basic-url').val()
  let type = $('#inputGroupSelect01').val()
  let comment = $('#save_comment').val()

  $.ajax({
    type: "POST",
    url: "/save_card",
    data: {
      url_give: url,
      type_give: type,
      comment_give: comment,
      short_title_give:short_title,
    },
    success: function (response) {
      alert(response['msg'])
      window.location.reload()
    }
  })
}

// 댓글 조회
function listComments(num) {
    $.ajax({
        type: "POST",
        url: "/listComments",
        data: {cardId_give: num},
        success: function (response) {
            let rows = JSON.parse(response['list'])
            for (let i = 0; i < rows.length; i++) {
                let comment = rows[i]['comments']
                let cid = rows[i]['_id']['$oid']
                let username = rows[i]['username']
                let cardId = rows[i]['cardId']

                let temp_html1 = `<li>${username} : ${comment}</li>`
                let userNameOfToken = $('#userNameOfToken').val()
                if(userNameOfToken == username) {
                    temp_html1 += `<button onclick="delComments('${cid}')">삭제</button>`
                }
                $('#commentsList').append(temp_html1)
            }
        }
    });
}

// 댓글 삭제
function delComments(cid) {
    $.ajax({
        type: "POST",
        url: "/delComments",
        data: {cid_give: cid},
        success: function (response) {
            alert(response["msg"])
            window.location.reload()
        }
    });
}

// 댓글 작성
function comments() {
    let comments = $('#commentInput').val()
    let username = $('#commentUserName').val()
    let cardId = $('#numOfCard').val()
    console.log(comments+" / "+username+" / "+cardId)
    $.ajax({
        type: "POST",
        url: "/comments",
        data: {
            comments_give: comments,
            username_give: username,
            cardId_give: cardId
        },
        success: function (response) {
            alert(response["msg"])
            window.location.reload()
        }
    });
}
