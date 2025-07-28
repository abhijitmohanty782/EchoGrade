# model.py
import os

# External dependencies
import json
import re


# Torch and Transformers
import torch
import torch.nn.functional as F

# Langchain document/vector tools
from langchain_google_genai.embeddings import GoogleGenerativeAIEmbeddings

# Your internal modules
# from storage import get_master_answer, get_student_answers
# from core.model_instances import sbert_model, e5_tokenizer, e5_model, embedding_model, model_name
from core import model_instances
from core.extractors import extract_equations, process_extractions, normalize_equation
from core.evaluators import score_equations
from core.scorers import (
    calculate_sbert_similarity,
    calculate_e5_similarity,
    calculate_final_score,
)
from core.utils import replace_equations_with_descriptions
from core.feedback import generate_semantic_feedback

# sbert_model = model_instances.sbert_model
# e5_tokenizer = model_instances.e5_tokenizer
# e5_model = model_instances.e5_model
# embedding_model = model_instances.embedding_model
# model_name = model_instances.model_name

def get_models():
    return (
        model_instances.sbert_model,
        model_instances.e5_tokenizer,
        model_instances.e5_model,
        model_instances.embedding_model,
        model_instances.model_name or "gemini-1.5-flash"
    )

def fetch_answers_from_cosmos(question_id: str, user_id: str, master_container, student_container):
    # Fetch master answer (by question_id)
    master_query = f"SELECT * FROM c WHERE c.questionId = '{question_id}'"
    master_items = list(master_container.query_items(query=master_query, enable_cross_partition_query=True))
    if not master_items:
        return {"error": "❌ Master answer not found."}
    master_answer = master_items[0]["answerText"]

    # Fetch student answers (by question_id and user_id)
    student_query = (
        f"SELECT * FROM c WHERE c.questionId = '{question_id}' AND c.userId = '{user_id}'"
    )
    student_items = list(student_container.query_items(query=student_query, enable_cross_partition_query=True))
    if not student_items:
        return {"error": "❌ No student answers found for this user and question."}

    return {
        "master_answer": master_answer,
        "student_answers": student_items  # a list of dictionaries
    }


def analyze_question_from_db(question_id: str, user_id: str, master_container, student_container):
    
    # To call all models
    sbert_model, e5_tokenizer, e5_model, embedding_model, model_name = get_models()
    
    data = fetch_answers_from_cosmos(question_id, user_id, master_container, student_container)
    
    if "error" in data:
        return data

    master_answer = data["master_answer"]
    student_data = data["student_answers"]

    if not master_answer:
        return {"error": "❌ Master answer not found."}
    if not student_data:
        return {"error": "❌ No student answers found."}

    results = []

    for student_entry in student_data:
        student_id = student_entry["userId"]
        student_answer = student_entry["answerText"]

        # 1. Extract equations
        result = extract_equations(master_answer, student_answer, model_name)
        process_extractions(result["master_extractions"], normalize_equation)
        process_extractions(result["student_extractions"], normalize_equation)

        # 2. Equation scoring
        eq_score_result = score_equations(result["master_extractions"], result["student_extractions"], embedding_model)
        final_equation_score = eq_score_result["final_equation_score"]
        feedback_matrix = eq_score_result["feedback_matrix"]

        # 3. Replace equations with descriptions
        descriptive_master_text = replace_equations_with_descriptions(master_answer, result["master_extractions"])
        descriptive_student_text = replace_equations_with_descriptions(student_answer, result["student_extractions"])

        # 4. SBERT and E5 scores
        sbert_score = calculate_sbert_similarity(descriptive_master_text, descriptive_student_text, sbert_model)
        e5_score = calculate_e5_similarity(descriptive_master_text, descriptive_student_text, e5_tokenizer, e5_model)

        # 5. Final score
        final_score = calculate_final_score(final_equation_score, sbert_score, e5_score)

        # 6. Generate feedback
        feedback = generate_semantic_feedback(
            descriptive_master_text,
            descriptive_student_text,
            feedback_matrix,
            final_equation_score,
            sbert_score,
            e5_score,
            final_score,
            model_name
        )

        results.append({
            "student_id": student_id,
            "final_score": final_score,
            "feedback": feedback
        })

    return {
        "questionId": question_id,
        "results": results
    }
