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
import socket
from dotenv import load_dotenv
from app import create_app

load_dotenv()

app = create_app()


def find_free_port(start_port=5000, max_port=5100):
    """Find the first free port in the range [start_port, max_port]."""
    for port in range(start_port, max_port + 1):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("0.0.0.0", port))
                return port
            except OSError:
                continue
    raise OSError("No free ports available in range 5000–5100")


if __name__ == "__main__":
    # Prefer env PORT, fallback to auto-detect
    env_port = os.getenv("PORT")
    if env_port and env_port.isdigit():
        port = int(env_port)
    else:
        port = find_free_port(5000, 5100)

    print(f"Starting server on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
