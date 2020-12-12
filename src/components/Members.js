import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import PaymentCheckboxes from './PaymentCheckboxes'

class Members extends React.Component {
	constructor(props) {
		super(props)

		let current_page = this.props.match.params.page
		if(typeof current_page === typeof undefined)
			current_page = 1
		else
			current_page = parseInt(current_page)

		this.state = {
			keywords: '',
			current_page: current_page,
			last_page: 1,
			members: [],
			collections: [],
			payments: []
		}

		this.inputKeywordsHandler = this.inputKeywordsHandler.bind(this)
		this.setMemberPaid = this.setMemberPaid.bind(this)
		this.setMemberUnpaid = this.setMemberUnpaid.bind(this)
  }

	componentDidUpdate = (prevProps) => {
		if(this.props.location.pathname !== prevProps.location.pathname)
		{
			let current_page = this.props.match.params.page
			if(typeof current_page === typeof undefined)
				current_page = 1
			else
				current_page = parseInt(current_page)

			this.setState({
				current_page: current_page
			}, () => {
				this.drawTable()
			})
		}
	}

	componentDidMount = () => {
		this.drawTable()
	}

	inputKeywordsHandler = (e) => {
		this.setState({
			keywords: e.target.value,
			current_page: 1
		}, () => {
			this.drawTable()
		})
	}

	drawTable = () => {
    let token = localStorage.getItem('token')
    if(token !== null)
    {
			axios.get('api/members', {
				params: {
					keywords: this.state.keywords,
					page: this.state.current_page
				},
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(response => {
				this.setState({
					current_page: response.data.members.current_page,
					last_page: response.data.members.last_page,
					members: response.data.members.data,
					collections: response.data.collections,
					payments: response.data.payments
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

	setMemberPaid = (e) => {
		let memberId = parseInt(e.target.dataset.memberId)
		let collectionId = parseInt(e.target.dataset.collectionId)

		this.setState({
			payments: {
				...this.state.payments,
				[memberId]: {
					...this.state.payments[memberId],
					[collectionId]: true
				}
			}
		})

		let token = localStorage.getItem('token')
    if(token !== null)
    {
			let params = {
				member_id: memberId,
				collection_id: collectionId
			}

			axios.get('sanctum/csrf-cookie')
			.then(() => {
				axios.post('api/payments', params, {headers: { Authorization: 'Bearer ' + token	} })
			})
		}
	}

	setMemberUnpaid = (e) => {
		let memberId = parseInt(e.target.dataset.memberId)
		let collectionId = parseInt(e.target.dataset.collectionId)

		this.setState({
			payments: {
				...this.state.payments,
				[memberId]: {
					...this.state.payments[memberId],
					[collectionId]: false
				}
			}
		})

		let token = localStorage.getItem('token')
    if(token !== null)
    {
			let params = {
				member_id: memberId,
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

		if(this.state.members.length > 0)
		{
			var members = this.state.members.map(member => {
				let payment = this.state.payments[member.id]

				var due_dates_td = this.state.collections.map(collection => {
					let paid = payment[collection.id]

					return (
						<td className="text-center" key={`m-${member.id}-c-${collection.id}`}>
							<PaymentCheckboxes paid={paid} member_id={member.id} collection_id={collection.id} setMemberPaid={this.setMemberPaid} setMemberUnpaid={this.setMemberUnpaid} />
						</td>
					)
				})

				return (
					<tr key={`m-${member.id}`}>
						<td>
							<Link to={`/member/${member.id}`}>
								{member.last_name}, {member.first_name} {member.suffix !== null ? member.suffix : ''} {member.middle_initial !== null ? `${member.middle_initial}.` : ''}
							</Link>
						</td>
						{due_dates_td}
					</tr>
				)
			})

			tbody = <tbody>{members}</tbody>
		}

		let due_dates_tr

		if(typeof this.state.collections !== typeof undefined && this.state.collections.length > 0)
		{
			var collection_rows = this.state.collections.map((collection) => {
				return (
					<th key={`c-${collection.id}`} style={{ fontWeight: 'normal', cursor: 'default' }}>{collection.due_on}</th>
				)
			})

			due_dates_tr = <tr>{collection_rows}</tr>
		}

		let pagination

		if(this.state.last_page > 1) {
			let prev_url, next_url

			if(this.state.current_page > 1)
				prev_url = '/members' + (this.state.current_page > 2 ? '/page/' + (this.state.current_page - 1).toString() : '')

			if(this.state.current_page < this.state.last_page)
				next_url = '/members/page/' + (this.state.current_page + 1).toString()

			pagination = (
				<nav>
					<ul className="pagination">
						{
							this.state.current_page === 1 ?
								<li className="page-item disabled">
									<span className="page-link">&laquo; Previous</span>
								</li>
							:
								<li className="page-item">
									<Link to={prev_url}>
										<span className="page-link">&laquo; Previous</span>
									</Link>
								</li>
						}
						{
							this.state.current_page === this.state.last_page ?
								<li className="page-item disabled">
									<span className="page-link">Next &raquo;</span>
								</li>
							:
								<li className="page-item">
									<Link to={next_url}>
										<span className="page-link">Next &raquo;</span>
									</Link>
								</li>
						}
					</ul>
				</nav>
			)
		}

		return (
			<div className="row">
				<div className="col-lg-12">
					<h2>Members</h2>
					<Link to="/member/add">
						<span className="btn btn-sm btn-success rounded-0">Add</span>
					</Link>
					<form className="mt-3 w-50">
						<input type="text" className="form-control rounded-0" name="keywords" placeholder="Search keywords..." autoComplete="off" onChange={this.inputKeywordsHandler} />
					</form>
					{
						this.state.members.length > 0 &&
						<React.Fragment>
							<table className="table table-bordered table-striped table-sm w-auto mt-3">
								<thead>
									{
										this.state.collections.length > 0 ?
											<React.Fragment>
												<tr>
													<th className="text-center" rowSpan="2">Member</th>
													{
														this.state.collections.length > 1 ?
															<th className="text-center" colSpan={this.state.collections.length}>Due on</th>
														:
															<th className="text-center">Due on</th>
													}
												</tr>
												{due_dates_tr}
											</React.Fragment>
										:
											<tr>
												<th className="text-center">Member</th>
											</tr>
									}
								</thead>
								{tbody}
							</table>
							{pagination}
						</React.Fragment>
					}
				</div>
			</div>
		)
	}
}

export default Members
