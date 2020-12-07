import React from 'react'
import axios from 'axios'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Header from './components/Header'
import Home from './components/Home'
import Login from './components/Login'
import Members from './components/Members'
import Collections from './components/Collections'

import './axios'

class App extends React.Component {
	/*constructor(props) {
    super(props);
  }*/

  async componentDidMount() {
    let token = localStorage.getItem('token')
    if(token !== null)
    {
			await axios.get('user', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(response => {
        localStorage.setItem('user', JSON.stringify(response.data))
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        //this.props.history.push('/')
      })
    }
    else
    {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      //this.props.history.push('/')
    }
  }

  logoutHandler() {
    let token = localStorage.getItem('token')
    if(token !== null)
    {
      axios.delete('logout', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
    }

    localStorage.removeItem('token')
	  localStorage.removeItem('user')
    this.props.history.push('/')
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Header logoutHandler={this.logoutHandler} />
          <section>
            <div className="container">
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" exact component={Login} />
                <Route path="/members/:page?/:keywords?" exact component={Members} />
                <Route path="/collections" exact component={Collections} />
              </Switch>
            </div>
          </section>
        </Router>
      </div>
    )
  }
}

export default App
