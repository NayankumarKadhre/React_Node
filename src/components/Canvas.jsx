import React, { useEffect, useRef } from "react";

function Canvas() {
  //For Canvas Drawing 
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let isDrawing = false;

    const startDrawing = (event) => {
      isDrawing = true;
      draw(event);
    };

    const stopDrawing = () => {
      isDrawing = false;
      context.beginPath();
    };

    const draw = (event) => {
      if (!isDrawing) return;
      context.lineWidth = 10;
      context.lineCap = "round";
      context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
      context.stroke();
      context.beginPath();
      context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
    };
  }, []);

  //clearCanvas Function
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  //handleSubmit Function
  function handleSubmit() {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
  
    fetch("http://localhost:8000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dataURL }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // TODO: Handle the response data
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }
  

  return (
    <div>
      <div>
        <canvas id="canvas" ref={canvasRef} width="300" height="300"></canvas>
        <br />
        <button onClick={handleSubmit} id="submit-btn" className="btn btn-lg btn-light">Submit</button>
        <button onClick={clearCanvas} id="clear-btn" className="btn btn-lg btn-light">Clear</button>
      </div>
      <div className ="result">
          {/* <h3>The digit is "{xyz}"</h3> */}
          {/* <h3>Predicted with an accuracy of {xyz}</h3> */}
      </div>
    </div>
  );
}

export default Canvas;
