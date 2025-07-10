from flask import Flask, request, jsonify
from flask_cors import CORS
import questions  # ✅ import module-nya dulu
print("[DEBUG] Using questions.py from:", questions.__file__)  # ✅ print path-nya
from questions import questions_by_level  # lalu ambil datanya
from fractions import Fraction


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
    print("[DEBUG] /question dipanggil")
    level_num = int(request.args.get("level"))
    level = level_map.get(level_num)
    index = int(request.args.get("index", 0))

    print(f"[DEBUG] Getting question: level={level_num} ({level}), index={index}")

    if level not in questions_by_level:
        print("[DEBUG] Level not found in questions_by_level.")
        return jsonify({
            "error": "Invalid level",
            "finalScore": index,
            "highestLevel": level_num
        }), 404

    questions = questions_by_level[level]

    if index < len(questions):
        question_entry = questions[index]  # ✅ define question_entry here
        return jsonify({
            "image": question_entry.get("image", ""),  # 👈 pakai key 'image' agar cocok dengan React
            "question": question_entry.get("question", ""),
            "questionNumber": index + 1
        })

    else:
        # Instead of error, return indicator to frontend to move to next level
        print("[DEBUG] End of questions for this level reached.")
        return jsonify({
            "error": "End of level",
            "finalScore": index,
            "highestLevel": level_num
        }), 200




@app.route("/answer", methods=["POST"])
def check_answer():
    data = request.get_json()
    level_num = int(data.get("level"))
    level = level_map.get(level_num)
    index = int(data.get("index"))

    user_answer_raw = str(data.get("answer")).strip()
    correct_answer_raw = str(questions_by_level[level][index]["answer"]).strip()

    print(f"[DEBUG] User input: '{user_answer_raw}', Correct answer: '{correct_answer_raw}'")

    try:
        # Gunakan Fraction agar bisa bandingkan angka seperti '16/35' atau hasil desimalnya
        user_frac = Fraction(user_answer_raw)
        correct_frac = Fraction(correct_answer_raw)
        is_correct = user_frac == correct_frac
    except (ValueError, ZeroDivisionError):
        # Fallback jika bukan angka/fraction yang valid
        is_correct = user_answer_raw.lower() == correct_answer_raw.lower()

    if is_correct:
        return jsonify({"result": "correct"})
    else:
        return jsonify({
            "result": "wrong",
            "finalScore": index,
            "highestLevel": level_num
        })



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
