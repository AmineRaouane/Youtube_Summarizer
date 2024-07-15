from fastapi import FastAPI
from pydantic import BaseModel,HttpUrl
from fastapi.middleware.cors import CORSMiddleware
from services.genai import YoutubeProcessor,GeminiProcessor
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "services/Project.json"

class Video_Analysis(BaseModel):
    youtube_url : HttpUrl


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Generative_model = GeminiProcessor()

@app.post("/analyse_video")
def analyse_video(request:Video_Analysis):

    Processor = YoutubeProcessor(Generative_model)
    result = Processor.get_docs(str(request.youtube_url),verbose=True)
    Key_Concepts = Processor.find_key_concepts(result,verbose=True)
    Summary = Processor.get_summary(result)
    Similar_videos = Processor.get_similar_videos(result[0].metadata.get("title"))
    Data = [{'url' : f"https://www.youtube.com/watch?v={item['id']['videoId']}",
             'title' : item['snippet']['title'],
             'publishTime' : item['snippet']['publishTime']
             } for item in Similar_videos]
    return {
        "Key_Concepts":Key_Concepts,
        "Info":result[0].metadata,
        "Summary":Summary,
        "Similar_videos":Data
    }

KEY = {
      "kind": "youtube#searchResult",
      "etag": "U0cFO4Sncq-OL574sYDPU4ZrEVM",
      "id": {
        "kind": "youtube#video",
        "videoId": "x7X9w_GIm1s"
      },
      "snippet": {
        "publishedAt": "2021-10-25T15:19:28Z",
        "channelId": "UCsBjURrPoezykLs9EqgamOA",
        "title": "Python in 100 Seconds",
        "description": "Python is arguably the world's most popular programming language. It is easy to learn, yet suitable in professional software like ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/x7X9w_GIm1s/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/x7X9w_GIm1s/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/x7X9w_GIm1s/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "Fireship",
        "liveBroadcastContent": "none",
        "publishTime": "2021-10-25T15:19:28Z"
      }
    },