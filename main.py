import requests
import base64
from PIL import Image
from io import BytesIO

model_name = "model name goes here"

image_path = '1710009654635280.jpg'

with open(image_path, 'rb') as image_file:
    image = Image.open(image_file)
    image = image.convert("RGB")
    buffered = BytesIO()
    image.save(buffered, format="JPEG")

image_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
payload = {
    "image": image_base64
}

url = "http://localhost:5100/api/caption"

response = requests.post(url, json=payload)

if response.status_code == 200:
    print("Caption:", response.json()["caption"])
else:
    print("Error:", response.status_code, response.text)

