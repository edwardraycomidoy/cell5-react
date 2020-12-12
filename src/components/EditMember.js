import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import AddMemberForm from './AddMemberForm'

class EditMember extends React.Component {
	constructor(props) {
		super(props)

		let id = this.props.match.params.id
		if(typeof id === typeof undefined)
			this.props.history.push('/members')

		this.state = {
			id: id,
			member: null,
			collections: null,
			back_url: '/member/' + id,
			input: {
				first_name: '',
				middle_initial: '',
				last_name: '',
				suffix: '',
				joined_on: ''
			},
			message: {
				class: null,
				message: null
			},
			errors: {
				first_name: null,
				middle_initial: null,
				last_name: null,
				suffix: null,
				joined_on: null
			}
		}
  }

	componentDidMount = () => {
		let token = localStorage.getItem('token')
    if(token !== null)
    {
			axios.get(`api/members/${this.state.id}`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(response => {
				let member = response.data.member
				this.setState({
					member: member,
					input: {
						first_name: member.first_name,
						middle_initial: member.middle_initial !== null ? member.middle_initial : '',
						last_name: member.last_name,
						suffix: member.suffix !== null ? member.suffix : '',
						joined_on: member.joined_on
					}
				})
      }).catch(() => {
				this.props.history.push('/members')
			})
    }
    else
		{
			localStorage.removeItem('user')
			this.props.history.push('/')
		}
	}

	inputHandler = (e) => {
		this.setState({
			input: {
				...this.state.input,
				[e.target.name]: e.target.value
			}
		})
	}

  submitHandler = (e) => {
		e.preventDefault()

		let input = this.state.input

		const params = {
			first_name: input.first_name.trim(),
			middle_initial: input.middle_initial !== null && input.middle_initial.trim() !== '' ? input.middle_initial.trim() : '',
			last_name: input.last_name.trim(),
			suffix: input.suffix !== null && input.suffix.trim() !== '' ? input.suffix.trim() : '',
			joined_on: input.joined_on.trim()
		}

		let token = localStorage.getItem('token')

		axios.get('sanctum/csrf-cookie')
		.then(() => {
			axios.put(`api/members/${this.state.id}`, params, {	headers: { Authorization: 'Bearer ' + token	} })
			.then(response => {
				this.setState({
					member: params,
					input: params,
					message: {
						class: response.data.class,
						message: response.data.message
					}
				})
			})
			.catch(error => {
				if(typeof error.response !== typeof undefined)
				{
					let message = {
						class: null,
						message: null
					}

					if(typeof error.response.data.message !== typeof undefined)
					{
						message.class = 'danger'
						message.message = error.response.data.message
					}

					this.setState({
						message: message
					})

					let errors = {
						first_name: null,
						middle_initial: null,
						last_name: null,
						suffix: null,
						joined_on: null
					}

					if(typeof error.response.data.errors.first_name !== typeof undefined)
						errors.first_name = error.response.data.errors.first_name[0]

					if(typeof error.response.data.errors.middle_initial !== typeof undefined)
						errors.middle_initial = error.response.data.errors.middle_initial[0]

					if(typeof error.response.data.errors.last_name !== typeof undefined)
						errors.last_name = error.response.data.errors.last_name[0]

					if(typeof error.response.data.errors.suffix !== typeof undefined)
						errors.suffix = error.response.data.errors.suffix[0]

					if(typeof error.response.data.errors.joined_on !== typeof undefined)
						errors.joined_on = error.response.data.errors.joined_on[0]

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
				<div className="col-lg-12">
					{
						this.state.member !== null ?
							<h2>{this.state.member.first_name} {this.state.member.middle_initial !== null && this.state.member.middle_initial !== '' ? `${this.state.member.middle_initial}.` : ''} {this.state.member.last_name} {this.state.member.suffix !== null && this.state.member.suffix !== '' ? this.state.member.suffix : ''}</h2>
						:
							<h2>Loading...</h2>
					}
					<h5 className="mb-3">Member</h5>
					<Link to={this.state.back_url}>
						<span className="btn btn-sm btn-success rounded-0">Back</span>
					</Link>
				</div>
				<div className="col-lg-6">
					{
						this.state.message.class !== null &&
							<div className={`alert alert-${this.state.message.class} rounded-0 mt-3 mb-0`} role="alert">{this.state.message.message}</div>
					}
					<AddMemberForm state={this.state} inputHandler={this.inputHandler} submitHandler={this.submitHandler} />
				</div>
			</div>
		)
	}
}

export default EditMember
