from flask import Flask, request, jsonify
from flask_cors import CORS
from questions import questions_by_level


app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Flask server is running! Available endpoints: /question and /answer"


@app.route("/question", methods=["GET"])
def get_question():
    level = request.args.get("level")
    index = int(request.args.get("index", 0))

    if level in questions_by_level and index < len(questions_by_level[level]):
        return jsonify({
            "question": questions_by_level[level][index]["question"],
            "index": index
        })
    return jsonify({"error": "No question found"}), 404

@app.route("/answer", methods=["POST"])
def check_answer():
    data = request.get_json()
    level = data.get("level")
    index = int(data.get("index"))
    user_answer = data.get("answer").strip()

    correct_answer = questions_by_level[level][index]["answer"]
    is_correct = user_answer == correct_answer

    return jsonify({"result": "correct" if is_correct else "wrong"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
