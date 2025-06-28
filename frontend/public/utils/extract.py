import json

def extract(meals):
    unique_areas = { meal.get('strCategory') for meal in meals if meal.get('strCategory') }
    return sorted(unique_areas)

if __name__ == '__main__':
    with open('meals.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    categories = extract(data)
    
    risultato = {
        "categories": categories,
    }
    
    print(json.dumps(risultato, ensure_ascii=False, indent=2))
