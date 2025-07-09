from flask import Flask, request, jsonify
from flask_cors import CORS
from questions import questions_by_level

app = Flask(__name__)
CORS(app)

level_map = {
    1: "pre-k",
    2: "kg",
    3: "grade-1",
    4: "grade-2",
    5: "grade-3",
    6: "grade-4",
    7: "grade-5",
    8: "grade-6",
    9: "grade-7",
    10: "grade-8",
    11: "grade-9",
    12: "grade-10",
    13: "grade-11",
    14: "grade-12",
    15: "college"
}


@app.route("/")
def home():
    return "Flask server is running! Available endpoints: /question and /answer"


@app.route("/question", methods=["GET"])
def get_question():
    level_num = int(request.args.get("level"))
    index = int(request.args.get("index", 0))
    level = level_map.get(level_num)

    print(">> FETCHING:", level_num, level, index)  # ✅ log untuk memastikan

    if level in questions_by_level and index < len(questions_by_level[level]):
        return jsonify({
            "question": questions_by_level[level][index]["question"],
            "questionNumber": index + 1,
            "image": questions_by_level[level][index].get("image", "")
        })

    return jsonify({"error": "No question found"}), 404


@app.route("/answer", methods=["POST"])
def check_answer():
    data = request.get_json()
    level_num = int(data.get("level"))
    level = level_map.get(level_num)

    index = int(data.get("index"))
    user_answer = data.get("answer")

    correct_answer = questions_by_level[level][index]["answer"]
    is_correct = float(user_answer) == float(correct_answer)

    if is_correct:
        return jsonify({"result": "correct"})
    else:
        return jsonify({
            "result": "wrong",
            "finalScore": index,  # atau bisa hitung pakai sistem kamu
            "highestLevel": level_num
        })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

