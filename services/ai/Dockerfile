# Use an official lightweight Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies (needed for some ML libraries)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
# We use --no-cache-dir to keep the image small
RUN pip install --no-cache-dir -r requirements.txt

# Download Spacy model (found in your filetree)
RUN python -m spacy download en_core_web_sm

# Copy the rest of the application code
COPY . .

# Expose the port Flask runs on (default 5000)
EXPOSE 5000

# Command to run the app
# (We point to the server_setup module seen in your filetree)
CMD ["python", "-m", "server_setup.ml_score_api"]