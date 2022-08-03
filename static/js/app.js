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

// 댓글 조회
$(document).ready(function () {
    getComments();
});

function getComments() {
    $.ajax({
        type: "GET",
        url: "/getComments",
        data: {},
        success: function (response) {
            // list에서 넘어온 str 값을 다시 dictionary 형식으로 변경

            let rows = JSON.parse(response['list'])

            for (let i = 0; i < rows.length; i++) {
                let comment = rows[i]['comments']
                let cid = rows[i]['_id']['$oid']

                // 게시물들의 cid와 cid 타입 확인
                // console.log(cid + ' // ' + typeof (cid))

                let temp_html = `
                    <article class="media">
                        <div class="media-content">
                            <div class="content">
                                <p>
                                    <strong>John Smith</strong> <small>@johnsmith</small>
                                    <br>
                                    ${comment}
                                </p>
                            </div>
                        </div>
                        <div class="media-right">
                            <button id="editBox" class="button is-small is-rounded" onclick="">수정</button>
                            <button id="editComBox" class="button is-small is-rounded is-hidden" onclick="">완료</button>
                            <button class="button is-small is-danger is-light is-rounded" onclick="delComments('${cid}')">삭제</button>
                        </div>
                    </article>
                `
                $('#commentsWrap').append(temp_html)
            }
        }
    })
}


// 댓글 삭제
function delComments(cid) {
    // console.log(cid)
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
    let comments = $('#comments').val()
    // let id = $('#id').val()
    // let cardId = $('#cardId').val()
    $.ajax({
        type: "POST",
        url: "/comments",
        data: {
            comments_give: comments,
            // id_give: id,
            // cardId_give: cardId
        },
        success: function (response) {
            alert(response["msg"])
            window.location.reload()
        }
    });
}
