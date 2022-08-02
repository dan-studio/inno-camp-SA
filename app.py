import json
from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import certifi
from dotenv import load_dotenv
import os
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from time import sleep
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

@app.route("/blog", methods=["GET"])
def blog():
    all_card = list(db.cardlist.find({'type':'blog'},{'_id':False}))
    return render_template('blog.html', blog_card=all_card)

@app.route("/website", methods=["GET"])
def site():
    all_card = list(db.cardlist.find({'type':'website'},{'_id':False}))
    return render_template('website.html', site_card=all_card)

@app.route("/showcard", methods=["GET"])
def card_get():
    all_card = list(db.cardlist.find({},{'_id':False}))
    return jsonify({'all_card':all_card})

@app.route("/opencard", methods=["POST"])
def card_open():
    num_receive = request.form['num_give']
    user = db.cardlist.find_one({'num':int(num_receive)},{'_id':False})
    return jsonify({'select_card':user})

@app.route("/save_card", methods=["POST"])
def card_save():
    type_receive = request.form['type_give']
    url_receive = request.form['url_give']
    desc_receive = request.form['desc_give']

    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) ''Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')

    title = soup.select_one(f'meta[property="og:title"]')['content']
    image = soup.select_one(f'meta[property="og:image"]')['content']
    # desc = soup.select_one(f'meta[property="og:description"]')['content']

    cdlist = list(db.cardlist.find({}, {'_id': False}))
    count = len(cdlist) + 1

    doc = {
        'num': count,
        'title': title,
        'image': image,
        'desc': desc_receive,
        'type': type_receive,
    }
    db.cardlist.insert_one(doc)
    return jsonify({'msg': "저장완료"})

if __name__ == '__main__':
    app.run('0.0.0.0', PORT, debug=True)