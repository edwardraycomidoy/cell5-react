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
			first_name: '',
			middle_initial: '',
			last_name: '',
			suffix: '',
			joined_on: '',
			errors: {
				error: null,
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
				this.setState({
					member: response.data.member,
					first_name: response.data.member.first_name,
					middle_initial: response.data.member.middle_initial !== null ? response.data.member.middle_initial : '',
					last_name: response.data.member.last_name,
					suffix: response.data.member.suffix !== null ? response.data.member.suffix : '',
					joined_on: response.data.member.joined_on
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
			[e.target.name]: e.target.value
		})
	}

  submitHandler = (e) => {
		e.preventDefault()

		const params = {
			first_name: this.state.first_name,
			middle_initial: this.state.middle_initial,
			last_name: this.state.last_name,
			suffix: this.state.suffix,
			joined_on: this.state.joined_on
		}

		let token = localStorage.getItem('token')

		axios.get('sanctum/csrf-cookie').then(() => {
			axios.put(`api/members/${this.state.id}`, params, {	headers: { Authorization: 'Bearer ' + token	} })
			.then(() => {
				this.props.history.push(`/member/${this.state.id}`)
			})
			.catch(error => {
				if(typeof error.response !== typeof undefined)
				{
					let errors = {
						error: null,
						first_name: null,
						middle_initial: null,
						last_name: null,
						suffix: null,
						joined_on: null
					}

					if(typeof error.response.data.message !== typeof undefined)
						errors.error = error.response.data.message;

					if(typeof error.response.data.errors.first_name !== typeof undefined)
						errors.first_name = error.response.data.errors.first_name[0];

					if(typeof error.response.data.errors.middle_initial !== typeof undefined)
						errors.middle_initial = error.response.data.errors.middle_initial[0];

					if(typeof error.response.data.errors.last_name !== typeof undefined)
						errors.last_name = error.response.data.errors.last_name[0];

					if(typeof error.response.data.errors.suffix !== typeof undefined)
						errors.suffix = error.response.data.errors.suffix[0];

					if(typeof error.response.data.errors.joined_on !== typeof undefined)
						errors.joined_on = error.response.data.errors.joined_on[0];

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
							<h2>{this.state.member.first_name} {this.state.member.middle_initial !== null ? `${this.state.member.middle_initial}.` : ''} {this.state.member.last_name} {this.state.member.suffix !== null ? this.state.member.suffix : ''}</h2>
						:
							<h2>Loading...</h2>
					}
					<h5 className="mb-3">Member</h5>
					<Link to={this.state.back_url}>
						<span className="btn btn-sm btn-success rounded-0">Back</span>
					</Link>
				</div>
				<div className="col-lg-6">
					<AddMemberForm state={this.state} inputHandler={this.inputHandler} submitHandler={this.submitHandler} />
				</div>
			</div>
		)
	}
}

export default EditMember
