import os
import requests
from typing import Optional, Tuple
from dotenv import load_dotenv

load_dotenv()

def weather_fetch(lat: float, lon: float) -> Optional[Tuple[float, int]]:
    """
    Fetch temperature (°C) and humidity (%) using OpenWeatherMap API with lat/lon.
    """
    api_key = os.getenv("OPENWEATHER_API_KEY")
    base_url = "https://api.openweathermap.org/data/2.5/weather"

    try:
        return api(base_url, lat, lon, api_key)
    except requests.exceptions.RequestException as e:
        print(f"Weather API error: {e}")
        return None


def api(base_url, lat, lon, api_key):
    response = requests.get(
        base_url,
        params={"lat": lat, "lon": lon, "appid": api_key, "units": "metric"},
        timeout=5
    )
    data = response.json()
    print('Weather Data: ', data)
    if response.status_code != 200:
        return None
    
    main_data = data.get("main", {})
    temperature = main_data.get("temp", 0)
    humidity = main_data.get("humidity", 0)
    return temperature, humidity
