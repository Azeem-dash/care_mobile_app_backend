import "./App.css";
import { useState } from "react";
import axios from "axios";
import Axios from "axios";

let server = "http://localhost:4000";

function App() {
  const [display, setDisplay] = useState("1");

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ cursor: "pointer" }} onClick={() => setDisplay("1")}>
          CARE ADMIN PANEL
        </h2>

        {display === "2" ? (
          <Question />
        ) : display === "3" ? (
          <Activity />
        ) : (
          <>
            <div className="inputBox">
              <button className="btn" onClick={() => setDisplay("2")}>
                Add Question
              </button>
            </div>
            <div className="inputBox">
              <button className="btn" onClick={() => setDisplay("3")}>
                Add Activity
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Question() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState({
    a: "",
    b: "",
    c: "",
    d: "",
  });
  const [scores, setScores] = useState({
    a: "",
    b: "",
    c: "",
    d: "",
  });

  const onSubmit = () => {
    console.log({
      question: question,
      answers: [answers.a, answers.b, answers.c, answers.d],
      scores: [scores.a, scores.b, scores.c, scores.d],
    });
    axios
      .post(server + "/api/addQuestion", {
        question: question,
        answers: [answers.a, answers.a, answers.c, answers.d],
        scores: [scores.a, scores.a, scores.c, scores.d],
      })
      .then((res) => {
        alert(res.data.message);
      })
      .catch((e) => {
        alert("error posting question");
        console.log(e);
      });
  };

  const handelAns = (key, value) => {
    setAnswers({ ...answers, [key]: value });
  };
  const HandelScores = (key, value) => {
    setScores({ ...scores, [key]: value });
  };
  return (
    <>
      <form action="#">
        <div className="inputBox">
          <textarea type="text" placeholder="Question" onChange={(event) => setQuestion(event.target.value)} />
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div className="inputBox">
            <input type="text" placeholder="Answer A" onChange={(event) => handelAns("a", event.target.value)} />
          </div>
          <div className="inputBox">
            <input type="text" placeholder="Answer B" onChange={(event) => handelAns("b", event.target.value)} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div className="inputBox">
            <input type="text" placeholder="Answer C" onChange={(event) => handelAns("c", event.target.value)} />
          </div>
          <div className="inputBox">
            <input type="text" placeholder="Answer D" onChange={(event) => handelAns("d", event.target.value)} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div className="inputBox">
            <input type="number" placeholder="Score A" onChange={(event) => HandelScores("a", event.target.value)} />
          </div>
          <div className="inputBox">
            <input type="number" placeholder="Score B" onChange={(event) => HandelScores("b", event.target.value)} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div className="inputBox">
            <input type="number" placeholder="Score C" onChange={(event) => HandelScores("c", event.target.value)} />
          </div>
          <div className="inputBox">
            <input type="number" placeholder="Score D" onChange={(event) => HandelScores("d", event.target.value)} />
          </div>
        </div>
      </form>
      <div className="inputBox">
        <button className="btn" onClick={() => onSubmit()}>
          Save Question
        </button>
      </div>
    </>
  );
}
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
function Activity() {
  const [image, setImage] = useState("");
  const [ImageURI, setImageURI] = useState();
  const [activity, setActivity] = useState({
    name: "",
    mood: "",
    description: "",
  });
  const [postImage, setPostImage] = useState({
    myFile: "",
  });
  const uploadImage = async (file) => {
    const base64 = await convertToBase64(file);
    setImageURI(base64)
    // console.log("base64 is here-> ", base64, file);
    setPostImage({ ...postImage, myFile: base64 });
    const data = new FormData();
    data.append("file", file);
    let body = {
      file: file,
      URL: base64,
    };
    Axios.post(
      server + "/upload/ActivityImage",
      {body},
      {
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }
    )
      .then((response) => {
        // console.log("response", response.data);
        setImage(response.data.url);
      })
      .catch((err) => {
        console.log("error", err.response);
      });
  };

  const onSubmit = async() => {
    console.log({
      name: activity.name,
      mood: activity.mood,
      description: activity.description,
      image:  await convertToBase64(ImageURI),
    });
    axios
      .post(server + "/api/addActivity", {
        name: activity.name,
        mood: activity.mood,
        description: activity.description,
        image:  await convertToBase64(ImageURI),
      })
      .then((res) => {
        alert(res.data.message);
      })
      .catch((e) => {
        alert("error posting question");
        console.log(e);
      });
  };

  const handleActivity = (key, value) => {
    setActivity({ ...activity, [key]: value });
  };

  return (
    <>
      <form action="#">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div className="inputBox">
            <input type="text" placeholder="Name" onChange={(event) => handleActivity("name", event.target.value)} />
          </div>
          <div className="inputBox">
            <input type="text" placeholder="mood" onChange={(event) => handleActivity("mood", event.target.value)} />
          </div>
        </div>
        <div className="inputBox">
          <textarea
            type="text"
            placeholder="activity Description"
            onChange={(event) => handleActivity("description", event.target.value)}
          />
        </div>

        <div className="inputBox">
          <input
            type="file"
            placeholder="Image"
            onChange={async (event) => {
              // const base64 = await convertToBase64(event.target.files[0]);
              // console.log(base64);
              setImageURI(event.target.files[0]);
              
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "10px",
            borderTop: "solid #cbcbcb 1px",
          }}
        ></div>
      </form>
      <div className="inputBox">
        <button className="btn" onClick={() => onSubmit()}>
          Save Question
        </button>
      </div>
    </>
  );
}

export default App;
