from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:sparta@cluster0.f9qzdgi.mongodb.net/?retryWrites=true&w=majority')
db = client.incfwdb


doc = {
    'title' : '자바스크립트 꿀팁',
    'writer' : '오정진'
}

db.jungjin.insert_one(doc)