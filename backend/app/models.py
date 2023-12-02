from datetime import datetime

from . import db


#Diri ta mag initalize ug mga Database Models
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250))
    description = db.Column(db.Text)
    created_by = db.Column(db.String(250))
    created_date = db.Column(db.DateTime(timezone=True), default=datetime.now)
    updated_by = db.Column(db.String(250))
    updated_date = db.Column(db.DateTime(timezone=True))