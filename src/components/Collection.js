import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

class Collection extends React.Component {
	constructor(props) {
		super(props)

		let id = this.props.match.params.id
		if(typeof id === typeof undefined)
			this.props.history.push('/collections')

		let current_page = this.props.match.params.page
		if(typeof current_page === typeof undefined)
			current_page = 1
		else
			current_page = parseInt(current_page)
	
		this.state = {
			id: id,
			collection: null,
			members: [],
			back_url: '/collections',
			current_page: current_page,
			last_page: 1
		}
  }

	componentDidUpdate = (prevProps) => {
		if(this.props.location.pathname !== prevProps.location.pathname)
		{
			let id = this.props.match.params.id
			if(typeof id !== typeof undefined)
				id = parseInt(id)
			else
				this.props.history.push('/members')

			let current_page = this.props.match.params.page
			if(typeof current_page === typeof undefined)
				current_page = 1
			else
				current_page = parseInt(current_page)
	
			this.setState({
				id: id,
				current_page: current_page
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
			axios.get(`api/collections/${this.state.id}`, {
				params: {
					page: this.state.current_page
				},
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(response => {
				this.setState({
					current_page: response.data.members.current_page,
					last_page: response.data.members.last_page,
					collection: response.data.collection,
					members: response.data.members.data
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

	render() {
		const collection = this.state.collection

		let tbody

		if(this.state.members.length > 0)
		{
			var rows = this.state.members.map((member) => {
				return (
					<tr key={`m-${member.id}`}>
						<td>
							<Link to={`/member/${member.id}`}>
								{member.last_name}, {member.first_name} {member.suffix !== null ? member.suffix : ''} {member.middle_initial !== null ? `${member.middle_initial}.` : ''}
							</Link>
						</td>
						<td className="text-center">
							<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-square mark-paid" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
								<path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
							</svg>
							<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-check-square mark-unpaid d-none" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
								<path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
								<path fillRule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
							</svg>
						</td>
					</tr>
				)
			})

			tbody = <tbody>{rows}</tbody>
		}

		let pagination

		if(this.state.last_page > 1) {
			let prev_url, next_url

			if(this.state.current_page > 1)
				prev_url = '/collection/' + this.state.id + (this.state.current_page > 2 ? '/page/' + (this.state.current_page - 1).toString() : '')

			if(this.state.current_page < this.state.last_page)
				next_url = '/collection/' + this.state.id + '/page/' + (this.state.current_page + 1).toString()

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

		const buttonStyle = { marginLeft: '5px' }

		return (
			<div className="row">
				<div className="col-lg-12">
					<h2>Collection</h2>
					<Link to={this.state.back_url}>
						<span className="btn btn-sm btn-success rounded-0">Back</span>
					</Link>
					{
						collection !== null &&
							<React.Fragment>
								<Link to={`/collection/edit/${this.state.id}`} style={buttonStyle}>
									<span className="btn btn-sm btn-info rounded-0">Edit</span>
								</Link>
								<button className="btn btn-sm btn-danger rounded-0 shadow-none" style={buttonStyle}>Delete</button>
							</React.Fragment>
					}
					{
						collection !== null &&
						<React.Fragment>
							<table className="table table-bordered table-striped table-sm w-auto mt-3">
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
										<td>{collection.released_on !== null ? collection.released_on : <React.Fragment>&nbsp;</React.Fragment>}</td>
									</tr>
								</tbody>
							</table>
							<table className="table table-bordered table-striped table-sm w-auto mt-3">
								<thead>
									<tr>
										<th>Member</th>
										<th>Paid</th>
									</tr>
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

export default Collection
