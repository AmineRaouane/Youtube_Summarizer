import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./App.css";
import { CgProfile } from "react-icons/cg";
import { MdOutlineSubtitles,MdInsertLink,MdOutlineDateRange} from "react-icons/md";
import { FaRegEye,FaArrowAltCircleUp } from "react-icons/fa";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

function timeAgo(publishTime) {
  const now = new Date();
  const publishedDate = new Date(publishTime);
  const secondsAgo = Math.floor((now - publishedDate) / 1000);

  const secondsInMinute = 60;
  const secondsInHour = 3600;
  const secondsInDay = 86400;
  const secondsInWeek = secondsInDay * 7;
  const secondsInMonth = secondsInDay * 30; // Approximation
  const secondsInYear = secondsInDay * 365; // Approximation

  if (secondsAgo >= secondsInYear) {
    const yearsAgo = Math.floor(secondsAgo / secondsInYear);
    return `${yearsAgo} year${yearsAgo > 1 ? "s" : ""} ago`;
  } else if (secondsAgo >= secondsInMonth) {
    const monthsAgo = Math.floor(secondsAgo / secondsInMonth);
    return `${monthsAgo} month${monthsAgo > 1 ? "s" : ""} ago`;
  } else if (secondsAgo >= secondsInWeek) {
    const weeksAgo = Math.floor(secondsAgo / secondsInWeek);
    return `${weeksAgo} week${weeksAgo > 1 ? "s" : ""} ago`;
  } else if (secondsAgo >= secondsInDay) {
    const daysAgo = Math.floor(secondsAgo / secondsInDay);
    return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
  } else if (secondsAgo >= secondsInHour) {
    const hoursAgo = Math.floor(secondsAgo / secondsInHour);
    return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
  } else if (secondsAgo >= secondsInMinute) {
    const minutesAgo = Math.floor(secondsAgo / secondsInMinute);
    return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
  } else {
    return `${secondsAgo} second${secondsAgo > 1 ? "s" : ""} ago`;
  }
}

