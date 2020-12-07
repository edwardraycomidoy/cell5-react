import React from 'react'

const Home = () => {
	let user = localStorage.getItem('user')
	return (
		<div className="row">
			<div className="col-lg-12">
				<h2>Home</h2>
				<p>{user}</p>
			</div>
		</div>
	)
}

export default Home
