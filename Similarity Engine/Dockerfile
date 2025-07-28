# Use slim Python image
FROM python:3.10-slim

# Set environment variables to prevent .pyc files and ensure UTF-8
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV LANG=C.UTF-8

# Set working directory
WORKDIR /app

# Install system dependencies (optional but sometimes needed for numpy/torch)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN adduser --disabled-password fastapiuser

# Copy requirements first (for caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Give app directory ownership to non-root user
RUN chown -R fastapiuser:fastapiuser /app

# Switch to non-root user
USER fastapiuser

# Expose FastAPI port
EXPOSE 8000

# Use gunicorn for production (recommended)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

