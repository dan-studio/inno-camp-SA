import json
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
    return render_template('index.html')

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



@app.route('/jungjin', methods=['GET'])
def search():
    return jsonify({'msg' : 'GET 연결 완료!'})
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