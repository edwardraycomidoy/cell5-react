import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

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
			back_url: '/members'
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
      }).then(response => {
				this.setState({
					member: response.data.member,
					collections: response.data.collections,
					back_url: '/members' + (response.data.current_page > 1 ? '/page/' + response.data.current_page : '')
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
		let tbody

		if(this.state.collections.length > 0)
		{
			const collections = this.state.collections.map((collection) => {
				return (
					<tr key={`c-${collection.id}`}>
						<td>
							<Link to={`/collection/${collection.id}`}>View</Link>
						</td>
						<td>
							{
								collection.claimant_id !== null ?
									<React.Fragment>
										{collection.claimant_last_name}, {collection.claimant_first_name} {collection.claimant_suffix !== null ? collection.claimant_suffix : ''} {collection.claimant_middle_initial !== null ? collection.claimant_middle_initial : ''}
									</React.Fragment>
								:
									<Link to={`/member/${collection.member_id}`}>
											{collection.member_last_name}, {collection.member_first_name} {collection.member_suffix !== null ? collection.member_suffix : ''} {collection.member_middle_initial !== null ? collection.member_middle_initial : ''}
									</Link>
							}
						</td>
						<td>
							{
								collection.claimant_id !== null ?
									<Link to={`/member/${collection.member_id}`}>
										{collection.member_last_name}, {collection.member_first_name} {collection.member_suffix !== null ? collection.member_suffix : ''} {collection.member_middle_initial !== null ? collection.member_middle_initial : ''}
									</Link>
								:
									<em>Claimant</em>
							}
						</td>
						<td>{collection.due_on}</td>
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

			tbody = <tbody>{collections}</tbody>
		}

		const buttonStyle = { marginLeft: '5px' }

		return (
			<div className="row">
				<div className="col-lg-12">
					{
						this.state.member !== null ?
							<h2>{this.state.member.first_name} {this.state.member.middle_initial !== null ? this.state.member.middle_initial : ''} {this.state.member.last_name} {this.state.member.suffix !== null ? this.state.member.suffix : ''}</h2>
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
