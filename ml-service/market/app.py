# this file is OF NO NEED AS THEY ARE BEEN SPLIT INTO SEPARATE FILES



# from flask import Flask,render_template
# from flask_sqlalchemy import SQLAlchemy
# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
# db = SQLAlchemy(app) #Initializing


# class item(db.Model):   --------> MOVED TO MODELS.PY FILE 
#     id = db.Column(db.Integer(),primary_key = True)
#     name = db.Column(db.String(length=30),nullable=False,unique=True)
#     price = db.Column(db.Integer(), nullable=False)
#     barcode = db.Column(db.String(length=12),nullable = False, unique = True)
#     description = db.Column(db.String(length=1024),nullable=False,unique=True)


#converting models to databases is called : MODELS

# @app.route('/') # DECORATORS
# def hello_world():
#     return '<h1> hello world </h1>'


#DYNAMIC ROUTES
# @app.route('/about/<username>')
# def about_page(username):
#     return f'<h1>About us page. {username}</h1>'




# ------------> ALL ROUTES ARE MOVED TO THE ROUTES.PY FILE FOR FILE STRUCTURING
# @app.route('/')
# @app.route('/home')
# def home_page():
#     return render_template('home.html')




# @app.route('/market')
# def market_page():
#     # items = [
#     #     {'id': 1, 'name': 'Phone', 'barcode': '893212299897', 'price': 500},
#     #     {'id': 2, 'name': 'Laptop', 'barcode': '123985473165', 'price': 900},
#     #     {'id': 3, 'name': 'Keyboard', 'barcode': '231985128446', 'price': 150}
#     # ] since we created a database and stored it's values in app.db file 

#     items = item.query.all()
#     return render_template('market.html', items=items)
