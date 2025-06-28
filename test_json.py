import json

try:
    with open('quiz.json', 'r', encoding='utf-8') as f:
        content = f.read()
        print("File content length:", len(content))
        print("First 100 characters:", repr(content[:100]))
        
        quiz_data = json.loads(content)
        print("JSON parsed successfully!")
        print("Number of questions:", len(quiz_data['questions']))
        print("Number of archetypes:", len(quiz_data['archetypes']))
        
except Exception as e:
    print(f"Error: {e}")
    print(f"Error type: {type(e)}") 