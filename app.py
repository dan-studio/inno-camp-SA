import json
from flask import Flask, render_template, request, jsonify

# mongoDB의 _id를 json화 시켜주기 위한 라이브러리
from bson.json_util import dumps
# String으로 형변환된 _id를 다시 ObjectId 형태로 바꾸기 위한 라이브러리
from bson import ObjectId

from pymongo import MongoClient
import certifi
from dotenv import load_dotenv
import os

# load .env
load_dotenv()
DB = os.environ.get('DB')
PORT = os.environ.get('PORT')

# Flask App setup
app = Flask(__name__)

# DB
ca = certifi.where()
client = MongoClient(DB, tlsCAFile=ca)
db = client.incfwdb


@app.route('/')
def home():
    return render_template('comments.html')


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


# 댓글 조회
@app.route('/getComments', methods=['GET'])
def getComments():
    comments_list = list(db.comments.find({}))

    # TypeError: Object of type ObjectId is not JSON serializable 에러를 해결하기 위해 dumps 사용
    return jsonify({'list': dumps(comments_list)})


# 댓글 삭제
@app.route('/delComments', methods=['POST'])
def delComments():
    cid_receive = request.form['cid_give']
    doc = {
        # str로 넘어온 cid값을 다시 ObjectId로 변환
        '_id': ObjectId(cid_receive)
    }
    db.comments.delete_one(doc)
    return jsonify({'msg': '삭제 완료!'})


# 댓글 작성
@app.route('/comments', methods=['POST'])
def comments():
    comments_receive = request.form['comments_give']

    # id_receive = request.form['id_give']
    # cardId_receive = request.form['cardId_give']

    doc = {
        'comments': comments_receive,
        # "id": id_receive
        # "cardId": cardId_receive
    }

    db.comments.insert_one(doc)
    return jsonify({'msg': '댓글 작성 완료!'})


# 댓글 수정
@app.route('/editComments', methods=['POST'])
def editComments():
    sample_receive = request.form['sample_give']
    return jsonify({'msg': 'POST 요청 완료!'})


if __name__ == '__main__':
    app.run('0.0.0.0', PORT, debug=True)
