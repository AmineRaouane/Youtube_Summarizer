from langchain_community.document_loaders import YoutubeLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_vertexai import VertexAI
from vertexai.generative_models import GenerativeModel
from langchain.chains.summarize import load_summarize_chain
from langchain.prompts import PromptTemplate
from tqdm import tqdm
from googleapiclient.discovery import build
import json
import logging
import re
import os



os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "Project.json"
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GeminiProcessor :

    def __init__(self,model_name='gemini-pro',temperature=0.3 ,max_output_tokens=2000):
        self.model = VertexAI(
            model_name=model_name,
            temperature=temperature,
            max_output_tokens=max_output_tokens
        )

    def get_summary(self, documents: list, **args):
        
        chain_type = "map_reduce" if len(documents) > 10 else "stuff"
        
        chain = load_summarize_chain(
            llm = self.model,
            chain_type = chain_type,
            **args
        )
        
        return chain.run(documents)

    def count_total_tokens(self, docs: list):
        temp_model = GenerativeModel("gemini-1.0-pro")
        total = 0
        logger.info("Counting total billable characters...")
        for doc in tqdm(docs):
            total += temp_model.count_tokens(doc.page_content).total_billable_characters
        return total


class YoutubeProcessor :

    def __init__(self,Gemini_Processor:GeminiProcessor,chunk_size=1000,chunk_overlap=0):
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size,
                                                            chunk_overlap=chunk_overlap)
        self.GeminiProcessor = Gemini_Processor
        
    def get_docs(self,youtube_url,verbose=False):
        Loader = YoutubeLoader.from_youtube_url(youtube_url,add_video_info=True)
        docs = Loader.load()
        result = self.text_splitter.split_documents(docs)
        if verbose:
            print(result[0].metadata)
        return result
    
    def find_key_concepts(self, documents:list, num_docs_per_group: int = 4, verbose = False):
        
        groups = [documents[i:i+num_docs_per_group] for i in range(0, len(documents), num_docs_per_group)] + [documents[-len(documents)%num_docs_per_group:]]
        
        batch_concepts = []
        batch_cost = 0
        
        logger.info("Finding key concepts...")
        for group in tqdm(groups):

            group_content = " ".join([doc.page_content for doc in group])
            
            prompt = PromptTemplate(
                template="""
                Extract and define key concepts or terms found in the text:
                {text}

                Respond only with a JSON list without any backticks or extraneous characters, structured as follows:
                [
                  {{
                    "concept": "<concept>",
                    "definition": "<definition>"
                  }},
                  {{
                    "concept": "<concept>",
                    "definition": "<definition>"
                  }},
                  ...
                ]
                """,
                input_variables=["text"]
            )
            

            chain = prompt | self.GeminiProcessor.model

            Keep_trying = 0
            while Keep_trying<10 :
                output_concept = chain.invoke({"text": group_content})
                try :
                    batch_concepts.extend(json.loads(output_concept))
                    break
                except :
                    Keep_trying += 1

            if Keep_trying == 10 :
                batch_concepts.append(output_concept)
            

            if verbose:
                total_input_cost = (len(group_content)/1000) * 0.000125

                total_output_cost = (len(output_concept)/1000) * 0.000375
                
                batch_cost += total_input_cost + total_output_cost
                logging.info(f"Total group cost: {total_input_cost + total_output_cost}\n")
        
        logging.info(f"Total Analysis Cost: ${batch_cost}")    
        return batch_concepts
    
    def get_summary(self, documents: list):
        return self.GeminiProcessor.get_summary(documents)

    def get_similar_videos(self,title, max_results=10):
        
        youtube = build("youtube", "v3")
        # , credentials=credentials
        request = youtube.search().list(
            part="snippet",
            maxResults=max_results,
            type="video",
            order="relevance",
            q=title)
        response = request.execute()
        return response['items']





    