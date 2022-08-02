import json
from flask import Flask, render_template, jsonify, request, session, redirect, url_for

app = Flask(__name__)

from pymongo import MongoClient

from dotenv import load_dotenv
import os
#load .env
load_dotenv()
DB = os.environ.get('DB')
PORT = os.environ.get('PORT')
SECRET_KEY = os.environ.get('SECRET_KEY')

import certifi
ca = certifi.where()
client = MongoClient(DB,tlsCAFile=ca)
db = client.incfwdb





# JWT 패키지를 사용합니다. (설치해야할 패키지 이름: PyJWT)
import jwt

# 토큰에 만료시간을 줘야하기 때문에, datetime 모듈도 사용합니다.
import datetime

# 회원가입 시엔, 비밀번호를 암호화하여 DB에 저장해두는 게 좋습니다.
# 그렇지 않으면, 개발자(=나)가 회원들의 비밀번호를 볼 수 있으니까요.^^;
import hashlib

@app.route('/')
def home():
  token_receive = request.cookies.get('mytoken')
  try:
    payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
    user_info = db.account.find_one({'id': payload['id']})
    return render_template('sidenav.html', username=user_info['username'])
  except jwt.ExpiredSignatureError:
    return redirect(url_for('login', msg='로그인 시간이 만료되었습니다.'))
  except jwt.exceptions.DecodeError:
    return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))
  
@app.route('/login')
def login():
  msg = request.args.get('msg')
  return render_template('login.html', msg=msg)

#회원가입
@app.route('/api/signup', methods=["POST"])
def api_signup():
    username_receive = request.form['username_give']
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

    doc = {
      'username': username_receive,
      'id':id_receive, 
      'pw':pw_hash
    }

    db.account.insert_one(doc)

    # account = list(db.account.find({}, {'_id': False}))
    # count = len(account) + 1

    return jsonify({'result': '회원가입 완료!'})

#로그인
@app.route('/api/signin', methods=["POST"])
def api_signin():
  id_receive = request.form['id_give']
  pw_receive = request.form['pw_give']

  pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
  result = db.account.find_one({'id': id_receive, 'pw': pw_hash})

  if result is not None:
    payload = {
      'id': id_receive,
      'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=10)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    return jsonify({'result': 'success', 'token': token})
  else:
    return jsonify({'result': 'fail', 'msg': '아이디 또는 비밀번호가 일치하지 않습니다.'})


#유저정보확인API
@app.route('/api/user', methods=['GET'])
def api_valid():
  token_receive = request.cookies.get('mytoken')

  try:
    payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
    print(payload)

    userinfo = db.account.find_one({'id': payload['id']}, {'_id':0})
    return jsonify({'result': 'success', 'username': userinfo['username']})
  except jwt.ExpiredSignatureError:
    return jsonify({'result': 'fail', 'msg': '로그인 시간이 만료되었습니다.'})
  except jwt.exceptions.DecodeError:
    return jsonify({'result': 'fail', 'msg': '로그인 정보가 존재하지 않습니다.'})

#아이디중복확인
@app.route('/api/signup/checkid', methods=['POST'])
def checkid():
  id_receive = request.form['id_give']
  exists = bool(db.account.find_one({'id': id_receive}))
  return jsonify({'result': 'success', 'exists': exists})

if __name__ == '__main__':
  app.run('0.0.0.0', PORT, debug=True)