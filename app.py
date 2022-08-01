from flask import Flask, render_template
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
client = MongoClient(DB,tlsCAFile=ca)
db = client.incfwdb

@app.route('/')
def home():
    return render_template('index.html')
    
if __name__ == '__main__':
  app.run('0.0.0.0', PORT, debug=True)