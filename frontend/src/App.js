import React from 'react';
import logo from './logo.svg';
import './App.css';

// import fs from 'fs';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }


class RenderLink extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      link: props.link
    }
  }

  render() {
    return (
      <tr>
        <th><a href={this.state.link.link}>{this.state.link.link}</a></th>
        <th>{this.state.link.date}</th>
        <th>{this.state.link.comment}</th>
      </tr>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)

    // const links = JSON.parse(fs.readFileSync('./tests/sampleData.json', 'utf-8'))

    const links = [
      {
        "link": "google.com",
        "date": "1995-12-17T03:24:00",
        "comment": "Wow, this website lets your search for stuff"
      },
      {
        "link": "facebook.com",
        "date": "1995-12-17T03:24:00",
        "comment": "This website is the color blue"
      }
    ]

    this.state = {
      links
    }
  }

  render() {
    return (
      <table style={{'width': '100%'}}>
        <tr>  
          <th>Link</th>
          <th>Date</th>
          <th>Comment</th>
        </tr>
        {
          this.state.links.map(link => <RenderLink link={link}></RenderLink>)
        }
      </table>
    )
  }
}

export default App;
