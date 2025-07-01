from flask import Flask, request, jsonify
from flask_cors import CORS
from questions import QUESTIONS  # import your saved questions

app = Flask(__name__)
CORS(app)

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "pong"})

@app.route('/question', methods=['GET'])
def get_question():
    level = int(request.args.get('level'))
    index = int(request.args.get('index'))

    level_questions = QUESTIONS.get(level, [])
    if index >= len(level_questions):
        return jsonify({"error": "No more questions at this level"}), 404

    question = level_questions[index]
    return jsonify({"question": question['question'], "questionNumber": index + 1})

@app.route('/answer', methods=['POST'])
def check_answer():
    data = request.get_json()
    level = data.get('level')
    index = data.get('index')
    user_answer = data.get('answer')

    correct_answer = QUESTIONS[level][index]['answer']
    if str(user_answer).strip() == str(correct_answer).strip():
        return jsonify({"result": "correct"})
    else:
        return jsonify({
            "result": "wrong",
            "finalScore": f"{level - 1} (or last completed level)",
            "highestLevel": f"Grade {level - 1 if level > 1 else 'Pre-K'}"
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
