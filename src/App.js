import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation.js';
import Rank from './components/Rank/Rank.js';
import ImageURLForm from './components/ImageURLForm/ImageURLForm.js';
import Image from './components/Image/Image.js';
import Clarifai from "clarifai";

const app = new Clarifai.App({
  apiKey: "049ae2cb9d8f4a40950bcf40192388cd",
});

const particleOptions = 
{
  "particles": {
    "number": {
      "value": 160,
      "density": {
        "enable": true,
        "value_area": 900
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      }
    },
    "opacity": {
      "value": 0.3,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 4,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 0,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 2,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      }
    }
  }
}


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {}
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayDetectedFace = (box) => {
    console.log(box);
    this.setState({ box });
  }
  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({ input: event.target.value });
  }

  onDetect = () => {
    console.log('click');
    this.setState({ imageURL: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => this.displayDetectedFace(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
    
  }


  render() {
    return (
      <div className="App">
        <div style={{ position: 'absolute'}}>
          <Particles height="100%" width="100vw" className='particles'
            params={particleOptions} />
        </div>     
        <Navigation />
        <Rank />
        <ImageURLForm 
          onInputChange={this.onInputChange} 
          onDetect={this.onDetect}/>
        <Image box={this.state.box} imageURL={this.state.imageURL}/>
      </div>
    );
  }
  
}

export default App;
