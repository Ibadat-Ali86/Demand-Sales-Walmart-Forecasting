# Stage 1: Build Frontend
# Use Node 20+ required by Vite 7
FROM node:20-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# Set VITE_API_URL to / so requests go to same origin (backend serves them)
ARG VITE_API_URL="/"
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Setup Backend
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libgobject-2.0-0 \
    libglib2.0-0 \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libffi-dev \
    libjpeg-dev \
    libopenjp2-7-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/app ./app

# Create models directory (no COPY — models are trained at runtime, not shipped)
RUN mkdir -p ./models

# Create data directory for SQLite database + runtime session storage.
# Using /data at root level so it persists and is always writable.
RUN mkdir -p /data && chmod 777 /data

# Copy frontend build to static directory
COPY --from=frontend-build /app/frontend/dist ./app/static

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=7860
# Point database to persistent /data volume
ENV DATABASE_URL="sqlite:////data/forecast.db"

# Expose port (Hugging Face Spaces default)
EXPOSE 7860

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
