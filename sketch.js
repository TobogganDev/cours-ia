// Global variables
let video;
let detector;
let detections = [];
let speech = new p5.Speech();
let objectToSpeech = '';


// Preload the model
function preload() {
  detector = ml5.objectDetector('cocossd');
}

// Function that runs when the model is loaded
function gotDetections(error, results) {
  // If there is an error, log it
  if (error) {
    console.error(error);
  }
  // If there are no errors, save the results
  detections = results;
  // For every detection, draw a rectangle and label it
  for (let i = 0; i < detections.length; i++) {
    let object = detections[i];
    stroke(0,255,0);
    strokeWeight(4);
    noFill();
    rect(object.x, object.y, object.width, object.height);
    noStroke();
    fill(255);
    textSize(24);
    text(object.label, object.x + 10, object.y+24);
    console.log(object.label);

    // speech.speak(`Object detected: ${object.label}`);
  }
  // Run the model again (loop on itself because it's a video not a single image)
  detector.detect(video, gotDetections);
}

// Setup function for canvas and video
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  detector.detect(video, gotDetections);

  // Set an interval to update objectToSpeech and speak it every 20 seconds
  setInterval(() => {
    if (detections.length > 0) {
      objectToSpeech = detections[detections.length - 1].label;
      speech.speak(`Object detected: ${objectToSpeech}`);
    }
  }, 5000); // 20000 milliseconds = 20 seconds
}

// Draw function for video
function draw() {
  image(video, 0, 0);
}