function App() {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [Info, setInfo] = useState(null);
  const [Key_Concepts, setKey_Concepts] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [Content, setContent] = useState(0);
  const [Summary, setSummary] = useState(null);
  const [Similar_videos, setSimilar_videos] = useState(null);

  const handleLinkChange = (event) => {
    setYoutubeLink(event.target.value);
  };

  const extractVideoId = (url) => {
    let videoId = null;
    const urlObj = new URL(url);

    if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.slice(1);
    } else if (
      urlObj.hostname === "www.youtube.com" ||
      urlObj.hostname === "youtube.com"
    ) {
      videoId = urlObj.searchParams.get("v");
    }

    return videoId;
  };

  const toggleFaq = (index) => {
    if (faqOpen === index) {
      setFaqOpen(null);
    } else {
      setFaqOpen(index);
    }
  };

  const sendLink = async () => {
    if (youtubeLink == "") {
      alert("No links found");
    } else {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:8000/analyse_video",
          {
            youtube_url: youtubeLink,
          }
        );

        const middleIndex = Math.ceil(response.data["Key_Concepts"].length / 2);
        setKey_Concepts([
          response.data["Key_Concepts"].slice(0, middleIndex),
          response.data["Key_Concepts"].slice(middleIndex),
        ]);
        setSummary(response.data["Summary"]);
        setInfo(response.data["Info"]);
        setSimilar_videos(response.data["Similar_videos"]);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
  };
  return (
    <>
      <div className="Header">
        <div className="Title">Youtube Video Concepts Extractor</div>
        <p>
          Get YouTube transcript and use AI to extract concepts from YouTube
          videos in one click for free .
        </p>
      </div>
      <div className="input_Container">
        <div className="input_wrapper">
          <input
            type="text"
            placeholder="Paste Youtube Link Here"
            value={youtubeLink}
            onChange={handleLinkChange}
            className="inputField"
          />
          <button onClick={sendLink} disabled={Loading}>
            {Loading ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: `
                <lord-icon
                src="https://cdn.lordicon.com/cjbuodml.json"
                trigger="loop"
                state="loop-cycle"
                colors="primary:#4bb3fd,secondary:#242424"
                style="width:30px;height:30px">
                </lord-icon>`,
                }}
              />
            ) : (
              <p>Generate</p>
            )}
          </button>
        </div>
      </div>
      <div className="App_Container">
        <div className="LeftContainer">
          <div className="Video_wrapper">
            <div className="Video">
              {Info ? (
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${extractVideoId(
                    youtubeLink
                  )}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Embedded YouTube"
                ></iframe>
              ) : (
                <>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `
                              <lord-icon
                              src="https://cdn.lordicon.com/uofkbuoq.json"
                              trigger="hover"
                              delay="2500"
                              state="morph-logotype"
                              colors="primary:#242424,secondary:#c71f16,tertiary:#faddd1"
                              style="width:250px;height:250px">
                              </lord-icon>
                              `,
                    }}
                  />
                </>
              )}
            </div>
            <div className="Video_infos">
              {Info ? (
                <>
                  <p>
                    <MdOutlineSubtitles size={30} /> Title: {Info.title}
                  </p>
                  <p>
                    <CgProfile size={30} /> Author: {Info.author}
                  </p>
                  <p>
                    <FaRegEye size={30} /> View count: {Info.view_count}
                  </p>
                  <p>
                    <MdOutlineDateRange size={30} /> Published:{" "}
                    {timeAgo(Info.publish_date)}
                  </p>
                </>
              ) : (
                <p><FaArrowAltCircleUp size={30}/> Insert a Link Above </p>
              )}
            </div>
          </div>
        </div>

        <div className="RightContainer">
          <div className="Toggle_wrapper">
            <div className="Toggle">
              <button
                onClick={() => setContent(0)}
                className={Content === 0 ? "active" : ""}
              >
                Summary
              </button>
              <button
                onClick={() => setContent(1)}
                className={Content === 1 ? "active" : ""}
              >
                Key Concepts
              </button>
              <button
                onClick={() => setContent(2)}
                className={Content === 2 ? "active" : ""}
              >
                Similar Videos
              </button>
            </div>
          </div>
          <div className="Content_Container">
            {Loading ? (
              <div
              style={{
                margin:"auto"
              }}
              dangerouslySetInnerHTML={{
                __html: `
                    <lord-icon
                        src="https://cdn.lordicon.com/dmgxtuzn.json"
                        trigger="loop"
                        state="loop-cycle"
                        stroke="bold"
                        colors="primary:#000000,secondary:#3080e8"
                        style="width:350px;height:350px">
                    </lord-icon>
                            `,
              }}
            />
            ) : Content === 0 ? (
              <div className="Summary_wrapper">
                <div className="Summary">
                  <ReactMarkdown>{Summary}</ReactMarkdown>
                </div>
              </div>
            ) : Content === 1 ? (
              <>
                <div className="Concepts_wrapper">
                  <div className="Concepts">
                    {Key_Concepts && Key_Concepts.length > 0 ? (
                      <>
                        {Key_Concepts[0].map((item, index) => (
                          <div key={index} className="faq-item">
                            <div
                              className="Concept"
                              onClick={() => toggleFaq(index)}
                            >
                              <h1>{item.concept}</h1>
                              <button>
                                {faqOpen === index ? (
                                  <IoIosArrowDropdownCircle size={20} />
                                ) : (
                                  <IoIosArrowDroprightCircle size={20} />
                                )}
                              </button>
                            </div>
                            <div
                              className={`Definition ${
                                faqOpen === index ? "expanded" : ""
                              }`}
                            >
                              <p>{item.definition}</p>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
                <div className="Concepts_wrapper">
                  <div className="Concepts">
                    {Key_Concepts && Key_Concepts.length > 0 ? (
                      <>
                        {Key_Concepts[1].map((item, index) => (
                          <div
                            key={Key_Concepts[0].length + index}
                            className="faq-item"
                          >
                            <div
                              className="Concept"
                              onClick={() =>
                                toggleFaq(Key_Concepts[0].length + index)
                              }
                            >
                              <h1>{item.concept}</h1>
                              <button>
                                {faqOpen === Key_Concepts[0].length + index ? (
                                  <IoIosArrowDropdownCircle size={20} />
                                ) : (
                                  <IoIosArrowDroprightCircle size={20} />
                                )}
                              </button>
                            </div>
                            <div
                              className={`Definition ${
                                faqOpen === Key_Concepts[0].length + index
                                  ? "expanded"
                                  : ""
                              }`}
                            >
                              <p>{item.definition}</p>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </>
            ) : Content === 2 ? (
              <div style={{ width: "100%" }} className="Concepts_wrapper">
                <div className="Concepts">
                  {Similar_videos && Similar_videos.length > 0 ? (
                    <>
                      {Similar_videos.map((item, index) => (
                        <div key={index} className="faq-item">
                          <div className="Concept">
                            <h1>{item.title}</h1>
                            <p>{timeAgo(item.publishTime)}</p>
                            <button
                              onClick={() => window.open(item.url, "_blank")}
                            >
                              <MdInsertLink size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            ) : (
              <>Hi</>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
