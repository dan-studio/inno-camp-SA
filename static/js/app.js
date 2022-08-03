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
      let num = cardlist['num']
      let delete_html = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="cardDelete(${num})">Delete</button>`
      let temp_html = `<div>
                                  <img src="${image}" class="card-img-top in_modal_image" alt="...">
                                  <div class="card-body">
                                    <h5 class="card-title">${title}</h5>
                                    <p class="card-text"> ${comment}</p>
                                    <p class="card-text">${desc}</p>
                                    <a href="${url}" target="_blank" class="btn btn-primary">페이지로 이동</a>
                                  </div>
                                  <div><h3>댓글</h3>
                                  <hr>
                                  <ul>
                                  <li> </li>
                                    </ul>
                                  </div>
                                </div>`

      $('#staticBackdropLabel').text(short_title)
      $('#modal').append(temp_html)
      $('#delete').empty()
      $('#delete').append(delete_html)
    }
  })
}

function savecard() {
  $('#modal').empty()
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
                        <button onclick="savedata()" type="button" class="btn btn-dark">기록하기</button>
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
function cardDelete(num) {
  let msg = confirm("정말 삭제하시겠습니까?")
  if (msg) {
    $.ajax({
    type: "POST",
    url: `/carddelete`,
    data: {
      num_give: num
    },
    success: function (response) {
      alert(response["msg"])
      window.location.href = "/"
    }
  });
  }

}
