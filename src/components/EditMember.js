import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

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
			back_url: '/members'
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
		const buttonStyle = { marginLeft: '5px' }

		return (
			<div className="row">
				<div className="col-lg-12">
					{
						this.state.member !== null ?
							<h2>{this.state.member.last_name}, {this.state.member.first_name} {this.state.member.suffix !== null ? this.state.member.suffix : ''} {this.state.member.middle_initial !== null ? this.state.member.middle_initial : ''}</h2>
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









				</div>
			</div>
		)
	}
}

export default EditMember
