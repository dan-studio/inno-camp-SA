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
                let temp_html = `<div class="col">
                                            <div class="card h-100">
                                                <img src="" class="card-img-top in_card_image" alt="...">
                                                <div class="card-body">
                                                    <h5 class="card-title"><a href="${url}">${title}</a></h5>
                                                    <p class="card-text" id="show" onclick="openpop(${num})">${desc}</p>
                                                </div>
                                            </div>
                                        </div>`

                $('#card_list').append(temp_html)
            }
        }
    })
}
document.querySelector("#show").addEventListener("click", openpop(num));
document.querySelector("#close").addEventListener("click", close);
function openpop(num) {
  document.querySelector(".background").className = "background show";

    $.ajax({
        type: "GET",
        url: "/opencard",
        data: {num_give:num},
        success: function (response) {
            let cardlist = response['open_card']
            let title = cardlist['title']
            let desc = cardlist['desc']
            let url = cardlist['url']
            let temp_html = ` <div class="modal-dialog modal-fullscreen-sm-down">
                                  ...
                                </div>`

            $('#popup_w').append(temp_html)
        }
    })


}
var myModal = document.getElementById('myModal')
var myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', function () {
  myInput.focus()
})