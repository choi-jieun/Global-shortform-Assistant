from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()  # .env의 OPENAI_API_KEY 자동으로 읽음

response = client.chat.completions.create(
    model="gpt-5.4-mini",
    messages=[
        {"role": "developer", "content": "너는 한국어 문장을 자연스러운 영어로 번역하는 번역가야. 번역 결과만 출력해."},
        {"role": "user", "content": "자, 지금부터 수술을 한번 해 보겠습니다."}
    ]
)

print(response.choices[0].message.content)