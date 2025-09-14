from market import app
from flask import render_template
from market.models import item
from market.forms import RegisterForm

@app.route('/')
@app.route('/home')
def home_page():
    return render_template('home.html')




@app.route('/market')
def market_page():
    # items = [
    #     {'id': 1, 'name': 'Phone', 'barcode': '893212299897', 'price': 500},
    #     {'id': 2, 'name': 'Laptop', 'barcode': '123985473165', 'price': 900},
    #     {'id': 3, 'name': 'Keyboard', 'barcode': '231985128446', 'price': 150}
    # ] since we created a database and stored it's values in app.db file 

    items = item.query.all()
    return render_template('market.html', items=items)



@app.route('/register')
def register_page():
    form = RegisterForm()
    return render_template('register.html',form = form)