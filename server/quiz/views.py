from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import sys
import os
from .pipelines import pipeline

nlp = pipeline("e2e-qg")

@csrf_exempt
def question_gen_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            text = data.get('text', '')
            questions = nlp(text)
            return JsonResponse({'questions': questions})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
