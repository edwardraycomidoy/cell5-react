import React from 'react'
import {Link, withRouter} from 'react-router-dom'

class Header extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		let user = localStorage.getItem('user')

		const aStyle = { textDecoration: 'none' }

		const logoutStyle = { border: 'none', outlineStyle: 'none', backgroundColor: 'inherit' }

		return (
			<header className="bg-primary mb-3">
				<div className="container">
					<nav className="navbar navbar-expand-lg navbar-dark px-0">
						<Link style={aStyle} to="/">
							<span className="navbar-brand">Home</span>
						</Link>
						<button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#header-navbar">
							<span className="navbar-toggler-icon"></span>
						</button>
						<div className="collapse navbar-collapse" id="header-navbar">
							{
								user !== null &&
								<ul className="navbar-nav mr-auto">
									<li className="nav-item">
										<Link style={aStyle} to="/members">
											<span className="nav-link">Members</span>
										</Link>
									</li>
									<li className="nav-item">
										<Link style={aStyle} to="/collections">
											<span className="nav-link">Collections</span>
										</Link>
									</li>
								</ul>
							}
							<ul className="navbar-nav ml-auto">
								<li className="nav-item">
									{
										user === null ?
											<Link style={aStyle} to="/login">
												<span className="nav-link">Login</span>
											</Link>
										:
											<button className="nav-link" style={logoutStyle} onClick={this.props.logoutHandler.bind(this)}>Logout</button>
									}
								</li>
							</ul>

						</div>
					</nav>
				</div>
			</header>
		)
	}
}

export default withRouter(Header)
