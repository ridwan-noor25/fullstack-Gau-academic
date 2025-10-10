# import os
# from flask import Flask, jsonify
# from flask_cors import CORS
# from app.models import db
# from app.routes import api_bp

# def create_app():
#     app = Flask(__name__)

#     # Secret + DB path
#     app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret")
#     basedir = os.path.abspath(os.path.dirname(__file__))
#     instance_dir = os.path.join(basedir, "instance")
#     os.makedirs(instance_dir, exist_ok=True)
#     db_path = os.path.join(instance_dir, "gau.db")
#     app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
#     app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

#     # CORS for Vite dev server
#     CORS(
#         app,
#         resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
#     )

#     # Init DB & auto-create tables if missing
#     db.init_app(app)
#     with app.app_context():
#         db.create_all()

#     # Blueprints
#     app.register_blueprint(api_bp)

#     @app.get("/")
#     def index():
#         return jsonify({"message": "GAU Backend running"})

#     return app

# app = create_app()

# if __name__ == "__main__":
#     app.run(debug=True)



# # run.py
# import os
# from dotenv import load_dotenv
# from app import create_app

# load_dotenv()

# app = create_app()


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=True)



# run.py
import os
from dotenv import load_dotenv
from app import create_app

load_dotenv()

app = create_app()

if __name__ == "__main__":
    # Use fixed port 5001
    port = 5001
    print(f"Starting server on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
