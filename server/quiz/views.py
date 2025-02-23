from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import random
import torch
import uuid
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer

# Initialize pipelines and models
qg_pipeline = pipeline("e2e-qg", model="valhalla/t5-base-e2e-qg")
qa_pipeline = pipeline("question-answering", model="deepset/roberta-base-squad2")
distractor_gen = pipeline("text2text-generation", model="google/flan-t5-base")
deberta_model = AutoModelForSequenceClassification.from_pretrained("microsoft/deberta-v3-large", num_labels=1)
deberta_tokenizer = AutoTokenizer.from_pretrained("microsoft/deberta-v3-large")

def generate_questions(transcription_text):
    """Generates questions from the input transcription."""
    return qg_pipeline(transcription_text)

def generate_answers(transcription_text, questions):
    """Generates answers for given questions."""
    return [(q, qa_pipeline(question=q, context=transcription_text)["answer"]) for q in questions]

def generate_distractors(correct_answer, question):
    """Generates incorrect but plausible distractors."""
    prompt = (
        f"Generate three incorrect but realistic answers for the question: '{question}'. "
        f"The correct answer is: '{correct_answer}'. "
        "Ensure the incorrect answers are contextually plausible but incorrect."
    )
    outputs = distractor_gen(prompt, max_length=50, num_return_sequences=5, do_sample=True)
    return list({output["generated_text"].strip() for output in outputs if output["generated_text"].strip().lower() != correct_answer.lower()})

def rank_distractors(correct_answer, distractors):
    """Ranks distractors using DeBERTa similarity scoring."""
    ranked = [(d, deberta_model(**deberta_tokenizer(correct_answer, d, return_tensors="pt", padding=True, truncation=True)).logits.item()) for d in distractors]
    return [d[0] for d in sorted(ranked, key=lambda x: x[1], reverse=False)[:3]]

def generate_mcqs(transcription_text):
    """Generates MCQs from the transcription."""
    questions = generate_questions(transcription_text)
    q_and_a = generate_answers(transcription_text, questions)
    mcqs = []
    for question, correct_answer in q_and_a:
        distractors = generate_distractors(correct_answer, question)
        ranked_distractors = rank_distractors(correct_answer, distractors) if distractors else []
        options = ranked_distractors + [correct_answer]
        random.shuffle(options)
        mcqs.append({
            "question": question,
            "answerOptions": [{"label": opt, "uuid": str(uuid.uuid4())} for opt in options],
            "correct": options.index(correct_answer)
        })
    return mcqs

@csrf_exempt
def mcq_endpoint(request):
    """Django API endpoint to generate MCQs from transcription text."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            if "transcription_text" not in data:
                return JsonResponse({"error": "Missing transcription_text field"}, status=400)
            mcqs = generate_mcqs(data["transcription_text"])
            return JsonResponse({"questions": mcqs})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)
