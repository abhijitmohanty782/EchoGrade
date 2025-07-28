from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from contextlib import asynccontextmanager
from typing import List
from azure.cosmos import CosmosClient
from core.model import analyze_question_from_db  # ✅ Import from model.py

from core import model_instances

from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModel

import os


from dotenv import load_dotenv
load_dotenv()


# Google API key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
# Cosmos DB config
COSMOS_ENDPOINT = os.getenv("COSMOS_ENDPOINT")
COSMOS_KEY = os.getenv("COSMOS_KEY")
DATABASE_NAME = "tutor"
MASTER_CONTAINER_NAME = "masteranswer"
STUDENT_CONTAINER_NAME = "studentanswer"

# Define the lifespan context for app startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # ✅ Load ML models once on startup
    print("🚀 App lifespan starting — initializing models")
    model_instances.sbert_model = SentenceTransformer('all-MiniLM-L6-v2')
    model_instances.e5_tokenizer = AutoTokenizer.from_pretrained("intfloat/e5-large-v2")
    model_instances.e5_model = AutoModel.from_pretrained("intfloat/e5-large-v2")
    
    model_instances.model_name = "gemini-1.5-flash"
    model_instances.embedding_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    print("🧪 DEBUG — sbert_model:", model_instances.sbert_model)
    print("🧪 DEBUG — e5_model:", model_instances.e5_model)
    print("🧪 DEBUG — embedding_model:", model_instances.embedding_model)
    print("🧪 DEBUG — model_name:", model_instances.model_name)
    
    # ✅ Initialize Cosmos DB clients
    cosmos_client = CosmosClient(COSMOS_ENDPOINT, COSMOS_KEY)
    database = cosmos_client.get_database_client(DATABASE_NAME)
    app.state.master_container = database.get_container_client(MASTER_CONTAINER_NAME)
    app.state.student_container = database.get_container_client(STUDENT_CONTAINER_NAME)

    print("✅ Models and Cosmos DB containers initialized.")
    yield
    print("🧹 Application shutdown cleanup complete.")


# Create FastAPI app with lifespan handler
app = FastAPI(
    title="Answer Storage API",
    version="1.0",
    description="API to analyze student and master answers",
    lifespan=lifespan
)

# Request schema
class StudentAnswer(BaseModel):
    student_id: str
    answer_text: str

class AnswerUploadRequest(BaseModel):
    questionId: str
    master_answer: str
    student_answers: List[StudentAnswer]

@app.get("/")
def root():
    return {"status": "✅ FastAPI on Azure is working!"}

# ✅ GET endpoint to analyze and generate feedback
@app.get("/analyze/{question_id}/{user_id}")
def run_analysis_from_db(question_id: str, user_id: str):
    try:
        result = analyze_question_from_db(
            question_id,
            user_id,
            master_container=app.state.master_container,
            student_container=app.state.student_container
        )
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

