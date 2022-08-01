import json
from flask import Flask, render_template, request, jsonify
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

@app.route("/showcard", methods=["GET"])
def card_get():
    all_card = list(db.cardlist.find({},{'_id':False}))
    return jsonify({'all_card':all_card})

@app.route("/opencard", methods=["GET"])
def card_open():
    num_receive = request.form['num_give']
    user = db.users.find_one({'num':num_receive},{'_id':False})
    return jsonify({'open_card':user})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)