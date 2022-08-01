$(document).ready(function () {
    show_card();

});


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
                let image =cardlist[i]['image']
                let temp_html = `<div class="col">
                                            <div class="card h-100">
                                                <img src="${image}" class="card-img-top in_card_image" alt="...">
                                                <div class="card-body">
                                                    <h5 class="card-title"><a href="${url}">${title}</a></h5>
                                                    <p class="card-text " data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="openpop(${num})" id="show" >${desc}</p>
                                                    <button  > 자세히알아보기</button>
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
        data: {num_give:num},
        success: function (response) {
            let cardlist = response['select_card']
            let num = cardlist['num']
            let title = cardlist['title']
            let desc = cardlist['desc']
            let url = cardlist['url']
            let image =cardlist['image']
            let temp_html = `<div>
                                <h1>${title}</h1>
                                <h2>${desc}</h2>
                                </div>`

            $('#staticBackdropLabel').text(title)
            $('#modal').append(temp_html)
        }
    })


}
