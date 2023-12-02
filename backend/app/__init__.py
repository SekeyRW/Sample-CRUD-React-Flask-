from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_socketio import SocketIO

db = SQLAlchemy()
socketio = SocketIO()
migrate = Migrate()
ma = Marshmallow()

def create_app():
    #initialize the App
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'Sample secret key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/dbname'

    db.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app, cors_allowed_origins="*")
    CORS(app)
    ma.init_app(app)

    #Import Views.py para magamit
    from .views import views
    app.register_blueprint(views, url_prefix='/api')

    #Automatic creation of tables in the database in mysql
    with app.app_context():
        db.create_all()

    return app