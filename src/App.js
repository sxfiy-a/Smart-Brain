import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation.js';
import Rank from './components/Rank/Rank.js';
import ImageURLForm from './components/ImageURLForm/ImageURLForm.js';
import Image from './components/Image/Image.js';
import Clarifai from "clarifai";
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

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
        "color": "#ffffff"
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
      "speed": 1,
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
    "detect_on": "window",
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
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  componentDidMount() {
    fetch('http://localhost:3000/')
      .then(response => response.json())
      .then(console.log)
      .catch(err=> console.log(err));
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
      .then(response => {
        if(response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type':  'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
        }
        this.displayDetectedFace(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
    
  }

  onRouteChange = (route) => {
    this.setState({route: route});
    if(route === 'signin') 
      this.setState({isSignedIn: false});
    else if(route==='home')
      this.setState({isSignedIn: true});
  }

  loadUser = (data) => {
    this.setState({ user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }
  render() {
    const { isSignedIn, imageURL, route, box } = this.state;
    return (
      <div className="App">
           <div> 
          <Particles height="100vh" width="100vw" className='particles'
            params={particleOptions} />
        </div>  
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' 
          ? <div>          
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageURLForm 
                onInputChange={this.onInputChange} 
                onDetect={this.onDetect}/>
              <Image box={box} imageURL={imageURL}/>
            </div>
          : (
            route === 'signin' 
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          ) 
        }
       
      </div>
    );
  }
  
}

export default App;
