import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Flask, request, jsonify, send_from_directory
from groq.groq_api import get_groq_response

app = Flask(__name__, static_folder='../frontend', static_url_path='')

@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    model = request.json.get('model', 'llama3-8b-8192')
    reply = get_groq_response(user_message, model)
    return jsonify({'reply': reply})

import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from flask import session, g
app.secret_key = 'supersecretkey'  # Needed for session

DATABASE = os.path.join(os.path.dirname(__file__), 'users.db')

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

def init_db():
    with app.app_context():
        db = get_db()
        db.execute('''CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )''')
        db.execute('''CREATE TABLE IF NOT EXISTS search_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            text TEXT NOT NULL,
            timestamp INTEGER NOT NULL
        )''')
        db.commit()

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password required.'}), 400
    db = get_db()
    cur = db.execute('SELECT id FROM users WHERE email = ?', (email,))
    if cur.fetchone():
        return jsonify({'success': False, 'message': 'User already exists.'}), 409
    password_hash = generate_password_hash(password)
    db.execute('INSERT INTO users (email, password_hash) VALUES (?, ?)', (email, password_hash))
    db.commit()
    return jsonify({'success': True, 'message': 'User registered successfully.'})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    db = get_db()
    cur = db.execute('SELECT password_hash FROM users WHERE email = ?', (email,))
    row = cur.fetchone()
    if not row or not check_password_hash(row[0], password):
        return jsonify({'success': False, 'message': 'Invalid email or password.'}), 401
    session['user'] = email
    return jsonify({'success': True, 'message': 'Login successful.'})

# Initialize the database on first run
init_db()

from datetime import datetime, timedelta

@app.route('/history', methods=['POST'])
def save_history():
    data = request.json
    email = data.get('email')
    text = data.get('text')
    timestamp = int(datetime.utcnow().timestamp())
    if not email or not text:
        return jsonify({'success': False, 'message': 'Email and text required.'}), 400
    db = get_db()
    db.execute('INSERT INTO search_history (user_email, text, timestamp) VALUES (?, ?, ?)', (email, text, timestamp))
    db.commit()
    return jsonify({'success': True})

@app.route('/history', methods=['GET'])
def get_history():
    email = request.args.get('email')
    if not email:
        return jsonify({'success': False, 'message': 'Email required.'}), 400
    db = get_db()
    ten_days_ago = int((datetime.utcnow() - timedelta(days=10)).timestamp())
    cur = db.execute('SELECT text, timestamp FROM search_history WHERE user_email = ? AND timestamp >= ? ORDER BY timestamp DESC', (email, ten_days_ago))
    history = [{'text': row[0], 'timestamp': row[1]} for row in cur.fetchall()]
    return jsonify({'success': True, 'history': history})

@app.route('/google-login')
def google_login():
    # Placeholder for Google OAuth logic
    return jsonify({'success': False, 'message': 'Google login not implemented.'}), 501

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
