# Project EchoGrade 🤖✍️

An AI-powered assessment system designed to bring objectivity and scale to the grading of **Mathematical Proofs**.

---

## 🚀 Live Demo

**You can access the live application here:** [**https://echograde.onrender.com**](https://echograde.onrender.com)

---

## ✨ Visual Demo

![EchoGrade Demo GIF](./Public/demo.gif)

---

## 📖 About The Project

Grading mathematical proofs is a notoriously difficult task. It's time-consuming for educators, prone to subjectivity, and challenging to standardize across a large number of students. **Project EchoGrade** tackles this challenge head-on by providing an automated, multi-faceted evaluation system.

Currently implemented for the rigorous domain of **mathematical proofs**, EchoGrade dissects a student's submission and compares it against a master solution. It goes beyond simple keyword matching, analyzing both the structural correctness of the equations and the semantic coherence of the logical arguments. The final output is not just a score, but actionable feedback to foster genuine learning.

---

## 🛠️ How It Works

EchoGrade employs a sophisticated, four-stage pipeline to analyze and score each submission:

### 1. Equation Analysis with RAG
The process begins by isolating the mathematical backbone of the proof. A **Retrieval-Augmented Generation (RAG)** pipeline performs high-precision extraction of all formal equations and logical statements (e.g., $\forall x \in \mathbb{R}, x^2 \ge 0$) from both the student's submission and the master proof. These are then structurally compared to generate a foundational **Equation Score**, reflecting the mathematical accuracy.

### 2. Semantic Transformation
To enable a deeper linguistic understanding, the extracted equations are translated into a textual representation (e.g., *"For all x in the set of real numbers, x squared is greater than or equal to zero"*). This crucial step ensures that the core mathematical logic is preserved and can be analyzed as part of the overall textual narrative of the proof.

### 3. Dual-Model Semantic Similarity
With the proof converted into a rich textual format, we perform a deep semantic comparison using a robust, dual-model approach for comprehensive analysis:
* **SBERT**: A powerful model that excels at capturing sentence-level context and nuanced semantic relationships.
* **E5**: A state-of-the-art, instruction-tuned model that provides a second, diverse perspective on the text's meaning and structure.

By calculating the cosine similarity between the student's and master's embeddings from both models, we generate two distinct semantic scores. This dual analysis minimizes model-specific biases and ensures a more reliable evaluation.

### 4. Hybrid Scoring and Feedback Generation
The final step synthesizes all the collected data. A weighted algorithm intelligently combines the three calculated scores—the **Equation Score**, the **SBERT score**, and the **E5 score**—to produce a single, nuanced score out of 10. Simultaneously, the system analyzes the discrepancies found in each stage to generate targeted, constructive feedback, pointing the student toward specific areas of improvement in their logical reasoning and mathematical expression.

---

## ✨ Key Features

* 🎯 **Precision Scoring**: Moves beyond simple text comparison to evaluate the structural accuracy of mathematical formulas.
* 🧠 **Hybrid Intelligence**: Combines symbolic analysis (RAG for equations) with deep semantic analysis (SBERT & E5) for a holistic evaluation.
* 🔍 **Dual-Model Analysis**: Employs two distinct, state-of-the-art embedding models for a more robust and reliable semantic comparison.
* 💡 **Constructive Feedback**: Automatically generates targeted advice to help students understand their errors and improve their skills.
* scalable and **Extensible**: Designed to be scaled for large classrooms and extended to other technical subjects in the future.

---

## 💻 Technology Stack

* **Core Logic**: `Python`
* **NLP Models**: `RAG`, `SBERT`, `E5`
* **Database**: `CosmosDB`
* **API Framework**: `FastAPI`

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js and npm: [https://nodejs.org/](https://nodejs.org/)
* Python 3.8+ and pip: [https://www.python.org/](https://www.python.org/)

### Installation & Setup

1.  **Clone the repository**
    ```sh
    git clone [https://github.com/your-username/echograde.git](https://github.com/your-username/echograde.git)
    cd echograde
    ```

2.  **Set up the Backend** (Open a new terminal for this)
    ```sh
    # Navigate to the backend directory
    cd backend

    # Create and activate a virtual environment
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`

    # Install required Python packages
    pip install -r requirements.txt
    ```

3.  **Set up the Frontend** (Open another new terminal)
    ```sh
    # Navigate to the frontend directory
    cd frontend

    # Install npm packages
    npm install
    ```

### Running the Application

You need to have both the backend and frontend servers running simultaneously.

1.  **Start the Backend Server** (in the backend terminal)
    ```sh
    # Make sure you are in the 'backend' directory with the virtual environment active
    uvicorn main:app --reload
    ```
    Your backend API should now be running, typically at `http://127.0.0.1:8000`.

2.  **Start the Frontend Development Server** (in the frontend terminal)
    ```sh
    # Make sure you are in the 'frontend' directory
    npm run dev
    ```
    Your React application should now be running, typically at `http://localhost:5173`. You can open this URL in your browser to use the app.
