import React from 'react'
import {Link} from 'react-router-dom'

class Collections extends React.Component {
	render () {
		return (
			<div className="row">
				<div className="col-lg-12">
					<h2>Collections</h2>
					<Link to="/">
							<span className="btn btn-sm btn-success rounded-0">Add</span>
						</Link>









				</div>
			</div>
		)
	}
}

export default Collections
