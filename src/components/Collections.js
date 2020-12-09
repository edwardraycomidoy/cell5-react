import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

class Collections extends React.Component {
	constructor(props) {
		super(props)

		let current_page = this.props.match.params.page
		if(typeof current_page === typeof undefined)
			current_page = 1
		else
			current_page = parseInt(current_page)

		this.state = {
			current_page: current_page,
			last_page: 1,
			collections: []
		}
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

	drawTable = () => {
    let token = localStorage.getItem('token')
    if(token !== null)
    {
			axios.get('api/collections', {
				params: {
					page: this.state.current_page
				},
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(response => {
				this.setState({
					current_page: response.data.collections.current_page,
					last_page: response.data.collections.last_page,
					collections: response.data.collections.data
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

	render() {
		let tbody

		if(this.state.collections.length > 0)	{
			let collections = this.state.collections.map((collection) => {
				return (
					<tr key={`c-${collection.id}`}>
						<td>
							<Link to={`/member/${collection.member_id}`}>
								{collection.member_last_name}, {collection.member_first_name} {collection.member_suffix !== null ? collection.member_suffix : ''} {collection.member_middle_initial !== null ? collection.member_middle_initial : ''}
							</Link>
						</td>
						<td>
							{
								collection.claimant_id !== null ?
									<React.Fragment>
										{collection.claimant_last_name}, {collection.claimant_first_name} {collection.claimant_suffix !== null ? collection.claimant_suffix : ''} {collection.claimant_middle_initial !== null ? collection.claimant_middle_initial : ''}
									</React.Fragment>
								:
									<em>Member</em>
							}
						</td>
						<td>{collection.due_on}</td>
						<td>{collection.released_on !== null ? collection.released_on : <React.Fragment>&nbsp;</React.Fragment>}</td>
						<td>
							<Link to={`/collection/${collection.id}`}>View</Link>
						</td>
					</tr>
				)
			})

			tbody = <tbody>{collections}</tbody>
		}

		let pagination

		if(this.state.last_page > 1) {
			let prev_url, next_url

			if(this.state.current_page > 1)
				prev_url = '/collections' + (this.state.current_page > 2 ? '/page/' + (this.state.current_page - 1).toString() : '')

			if(this.state.current_page < this.state.last_page)
				next_url = '/collections/page/' + (this.state.current_page + 1).toString()

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
					<h2>Collections</h2>
						<Link to="/">
							<span className="btn btn-sm btn-success rounded-0">Add</span>
						</Link>
						{
							this.state.collections.length > 0 &&
							<React.Fragment>
								<table className="table table-bordered table-striped table-sm w-auto mt-3">
									<thead>
										<tr>
											<th>Member</th>
											<th>Claimant</th>
											<th>Due on</th>
											<th>Released on</th>
											<th>&nbsp;</th>
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

export default Collections
