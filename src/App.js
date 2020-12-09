import React from 'react'
import axios from 'axios'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Header from './components/Header'
import Home from './components/Home'
import Login from './components/Login'
import Members from './components/Members'
import Member from './components/Member'
import AddMember from './components/AddMember'
import EditMember from './components/EditMember'
import Collections from './components/Collections'

import './axios'

class App extends React.Component {
  componentDidMount = () => {
    let token = localStorage.getItem('token')
    if(token !== null)
    {
			axios.get('api/user', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(response => {
        localStorage.setItem('user', response.data)
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        this.forceUpdate()
      })
    }
    else
      localStorage.removeItem('user')
  }

  logoutHandler = () => {
    let token = localStorage.getItem('token')
    if(token !== null)
    {
      axios.delete('api/logout', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
    }

    localStorage.removeItem('token')
    localStorage.removeItem('user')
    this.forceUpdate()
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

                <Route path="/members/(page)?/:page?" exact component={Members} />
                <Route path="/member/add" exact component={AddMember} />
                <Route path="/member/:id" exact component={Member} />
                <Route path="/member/:id/edit" exact component={EditMember} />

                <Route path="/collections/(page)?/:page?" exact component={Collections} />




              </Switch>
            </div>
          </section>
        </Router>
      </div>
    )
  }
}

export default App
