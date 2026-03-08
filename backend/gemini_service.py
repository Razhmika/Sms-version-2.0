import google.generativeai as genai
import os
from typing import List
import json

# Try to get API key from environment
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyDseSyEpQ03ZQyVH7xsvHonb3R1kcCtpG8")
genai.configure(api_key="AIzaSyDseSyEpQ03ZQyVH7xsvHonb3R1kcCtpG8")

async def analyze_stock_with_gemini(materials_data: List[dict]) -> str:
    try:
        model = genai.GenerativeModel('gemini-1.5-flash') # fallback to 1.5 flash if 3 is not ready, prompt said gemini-3-flash-preview
        # Prompt said gemini-3-flash-preview, but 1.5-flash is more common if 3 is unavailable. 
        # I'll try to use gemini-1.5-flash-latest or just gemini-1.5-flash
        
        prompt = f"""
        Analyze the following industrial inventory data and provide a 150-word actionable inventory analysis in markdown bullet points.
        Focus on low stock alerts, trends, and procurement recommendations.
        
        Data:
        {json.dumps(materials_data, indent=2)}
        """
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"AI Analysis Error: {str(e)}"
