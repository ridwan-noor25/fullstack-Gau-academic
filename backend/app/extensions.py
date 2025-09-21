# # app/extensions.py
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
# from flask_jwt_extended import JWTManager

# db = SQLAlchemy()
# migrate = Migrate()
# jwt = JWTManager()


# # app/extensions.py
# from flask_sqlalchemy import SQLAlchemy
# from flask_jwt_extended import JWTManager
# from flask_migrate import Migrate

# db = SQLAlchemy()
# jwt = JWTManager()
# migrate = Migrate()



# from flask_sqlalchemy import SQLAlchemy
# from flask_jwt_extended import JWTManager
# from flask_migrate import Migrate
# from flask_mailman import Mail 

# db = SQLAlchemy()
# jwt = JWTManager()
# migrate = Migrate()
# mail = Mail()  # ✅ Added



# app/extensions.py
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mailman import Mail
from dotenv import load_dotenv
import os

# Load .env
load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()
mail = Mail()   # ✅ Flask-Mailman
cors = CORS()

def init_extensions(app):
    """Initialize all extensions with the Flask app."""

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    mail.init_app(app)

    # ✅ Gmail SMTP Config (from .env)
    app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    app.config["MAIL_PORT"] = int(os.getenv("MAIL_PORT", 587))
    app.config["MAIL_USE_TLS"] = os.getenv("MAIL_USE_TLS", "True") == "True"
    app.config["MAIL_USE_SSL"] = os.getenv("MAIL_USE_SSL", "False") == "True"
    app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")  # your Gmail
    app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")  # app password
    app.config["DEFAULT_FROM_EMAIL"] = app.config["MAIL_USERNAME"]

    print("📧 Mail configured for:", app.config["MAIL_USERNAME"])
