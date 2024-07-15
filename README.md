# YouTube Video Summarizer and Key Concepts Extractor

This project aims to summarize YouTube videos, extract key concepts, and provide a list of 10 similar videos for further learning. It leverages the Gemini model, React for the front-end, and FastAPI for the back-end.

## Features

- **Summarize YouTube Videos**: Automatically generate summaries for YouTube videos.
- **Extract Key Concepts**: Identify and extract key concepts from the video content.
- **Similar Video Recommendations**: Get a list of 10 similar videos to explore the topic further.
- **User-Friendly Interface**: Intuitive and responsive UI built with React.
- **Fast and Scalable API**: Back-end API powered by FastAPI for quick and efficient data processing.

## Tech Stack

- **Frontend**: React
- **Backend**: FastAPI
- **Machine Learning Model**: Gemini model

## Getting Started

### Prerequisites

- Node.js
- Python 3.8+

### Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/AmineRaouane/Youtube_Summarizer.git
    ```

2. **Frontend Setup**:
    ```sh
    cd Frontend
    npm install
    npm run dev
    ```

3. **Backend Setup**:
    ```sh
    cd Backend
    uvicorn main:app --reload
    ```

4. **Running the Application**:
    - Open your browser and navigate to `http://localhost:5173` for the frontend.
    - The backend API will be running at `http://localhost:8000`.

### Usage

1. **Summarize a YouTube Video**:
    - Enter the YouTube video URL in the input field on the homepage.
    - Click on "generate".
    - The summary and key concepts will be displayed.
    - A list of 10 similar videos will be displayed.

### Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b my-new-feature`.
3. Commit your changes: `git commit -am 'Add some feature'`.
4. Push to the branch: `git push origin my-new-feature`.
5. Submit a pull request.


### Acknowledgments

- Special thanks to the developers of React, FastAPI, and the Gemini model.
- Thanks to all contributors and users who provide feedback and support.

