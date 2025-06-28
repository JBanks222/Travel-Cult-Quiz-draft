import json
from collections import Counter
from typing import List, Dict, Union

def analyze_travel_archetype(quiz_data: Dict, user_answers: List[Dict]) -> Dict:
    """
    Analyze user quiz answers to determine their primary travel archetype.
    
    Args:
        quiz_data: Dictionary containing quiz questions and archetypes
        user_answers: List of dictionaries with question_id and selected_option_text
    
    Returns:
        Dictionary with result archetype(s) and description(s)
    """
    
    # Archetype descriptions
    archetype_descriptions = {
        "Pathfinder": "You seek adventure, discovery, and the road less traveled. You're drawn to exploration and finding hidden gems.",
        "Connector": "You travel to build relationships and bridge cultures. You're a social butterfly who thrives on human connection.",
        "Time Traveler": "You're fascinated by history and culture. You travel to experience the past and understand how it shapes the present.",
        "Hedonist": "You travel for pleasure, comfort, and sensory experiences. You believe in treating yourself and enjoying life's luxuries.",
        "Digital Drifter": "You combine work and wanderlust. You're a modern nomad who can work from anywhere while exploring the world.",
        "Culture Hacker": "You dive deep into local cultures and languages. You want to understand and integrate into the places you visit.",
        "Escape Artist": "You travel to disconnect and find solitude. You seek peace and quiet away from the noise of everyday life.",
        "Luxe Nomad": "You travel in style and comfort. You appreciate the finer things in life and expect quality experiences.",
        "Local Whisperer": "You have an uncanny ability to find authentic local experiences. You know where the locals go and how to blend in.",
        "Chaos Pilot": "You embrace spontaneity and unpredictability. You thrive on the unknown and love the thrill of unplanned adventures.",
        "Spiritual Nomad": "You travel to recharge, reconnect, and rediscover your inner self. You seek meaning and personal growth.",
        "Builder": "You travel to create, contribute, and leave a positive impact. You want to build something meaningful and lasting."
    }
    
    # Count archetype selections
    archetype_counts = Counter()
    
    # Process each user answer
    for answer in user_answers:
        question_id = answer['question_id']
        selected_text = answer['selected_option_text']
        
        # Find the corresponding question
        for question in quiz_data['questions']:
            if question['id'] == question_id:
                # Find the selected option and get its archetype
                for option in question['options']:
                    if option['text'] == selected_text:
                        archetype_counts[option['archetype']] += 1
                        break
                break
    
    # Find the archetype(s) with the highest count
    if not archetype_counts:
        return {
            "result": ["No archetype determined"],
            "description": ["No answers provided"]
        }
    
    max_count = max(archetype_counts.values())
    primary_archetypes = [archetype for archetype, count in archetype_counts.items() if count == max_count]
    
    # Get descriptions for the primary archetype(s)
    descriptions = [archetype_descriptions[archetype] for archetype in primary_archetypes]
    
    return {
        "result": primary_archetypes,
        "description": descriptions
    }


# Example usage and test
if __name__ == "__main__":
    # Load quiz data
    with open('quiz.json', 'r') as f:
        quiz_data = json.load(f)
    
    # Example user answers
    example_answers = [
        {"question_id": 1, "selected_option_text": "I'm here to rest, reset, and journal"},
        {"question_id": 2, "selected_option_text": "I'm here to rest, reset, and journal"},
        {"question_id": 3, "selected_option_text": "Always bring a camera for moments & ruins"},
        {"question_id": 4, "selected_option_text": "A retreat where I can fully unplug"},
        {"question_id": 5, "selected_option_text": "Soft jazz and a glass of wine"},
        {"question_id": 6, "selected_option_text": "Crystals, essential oils, journal"},
        {"question_id": 7, "selected_option_text": "Go completely off-grid for a while"},
        {"question_id": 8, "selected_option_text": "Recharging in a place that heals."},
        {"question_id": 9, "selected_option_text": "Just me and my journal"},
        {"question_id": 10, "selected_option_text": "A mountain sunrise after a tough climb"},
        {"question_id": 11, "selected_option_text": "Find your purpose or deepen your practice"},
        {"question_id": 12, "selected_option_text": "Go somewhere with no cell signal"}
    ]
    
    result = analyze_travel_archetype(quiz_data, example_answers)
    print("Analysis Result:")
    print(json.dumps(result, indent=2)) 