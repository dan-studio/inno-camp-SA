function signup() {
	let id = $("#id").val();
	let pw = $("#pw").val();
	$.ajax({
		type: "POST",
		url: "/signup",
		data: {
			id_give: id,
			pw_give: pw,
		},
		success: function (response) {
			alert(response["msg"]);
			window.location.reload();
		},
	});
}
function show_card() {
	$.ajax({
		type: "GET",
		url: "/showcard",
		data: {},
		success: function (response) {
			let cardlist = response["all_card"];
			for (let i = 0; i < cardlist.length; i++) {
				let num = cardlist[i]["num"];
				let comment = cardlist[i]["comment"];
				let short_title = cardlist[i]["short_title"];
				let image = cardlist[i]["image"];
				let temp_html = `<div class="col">
                                            <div class="card h-100">
                                                <img src="${image}" class="card-img-top in_card_image" alt="사진 없습니다">
                                                <div class="card-body">
                                                    <h5 class="card-title" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="openmodal(${num})">${short_title}</h5>
                                                    <p class="card-text " data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="openmodal(${num})" id="show" >${comment}</p>
                                                </div>
                                            </div>
                                        </div>`;
				$("#card_list").append(temp_html);
			}
		},
	});
}

function search() {
	$("#card_list").empty();
	let word = $("#input-title").val();
	$.ajax({
		type: "GET",
		url: "/showcard",
		data: { short_title: word },
		success: function (response) {
			let cardlist = response["all_card"];
			console.log(cardlist);
			for (let i = 0; i < cardlist.length; i++) {
				let num = cardlist[i]["num"];
				let comment = cardlist[i]["comment"];
				let short_title = cardlist[i]["short_title"];
				let image = cardlist[i]["image"];
				let temp_html = `<div class="col">
                                            <div class="card h-100">
                                                <img src="${image}" class="card-img-top in_card_image" alt="사진 없습니다">
                                                <div class="card-body">
                                                    <h5 class="card-title" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="openmodal(${num})">${short_title}</h5>
                                                    <p class="card-text " data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="openmodal(${num})" id="show" >${comment}</p>
                                                </div>
                                            </div>
                                        </div>`;
				if (short_title.includes(word)) {
					$("#card_list").append(temp_html);
				}
			}
		},
	});
}

function openmodal(num) {
	$("#modal").empty();
	$.ajax({
		type: "POST",
		url: "/openmodal",
		data: { num_give: num },
		success: function (response) {
			let cardlist = response["select_card"];
			let num = cardlist["num"];
			let desc = cardlist["desc"];
			let title = cardlist["title"];
			let comment = cardlist["comment"];
			let url = cardlist["url"];
			let image = cardlist["image"];
			let temp_html = `<div>
                                  <img src="${image}" class="card-img-top in_modal_image" alt="![](../fav2.png)">
                                  <div class="card-body">${desc}</div>
                                  <div class="card-body">
                                    <h5 class="card-title">${title}</h5>
                                    <p class="card-text">${comment}</p>
                                    <a href="${url}" class="btn btn-primary" style="margin: auto">페이지로 이동</a>
                                  </div>
                                  <div><h3>댓글</h3>
                                  <hr>
                                  <ul>
                                  <li> </li>
                                    </ul>
                                  </div>
                                </div>`;

			$("#staticBackdropLabel").text(title);
			$("#modal").append(temp_html);
		},
	});
}

function savecard() {
	$("#modal").empty();
	let temp_html = `<div >
                        <div class="input-group mb-3">
                          <span class="input-group-text" id="basic-addon1">짧은 제목</span>
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
                              <textarea class="form-control" aria-label="With textarea" id="save_comment"></textarea>
                            </div>
                        <button onclick="savedata()" type="button" class="btn btn-dark">기록하기</button>
</div> `;

	$("#modal").append(temp_html);
}
function savedata() {
	let short_title = $("#save_nickname").val();
	let url = $("#basic-url").val();
	let type = $("#inputGroupSelect01").val();
	let comment = $("#save_comment").val();

	$.ajax({
		type: "POST",
		url: "/save_card",
		data: {
			short_title_give: short_title,
			url_give: url,
			type_give: type,
			comment_give: comment,
		},
		success: function (response) {
			alert(response["msg"]);
			window.location.reload();
		},
	});
}

// 페이진 네이션

let totalData
let dataPerPage
let PageCount = 5;
let globalCurrentPage = 1;

function paging(totalData, dataPerPage, currentPage) {
    console.log("currentPage : " currentPage);

    totalPage = Math.ceil(totalData / dataPerPage);
    if(totalPage < PageCount) {
        PageCount = totalPage;
    }

    let pageGroup = MAth.ceil(currentPage / pageCount)
    let last = pageGrop * pageCount;

    if(last > totalPage {
        last = totalPage
    })

    let first = last - (pageCount - 1)
    let next = last + 1
    let prev = first - 1

    let pageHtml = "";
    if (prev > 0) {
        pageHtml +=  "<li><a href='#' id='prev'> 이전 </a></li>"
    }
     //페이징 번호 표시 
  for (var i = first; i <= last; i++) {
    if (currentPage == i) {
      pageHtml +=
        "<li class='on'><a href='#' id='" + i + "'>" + i + "</a></li>";
    } else {
      pageHtml += "<li><a href='#' id='" + i + "'>" + i + "</a></li>";
    }
  }

  if (last < totalPage) {
    pageHtml += "<li><a href='#' id='next'> 다음 </a></li>";
  }

  $("#pagingul").html(pageHtml);
  let displayCount = "";
  displayCount = "현재 1 - " + totalPage + " 페이지 / " + totalData + "건";
  $("#displayCount").text(displayCount);


  //페이징 번호 클릭 이벤트 
  $("#pagingul li a").click(function () {
    let $id = $(this).attr("id");
    selectedPage = $(this).text();

    if ($id == "next") selectedPage = next;
    if ($id == "prev") selectedPage = prev;
    
    //전역변수에 선택한 페이지 번호를 담는다...
    globalCurrentPage = selectedPage;
    //페이징 표시 재호출
    paging(totalData, dataPerPage, pageCount, selectedPage);
    //글 목록 표시 재호출
    displayData(selectedPage, dataPerPage);
  });
}

