import json
import random
import uuid
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .pipelines import pipeline

nlp = pipeline("e2e-qg")

def generate_fake_options(correct_answer, num_options=3):
    # This is a placeholder. In a real scenario, you'd want to generate more relevant fake options.
    fake_options = ["Option A", "Option B", "Option C", "Option D"]
    options = random.sample(fake_options, num_options - 1)
    options.append(correct_answer)
    random.shuffle(options)
    return options

@csrf_exempt
def question_gen_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            text = data.get('text', '')
            raw_questions = nlp(text)
            
            processed_questions = []
            for q in raw_questions:
                options = generate_fake_options(q)
                correct_index = options.index(q)
                
                question_data = {
                    "question": q,
                    "answerOptions": [
                        {"label": option, "uuid": str(uuid.uuid4())} for option in options
                    ],
                    "correct": correct_index
                }
                processed_questions.append(question_data)
            
            return JsonResponse({'questions': processed_questions})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
