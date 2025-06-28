import json
from archetype_analyzer import analyze_travel_archetype

def main():
    # Load quiz data
    with open('quiz.json', 'r', encoding='utf-8') as f:
        quiz_data = json.load(f)

    user_answers = []
    print("Welcome to the Travel Archetype Quiz!\n")

    for question in quiz_data['questions']:
        print(f"Q{question['id']}: {question['question']}")
        for idx, option in enumerate(question['options'], 1):
            print(f"  {idx}. {option['text']}")
        while True:
            try:
                choice = int(input("Your choice (number): "))
                if 1 <= choice <= len(question['options']):
                    selected_option = question['options'][choice - 1]['text']
                    user_answers.append({
                        'question_id': question['id'],
                        'selected_option_text': selected_option
                    })
                    break
                else:
                    print(f"Please enter a number between 1 and {len(question['options'])}.")
            except ValueError:
                print("Invalid input. Please enter a number.")
        print()

    # Analyze results
    result = analyze_travel_archetype(quiz_data, user_answers)
    print("\nYour Travel Archetype Result:")
    for archetype, desc in zip(result['result'], result['description']):
        print(f"- {archetype}: {desc}")

if __name__ == "__main__":
    main() 