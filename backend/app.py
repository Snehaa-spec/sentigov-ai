from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Comment, User
from nlp_pipeline import analyze_sentiment
import pandas as pd
import os
import io

app = Flask(__name__)
CORS(app)

# Configure SQLite DB
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'sentigov.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json
    text = data.get('text', '')
    if not text:
        return jsonify({"error": "No text provided"}), 400
        
    result = analyze_sentiment(text)
    
    # Save to db
    comment = Comment(
        text=text,
        sentiment=result['sentiment'],
        polarity=result['polarity'],
        subjectivity=result['subjectivity'],
        confidence=result['confidence'],
        source='manual'
    )
    db.session.add(comment)
    db.session.commit()
    
    return jsonify(result)

@app.route('/api/upload-csv', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file and file.filename.endswith('.csv'):
        # Read CSV
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        df = pd.read_csv(stream)
        
        # Find text column
        text_column = None
        for col in ['comment', 'text', 'feedback']:
            if col in df.columns.str.lower():
                text_column = df.columns[df.columns.str.lower() == col][0]
                break
                
        if not text_column:
            text_column = df.columns[0] # Fallback
            
        results = []
        for index, row in df.iterrows():
            text = str(row[text_column])
            if pd.isna(text) or text.strip() == '':
                continue
            
            res = analyze_sentiment(text)
            comment = Comment(
                text=text,
                sentiment=res['sentiment'],
                polarity=res['polarity'],
                subjectivity=res['subjectivity'],
                confidence=res['confidence'],
                source='csv'
            )
            db.session.add(comment)
            results.append(res)
            
        db.session.commit()
        return jsonify({"message": f"Successfully processed {len(results)} comments."})
        
    return jsonify({"error": "Invalid file format. Only CSV supported."}), 400

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if email == 'snehhaasharma7@gmail.com' and password == 'Sneha@xv34':
        return jsonify({
            "token": "sentigov-admin-token-777", 
            "role": "admin", 
            "message": "Login successful"
        })
    
    return jsonify({"error": "Invalid email or password"}), 401

@app.route('/api/dashboard-stats', methods=['GET'])
def dashboard_stats():
    total_comments = Comment.query.count()
    if total_comments == 0:
        return jsonify({
            "total": 0,
            "positive_percent": 0,
            "neutral_percent": 0,
            "negative_percent": 0,
            "accuracy_score": 0,
            "recent": []
        })
        
    pos = Comment.query.filter_by(sentiment='Positive').count()
    neu = Comment.query.filter_by(sentiment='Neutral').count()
    neg = Comment.query.filter_by(sentiment='Negative').count()
    
    recent_comments = Comment.query.order_by(Comment.id.desc()).limit(50).all()
    recent = [{
        "id": c.id,
        "text": c.text,
        "sentiment": c.sentiment,
        "polarity": c.polarity,
        "created_at": c.created_at.strftime('%Y-%m-%d %H:%M:%S')
    } for c in recent_comments]
    
    avg_confidence = db.session.query(db.func.avg(Comment.confidence)).scalar() or 0.85
    
    return jsonify({
        "total": total_comments,
        "positive_percent": round((pos / total_comments) * 100, 1),
        "neutral_percent": round((neu / total_comments) * 100, 1),
        "negative_percent": round((neg / total_comments) * 100, 1),
        "accuracy_score": round(avg_confidence * 100, 1),
        "recent": recent
    })

@app.route('/api/public-feed', methods=['GET'])
def public_feed():
    recent_comments = Comment.query.order_by(Comment.id.desc()).limit(100).all()
    feed = [{
        "id": c.id,
        "text": c.text,
        "sentiment": c.sentiment,
        "created_at": c.created_at.strftime('%Y-%m-%d %H:%M:%S')
    } for c in recent_comments]
    return jsonify(feed)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
