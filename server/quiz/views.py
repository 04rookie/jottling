import random
import uuid
import torch
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.utils.decorators import method_decorator
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
from .pipelines import pipeline as qg_pipeline  # Import from your local pipeline file

qg = qg_pipeline("e2e-qg", model="valhalla/t5-base-e2e-qg")
distractor_gen = pipeline("text2text-generation", model="google/flan-t5-base")
qa = pipeline("question-answering", model="deepset/roberta-base-squad2")
deberta_model = AutoModelForSequenceClassification.from_pretrained("microsoft/deberta-v3-large", num_labels=1)
deberta_tokenizer = AutoTokenizer.from_pretrained("microsoft/deberta-v3-large")


@csrf_exempt
@require_POST
def generate_mcqs(request):
    """
    Django view to generate MCQs from a given transcription text.
    Accepts POST request with 'transcription_text' in JSON format.
    """
    try:
        data = json.loads(request.body)
        transcription_text = data.get("text")
        # print(data,transcription_text)

        if not transcription_text:
            return JsonResponse({"error": "Missing transcription_text in request"}, status=400)

        # Step 1: Generate questions
        questions = generate_questions(transcription_text)

        # Step 2: Generate answers
        questions_with_answers = generate_answers(transcription_text, questions)

        # Step 3: Generate MCQs
        mcqs = generate_distractors_and_mcqs(transcription_text, questions_with_answers)

        return JsonResponse({"questions": mcqs}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def generate_questions(transcription_text):
    """Generates questions from transcription using T5-based model."""
    # qg = qg_pipeline("e2e-qg", model="valhalla/t5-base-e2e-qg")
    return qg(transcription_text)


def generate_answers(transcription_text, questions):
    """Extracts answers using QA pipeline."""
    # qa = pipeline("question-answering", model="deepset/roberta-base-squad2")
    return [(q, qa(question=q, context=transcription_text)["answer"]) for q in questions]


def generate_distractors_and_mcqs(transcription_text, questions_with_answers):
    """Generates MCQs with distractors using FLAN-T5 and DeBERTa ranking."""
    # distractor_gen = pipeline("text2text-generation", model="google/flan-t5-base")
    # deberta_model = AutoModelForSequenceClassification.from_pretrained("microsoft/deberta-v3-large", num_labels=1)
    # deberta_tokenizer = AutoTokenizer.from_pretrained("microsoft/deberta-v3-large")

    def generate_distractors(correct_answer, question):
        """Generates incorrect but plausible answer options."""
        prompt = (
            f"Generate three incorrect but realistic answers for the following question: '{question}'. "
            f"The correct answer is: '{correct_answer}'. "
            "Ensure the incorrect answers are contextually plausible but incorrect."
        )
        distractors = set()
        try:
            outputs = distractor_gen(prompt, max_length=50, num_return_sequences=5, do_sample=True)
            for output in outputs:
                gen_text = output["generated_text"].strip()
                if gen_text and gen_text.lower() != correct_answer.lower():
                    distractors.add(gen_text)
        except Exception as e:
            print(f"Error generating distractors: {e}")
        return list(distractors)

    def rank_distractors(correct_answer, distractors):
        """Ranks distractors using DeBERTa."""
        ranked = []
        for d in distractors:
            inputs = deberta_tokenizer(correct_answer, d, return_tensors="pt", padding=True, truncation=True)
            with torch.no_grad():
                score = deberta_model(**inputs).logits.item()
            ranked.append((d, score))
        ranked.sort(key=lambda x: x[1], reverse=False)  # Lower score means better distractor
        return [d[0] for d in ranked[:3]]

    # Construct MCQs
    mcq_list = []
    for question, correct_answer in questions_with_answers:
        distractors = generate_distractors(correct_answer, question)
        ranked_distractors = rank_distractors(correct_answer, distractors) if len(distractors) >= 3 else distractors
        options = ranked_distractors + [correct_answer]
        random.shuffle(options)

        # Format in required JSON structure
        mcq_list.append({
            "question": question,
            "answerOptions": [{"label": opt, "uuid": str(uuid.uuid4())} for opt in options],
            "correct": options.index(correct_answer)
        })

    return mcq_list
