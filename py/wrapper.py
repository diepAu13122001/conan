from bs4 import BeautifulSoup
import json
import requests
from datetime import datetime

url = "https://filmepe.net/tham-tu-lung-danh-conan-tap-1-vietsub-275978/"
response = requests.get(url)

soup = BeautifulSoup(response.text, 'html.parser')

links = {
    a.text.strip(): a.get("href")
    for a in soup.find_all('a', class_="single-episodes-child")
}

data = {
    "updated": str(datetime.now()),
    "links": links
}

# Save to local file
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ Episode links saved to data.json")


