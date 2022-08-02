// sideNav
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

function show_card() {
  $.ajax({
    type: "GET",
    url: "/showcard",
    data: {},
    success: function (response) {
      let cardlist = response['all_card']
      for (let i = 0; i < cardlist.length; i++) {
        let num = cardlist[i]['num']
        let title = cardlist[i]['title']
        let desc = cardlist[i]['desc']
        let url = cardlist[i]['url']
        let image = cardlist[i]['image']
        let temp_html = `<div class="col">
                                            <div class="card h-100">
                                                <img src="${image}" class="card-img-top in_card_image" alt="...">
                                                <div class="card-body">
                                                    <h5 class="card-title"><a href="${url}">${title}</a></h5>
                                                    <p class="card-text " data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="openpop(${num})" id="show" >${desc}</p>
                                                </div>
                                            </div>
                                        </div>`

        $('#card_list').append(temp_html)
      }
    }
  })
}

function openpop(num) {
  $('#modal').empty()
  $.ajax({
    type: "POST",
    url: "/opencard",
    data: {
      num_give: num
    },
    success: function (response) {
      let cardlist = response['select_card']
      let num = cardlist['num']
      let title = cardlist['title']
      let desc = cardlist['desc']
      let url = cardlist['url']
      let image = cardlist['image']
      let temp_html = `<div>
                                  <img src="${image}" class="card-img-top in_modal_image" alt="...">
                                  <div class="card-body">
                                    <h5 class="card-title">${title}</h5>
                                    <p class="card-text">${desc}</p>
                                    <a href="${url}" class="btn btn-primary">페이지로 이동</a>
                                  </div>
                                  <div><h3>댓글</h3>
                                  <hr>
                                  <ul>
                                  <li> </li>
                                    </ul>
                                  </div>
                                </div>`

      $('#staticBackdropLabel').text(title)
      $('#modal').append(temp_html)
    }
  })
}

function savecard() {
  $('#modal').empty()
  let temp_html = `<div >
                        <div class="input-group mb-3">
                          <span class="input-group-text" id="basic-addon1">이름</span>
                          <input type="text" id="save_nickname" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
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
                              <textarea class="form-control" aria-label="With textarea" id="save_desc"></textarea>
                            </div>
                        <button onclick="savedata()" type="button" class="btn btn-dark">기록하기</button>
</div> `

  $('#modal').append(temp_html)
}

function savedata() {
  let nickname = $('#save_nickname').val()
  let url = $('#basic-url').val()
  let type = $('#inputGroupSelect01').val()
  let desc = $('#save_desc').val()

  $.ajax({
    type: "POST",
    url: "/save_card",
    data: {
      url_give: url,
      type_give: type,
      desc_give: desc,
    },
    success: function (response) {
      alert(response['msg'])
      window.location.reload()
    }
  })
}