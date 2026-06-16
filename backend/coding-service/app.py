from flask import Flask, request, jsonify
from flask_cors import CORS
from openai_client import client
from dotenv import load_dotenv
import os
from db import get_connection

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return {
        "service": "Coding Service",
        "status": "running"
    }

@app.route("/generate-question", methods=["POST"])
def generate_question():

    data = request.get_json()

    topic = data.get("topic")
    difficulty = data.get("difficulty")

    prompt = f"""
    Generate one coding interview question.

    Topic: {topic}
    Difficulty: {difficulty}

    Return:
    Title
    Problem Statement
    Input Format
    Output Format
    Constraints
    Example
    """

    response = client.chat.completions.create(
        model=os.getenv("MODEL_NAME"),
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    question = response.choices[0].message.content
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
    """
    INSERT INTO questions
    (topic, difficulty, question_text)
    VALUES (%s, %s, %s)
    """,
    (topic, difficulty, question)
    )

    conn.commit()

    question_id = cursor.lastrowid

    cursor.close()
    conn.close()

    return jsonify({
        "question_id": question_id,
        "topic": topic,
        "difficulty": difficulty,
        "question": question
    })

@app.route("/questions", methods=["GET"])
def get_questions():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM questions
        ORDER BY id DESC
    """)

    questions = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(questions)

@app.route("/questions/<int:question_id>", methods=["GET"])
def get_question(question_id):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT *
        FROM questions
        WHERE id=%s
        """,
        (question_id,)
    )

    question = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify(question)

if __name__ == "__main__":
    app.run(
    host="0.0.0.0",
    port=5001,
    debug=True
)