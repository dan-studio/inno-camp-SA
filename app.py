from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import certifi
from dotenv import load_dotenv
import os

#load .env
load_dotenv()
DB = os.environ.get('DB')
PORT = os.environ.get('PORT')

#Flask App setup
app = Flask(__name__)

#DB
ca = certifi.where()
client = MongoClient('mongodb+srv://test:sparta@cluster0.f9qzdgi.mongodb.net/?retryWrites=true&w=majority')
db = client.incfwdb

@app.route('/')
def home():
    title = list(db.jungjin.find({}, {"_id": False}))
    return render_template('index.html', title=title)

@app.route('/signup', methods=["POST"])
def signup():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    
    account = list(db.account.find({}, {'_id': False}))
    count = len(account) + 1

    doc = {
      'index': count,
      'id': id_receive,
      'password': pw_receive
    }
    db.account.insert_one(doc)

    return jsonify({'msg': '회원가입이 완료되었습니다!'})

@app.route("/website", methods=["GET"])
def site():
    all_card = list(db.cardlist.find({'type':'website'},{'_id':False}))
    return render_template('website.html', site_card=all_card)

@app.route("/showcard", methods=["GET"])
def card_get():
    all_card = list(db.cardlist.find({},{'_id':False}))
    print(all_card)
    return jsonify({'all_card':all_card})

@app.route("/openmodal", methods=["POST"])
def card_open():
    num_receive = request.form['num_give']
    user = db.cardlist.find_one({'num':int(num_receive)},{'_id':False})
    return jsonify({'select_card':user})

@app.route("/save_card", methods=["POST"])
def card_save():
    short_title_receive = request.form['short_title_give']
    type_receive = request.form['type_give']
    url_receive = request.form['url_give']
    comment_receive = request.form['comment_give']

    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) ''Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')

    title = soup.select_one(f'meta[property="og:title"]')['content']
    image = soup.select_one(f'meta[property="og:image"]')['content']
    desc = soup.select_one(f'meta[property="og:description"]')['content']

    from random import uniform

    # Random float:  2.5 <= x <= 10.0
    number = int(uniform(1.0, 10.0)*10000000000)


    doc = {
        'short_title':short_title_receive,
        'title': title,
        'image': image,
        'desc': desc,
        'type': type_receive,
        'comment':comment_receive,
        'num':number
    }
    db.cardlist.insert_one(doc)
    return jsonify({'msg': "저장완료"})

@app.route('/search')
def search():
    return render_template("search.html")
    # writer_receive = request.form['writer_give']
    # results = list(db.jungjin.find({"title_name": title_receive}, {'_id': False}))

    # title_list = []
    # writer_list = []
    # response = []

    # # for result in results:
    # #     title_list.append(result['name'])
    # # price1 = list(db.test.find({}, {'_id': False}))
    # # for price in price1:
    # #     if writer_receive in price['menu']:
    # #         writer_list.append(price)
    # # for a in writer_list:
    # #     response.append(a['name'])

    # # final = list(set(title_list) & set(response))
    # # gu_name = []
    # # img = []
    # # for x in final:
    # #     r_final = list(db.test.find({'name': x}, {'_id': False}))
    # #     gu_name.append(r_final[0]['name'])
    # #     img.append(r_final[0]['img'])
    # # rr_final = dict(zip(gu_name, img))
    return jsonify({'msg' : '주문완료'})

if __name__ == '__main__':
  app.run('0.0.0.0', PORT, debug=True)