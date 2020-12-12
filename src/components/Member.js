import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import PaymentCheckboxes from './PaymentCheckboxes'

class Member extends React.Component {
	constructor(props) {
		super(props)

		let id = this.props.match.params.id
		if(typeof id === typeof undefined)
			this.props.history.push('/members')

		this.state = {
			id: id,
			member: null,
			collections: [],
			payments: [],
			back_url: '/members'
		}

		this.setMemberPaid = this.setMemberPaid.bind(this)
		this.setMemberUnpaid = this.setMemberUnpaid.bind(this)
  }

	componentDidUpdate = (prevProps) => {
		if(this.props.location.pathname !== prevProps.location.pathname)
		{
			let id = this.props.match.params.id
			if(typeof id !== typeof undefined)
				id = parseInt(id)
			else
				this.props.history.push('/members')

			this.setState({
				id: id
			}, () => {
				this.drawTable()
			})
		}
	}

	componentDidMount = () => {
		this.drawTable()
	}

	drawTable = () => {
		let token = localStorage.getItem('token')
    if(token !== null)
    {
			axios.get(`api/members/${this.state.id}`, {
				headers: {
					Authorization: 'Bearer ' + token
				}
			})
			.then(response => {
				this.setState({
					member: response.data.member,
					collections: response.data.collections,
					payments: response.data.payments,
					back_url: '/members' + (response.data.current_page > 1 ? '/page/' + response.data.current_page : '')
				})
			})
			.catch(() => {
					this.props.history.push('/members')
			})
    }
    else
		{
			localStorage.removeItem('user')
			this.props.history.push('/')
		}
	}

	setMemberPaid = (e) => {
		let collectionId = parseInt(e.target.dataset.collectionId)

		this.setState({
			payments: {
				...this.state.payments,
				[collectionId]: true
			}
		})

		let token = localStorage.getItem('token')
    if(token !== null)
    {
			let params = {
				member_id: parseInt(this.state.id),
				collection_id: collectionId
			}

			axios.get('sanctum/csrf-cookie')
			.then(() => {
				axios.post('api/payments', params, {headers: { Authorization: 'Bearer ' + token	} })
			})
		}
	}

	setMemberUnpaid = (e) => {
		let collectionId = parseInt(e.target.dataset.collectionId)

		this.setState({
			payments: {
				...this.state.payments,
				[collectionId]: false
			}
		})

		let token = localStorage.getItem('token')
    if(token !== null)
    {
			let params = {
				member_id: parseInt(this.state.id),
				collection_id: collectionId
			}

			axios.get('sanctum/csrf-cookie')
			.then(() => {
				axios.delete('api/payments', {
					data: params,
					headers: { Authorization: 'Bearer ' + token	}
				})
			})
		}
	}

	render() {
		let tbody

		if(this.state.collections.length > 0)
		{
			const collections = this.state.collections.map((collection) => {
				let paid = this.state.payments[collection.id]

				return (
					<tr key={`c-${collection.id}`}>
						<td>
							<Link to={`/collection/${collection.id}`}>View</Link>
						</td>
						<td>
							{
								collection.claimant_id !== null ?
									<React.Fragment>
										{collection.claimant_last_name}, {collection.claimant_first_name} {collection.claimant_suffix !== null ? collection.claimant_suffix : ''} {collection.claimant_middle_initial !== null ? `${collection.claimant_middle_initial}.` : ''}
									</React.Fragment>
								:
									<Link to={`/member/${collection.member_id}`}>
											{collection.member_last_name}, {collection.member_first_name} {collection.member_suffix !== null ? collection.member_suffix : ''} {collection.member_middle_initial !== null ? `${collection.member_middle_initial}.` : ''}
									</Link>
							}
						</td>
						<td>
							{
								collection.claimant_id !== null ?
									<Link to={`/member/${collection.member_id}`}>
										{collection.member_last_name}, {collection.member_first_name} {collection.member_suffix !== null ? collection.member_suffix : ''} {collection.member_middle_initial !== null ? `${collection.member_middle_initial}.` : ''}
									</Link>
								:
									<em>Claimant</em>
							}
						</td>
						<td>{collection.due_on}</td>
						<td className="text-center">
							<PaymentCheckboxes paid={paid} member_id={this.state.id} collection_id={collection.id} setMemberPaid={this.setMemberPaid} setMemberUnpaid={this.setMemberUnpaid} />
						</td>
					</tr>
				)
			})

			tbody = <tbody>{collections}</tbody>
		}

		const buttonStyle = { marginLeft: '5px' }

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
					{
						this.state.member !== null &&
							<React.Fragment>
								<Link to={`/member/edit/${this.state.id}`} style={buttonStyle}>
									<span className="btn btn-sm btn-info rounded-0">Edit</span>
								</Link>
								<button className="btn btn-sm btn-danger rounded-0 shadow-none" style={buttonStyle}>Delete</button>
							</React.Fragment>
					}
					{
						this.state.collections.length > 0 &&
							<table className="table table-bordered table-striped table-sm w-auto mt-3">
								<thead>
									<tr>
										<th>&nbsp;</th>
										<th>Claimant</th>
										<th>Member</th>
										<th>Due on</th>
										<th>Paid</th>
									</tr>
								</thead>
								{tbody}
							</table>
					}
				</div>
			</div>
		)
	}
}

export default Member
