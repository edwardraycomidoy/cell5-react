import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import AddCollectionForm from './AddCollectionForm'

class AddCollection extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			members: [],
			input: {
				member_id: '',
				claimant: 0,
				first_name: '',
				middle_initial: '',
				last_name: '',
				suffix: '',
				due_on: ''
			},
			message: {
				class: null,
				message: null
			},
			errors: {
				member_id: null,
				first_name: null,
				middle_initial: null,
				last_name: null,
				suffix: null,
				due_on: null
			}
		}

		this.inputHandler = this.inputHandler.bind(this)
		this.toggleClaimantHandler = this.toggleClaimantHandler.bind(this)
		this.submitHandler = this.submitHandler.bind(this)
	}

	componentDidMount = () => {
    let token = localStorage.getItem('token')
    if(token !== null)
    {
			axios.get('api/collections/create', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(response => {
				this.setState({
					members: response.data.members
				})
      }).catch(() => {
				localStorage.removeItem('token')
				localStorage.removeItem('user')
				this.props.history.push('/')
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

	toggleClaimantHandler = (e) => {
		this.setState({
			input: {
				...this.state.input,
				[e.target.name]: parseInt(e.target.value)
			}
		})
	}

  submitHandler = (e) => {
		e.preventDefault()

		let input = this.state.input

		const params = {
			member_id: input.member_id,
			claimant: input.claimant,
			first_name: input.first_name.trim(),
			middle_initial: input.middle_initial !== null && input.middle_initial.trim() !== '' ? input.middle_initial.trim() : '',
			last_name: input.last_name.trim(),
			suffix: input.suffix !== null && input.suffix.trim() !== '' ? input.suffix.trim() : '',
			due_on: input.due_on.trim()
		}

		let token = localStorage.getItem('token')

		axios.get('sanctum/csrf-cookie')
		.then(() => {
			axios.post('api/collections', params, {	headers: { Authorization: 'Bearer ' + token	} })
			.then(response => {
				this.props.history.push('/collection/' + response.data.id)
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
						member_id: null,
						first_name: null,
						middle_initial: null,
						last_name: null,
						suffix: null,
						due_on: null
					}

					if(typeof error.response.data.errors.member_id !== typeof undefined)
						errors.member_id = error.response.data.errors.member_id[0]

					if(typeof error.response.data.errors.first_name !== typeof undefined)
						errors.first_name = error.response.data.errors.first_name[0]

					if(typeof error.response.data.errors.middle_initial !== typeof undefined)
						errors.middle_initial = error.response.data.errors.middle_initial[0]

					if(typeof error.response.data.errors.last_name !== typeof undefined)
						errors.last_name = error.response.data.errors.last_name[0]

					if(typeof error.response.data.errors.suffix !== typeof undefined)
						errors.suffix = error.response.data.errors.suffix[0]

					if(typeof error.response.data.errors.due_on !== typeof undefined)
						errors.due_on = error.response.data.errors.due_on[0]

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
					<h2>Add Collection</h2>
					<Link to="/collections">
							<span className="btn btn-sm btn-success rounded-0">Back</span>
						</Link>
					</div>
					<div className="col-lg-6">
						{
							this.state.message.class !== null &&
								<div className={`alert alert-${this.state.message.class} rounded-0 mt-3 mb-0`} role="alert">{this.state.message.message}</div>
						}
						<AddCollectionForm state={this.state} inputHandler={this.inputHandler} toggleClaimantHandler={this.toggleClaimantHandler} submitHandler={this.submitHandler} />
					</div>
			</div>
		)
	}
}

export default AddCollection
