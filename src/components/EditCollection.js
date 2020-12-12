import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import AddCollectionForm from './AddCollectionForm'

class EditCollection extends React.Component {
	constructor(props) {
		super(props)

		let id = this.props.match.params.id
		if(typeof id === typeof undefined)
			this.props.history.push('/members')

		this.state = {
			id: id,
			collection: null,
			members: [],
			back_url: '/collection/' + id,
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
			axios.get(`api/collections/${this.state.id}/edit`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(response => {
				let collection = response.data.collection
				//console.log(collection)
				this.setState({
					collection: collection,
					members: response.data.members,
					input: {
						member_id: collection.member_id,
						claimant: collection.claimant_id !== null ? 1 : 0,
						first_name: collection.claimant_first_name,
						middle_initial: collection.claimant_middle_initial !== null ? collection.claimant_middle_initial : '',
						last_name: collection.claimant_last_name,
						suffix: collection.claimant_suffix !== null ? collection.claimant_suffix : '',
						due_on: collection.due_on
					}
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
			first_name: input.first_name !== null && input.first_name.trim() !== '' ? input.first_name.trim() : '',
			middle_initial: input.middle_initial !== null && input.middle_initial.trim() !== '' ? input.middle_initial.trim() : '',
			last_name: input.last_name !== null && input.last_name.trim() !== '' ? input.last_name.trim() : '',
			suffix: input.suffix !== null && input.suffix.trim() !== '' ? input.suffix.trim() : '',
			due_on: input.due_on.trim()
		}

		let token = localStorage.getItem('token')

		axios.get('sanctum/csrf-cookie')
		.then(() => {
			axios.put(`api/collections/${this.state.id}`, params, {	headers: { Authorization: 'Bearer ' + token	} })
			.then(response => {
				this.setState({
					collection: response.data.collection,
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

	render()
	{
		const collection = this.state.collection
		//console.log(collection)

		return (
			<div className="row">
				<div className="col-lg-12">
					<h2>Edit Collection</h2>
					<Link to={this.state.back_url}>
						<span className="btn btn-sm btn-success rounded-0">Back</span>
					</Link>
					{
							collection !== null &&
							<table className="table table-bordered table-striped table-sm w-auto mt-3 mb-0">
								<thead>
									<tr>
										<th>Member</th>
										<th>Claimant</th>
										<th>Due on</th>
										<th>Released on</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<Link to={`/member/${collection.member_id}`}>
												{collection.member_last_name}, {collection.member_first_name} {collection.member_suffix !== null ? collection.member_suffix : ''} {collection.member_middle_initial !== null ? `${collection.member_middle_initial}.` : ''}
											</Link>
										</td>
										<td>
											{
												collection.claimant_id !== null ?
													<React.Fragment>
														{collection.claimant_last_name}, {collection.claimant_first_name} {collection.claimant_suffix !== null ? collection.claimant_suffix : ''} {collection.claimant_middle_initial !== null ? `${collection.claimant_middle_initial}.` : ''}
													</React.Fragment>
												:
													<em>Member</em>
											}
										</td>
										<td>{collection.due_on}</td>
										{
											collection.released_on !== null ?
												<td>{collection.released_on}</td>
											:
												<td>&nbsp;</td>
										}
									</tr>
								</tbody>
							</table>
						}
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

export default EditCollection
