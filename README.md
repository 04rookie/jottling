# QuizzBee

## Upload your class transcripts and generate questions to test your understandings!!

## Installation
- Frontend
````
npm i
npm run dev
````
- Backend
````
pip install -r requirements.txt
python manage.py runserver
````

## Models used.
- microsoft/deberta-v3-large (Making sure fake answers are relevant)
- deepset/roberta-base-squad2 (Generating correct answers)
- google/flan-t5-base (Generating fake answer)
- valhalla/t5-base-e2e-qg (Generating questions)
