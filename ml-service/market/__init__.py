from flask import Flask,render_template
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SECRET_KEY'] = 'e2aefb0dd022beed666d5c60'
db = SQLAlchemy(app) #Initializing

from market import routes
from market import models