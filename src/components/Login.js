import React from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

class Login extends React.Component {
	constructor(props) {
		super(props)

		let user = localStorage.getItem('user')
		if(user !== null)
			this.props.history.push('/')

		let email = localStorage.getItem('remember_email')
		if(email === null)
			email = ''

		this.state = {
			email: email,
			password: '',
			remember_me: email !== '',
			errors: {
				email: null,
				password: null
			}
		}

		this.inputHandler = this.inputHandler.bind(this)
		this.toggleRememberMeHandler = this.toggleRememberMeHandler.bind(this)
		this.submitFormHandler = this.submitFormHandler.bind(this)
	}

	inputHandler(e) {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	toggleRememberMeHandler(e) {
		this.setState({
			remember_me: e.target.checked
		})
	}

	async submitFormHandler(e) {
		e.preventDefault()

		if(this.state.remember_me)
			localStorage.setItem('remember_email', this.state.email)
		else
			localStorage.removeItem('remember_email')

		const params = {
			email: this.state.email,
			password: this.state.password,
			device_name: 'cell5-react v0.1.0'
		}

		this.setState({ password: '' })

		await axios.get('sanctum/csrf-cookie').then(async response => {
			await axios.post('api/login', params)
			.then(response => {
				localStorage.setItem('token', response.data.token)
				localStorage.setItem('user', JSON.stringify(response.data))
				this.props.history.push('/')
			})
			.catch(error => {
				console.log(error.response)
				if(typeof error.response !== typeof undefined)
				{
					let errors = {
						email: null,
						password: null
					}
					if(typeof error.response.data.errors.email !== typeof undefined)
						errors.email = error.response.data.errors.email[0];
					if(typeof error.response.data.errors.password !== typeof undefined)
						errors.password = error.response.data.errors.password[0];
					this.setState({
						errors: errors
					})
				}
			})
		})
	}

	render() {
		return (
			<div className="row">
				<div className="col-lg-6 offset-lg-3">
					<h2 className="text-center">Login</h2>
					<div className="card rounded-0 mt-3">
						<div className="card-body">
							<form onSubmit={this.submitFormHandler}>
								<div className="form-group">
									<label htmlFor="email">Email</label>
									<input type="email" className="form-control rounded-0" id="email" name="email" placeholder="Enter email" required value={this.state.email} onChange={this.inputHandler} />
									<small className={'form-text text-danger' + (this.state.errors.email === null ? ' d-none' : '')}>{this.state.errors.email}</small>
								</div>
								<div className="form-group">
									<label htmlFor="password">Password</label>
									<input type="password" className="form-control rounded-0" id="password" name="password" placeholder="Enter password" required value={this.state.password} onChange={this.inputHandler} />
									<small className={'form-text text-danger' + (this.state.errors.password === null ? ' d-none' : '')}>{this.state.errors.password}</small>
								</div>
								<div className="form-check">
									<input type="checkbox" className="form-check-input" id="remember" checked={this.state.remember_me} onChange={this.toggleRememberMeHandler} />
									<label className="form-check-label" htmlFor="remember">Remember me</label>
								</div>
								<button type="submit" className="btn btn-primary w-100 rounded-0 mt-3">Submit</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default withRouter(Login)
