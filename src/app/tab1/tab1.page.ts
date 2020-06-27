import { Component } from '@angular/core';
import * as speech from '@tensorflow-models/speech-commands';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  recognizer: speech.SpeechCommandRecognizer;
  recording = false;
  loading = false;
  tiros = 0;

  URL = "https://teachablemachine.withgoogle.com/models/wtgUsMu_O/";

  ngOnInit() {

  }

  async createModel() {
    const checkpointURL = "https://teachablemachine.withgoogle.com/models/wtgUsMu_O/model.json"; // model topology
    const metadataURL = "https://teachablemachine.withgoogle.com/models/wtgUsMu_O/metadata.json"; // model metadata

    const recognizer = speech.create(
      "BROWSER_FFT", // fourier transform type, not useful to change
      undefined, // speech commands vocabulary feature, not useful for your models
      checkpointURL,
      metadataURL);

    // check that model and metadata are loaded via HTTPS requests.
    await recognizer.ensureModelLoaded().catch(err => console.log(err));

    return recognizer;
  }

  async init() {

    try {

      this.recognizer = await this.createModel();

      const classLabels = this.recognizer.wordLabels(); // get class labels
      console.log('Recognzier', this.recognizer);
      this.recognizer.listen(async (result: any) => {
        const scores = Array.from(result.scores);
        console.log(scores);
        this.tiros++;

      },
        { probabilityThreshold: 0.90 }).catch(err => console.log(err));
    } catch (e) {
      throw e;
      await this.terminateRecognizer();
      this.loading = false;
    }
    // const labelContainer = document.getElementById("label-container");
    // for (let i = 0; i < classLabels.length; i++) {
    //     labelContainer.appendChild(document.createElement("div"));
    // }

    // // listen() takes two arguments:
    // // 1. A callback function that is invoked anytime a word is recognized.
    // // 2. A configuration object with adjustable fields
    // recognizer.listen(result => {
    //     const scores = result.scores; // probability of prediction for each class
    //     // render the probability scores per class
    //     for (let i = 0; i < classLabels.length; i++) {
    //         const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
    //         labelContainer.childNodes[i].innerHTML = classPrediction;
    //     }
    // }, {
    //     includeSpectrogram: true, // in case listen should return result.spectrogram
    //     probabilityThreshold: 0.75,
    //     invokeCallbackOnNoiseAndUnknown: true,
    //     overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
    // });

    // Stop the recognition in 5 seconds.
    // setTimeout(() => recognizer.stopListening(), 5000);
  }

  async terminateRecognizer() {
    await this.recognizer.stopListening();
    this.recording = false;
    console.log('ENCERRADO O TERMINATE');

  }

}
