# Use an official lightweight Python image
FROM python:3.11-slim

# Set the working directory to /app
WORKDIR /app

# Install ffmpeg which yt-dlp might use for converting audio
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt .

# Install dependencies defined in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Expose port (Render/Railway use this to route traffic)
EXPOSE 8000

# Run the FastAPI application using Uvicorn
# We use the PORT environment variable if the host provides it, else default to 8000
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
