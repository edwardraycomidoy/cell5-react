import React from 'react'

class AddMemberForm extends React.Component {
	render() {
   	return (
      <div className="card rounded-0 mt-3 w-100">
        <div className="card-body">
          <form onSubmit={this.props.submitHandler}>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                className="form-control rounded-0"
                name="first_name"
                value={this.props.state.input.first_name}
                onChange={this.props.inputHandler}
              />
							<small className={'form-text text-danger' + (this.props.state.errors.first_name === null ? ' d-none' : '')}>{this.props.state.errors.first_name}</small>
            </div>
            <div className="form-group">
              <label>Middle Initial</label>
              <input
                type="text"
                className="form-control rounded-0"
                name="middle_initial"
                value={this.props.state.input.middle_initial}
                onChange={this.props.inputHandler}
              />
							<small className={'form-text text-danger' + (this.props.state.errors.middle_initial === null ? ' d-none' : '')}>{this.props.state.errors.middle_initial}</small>
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                className="form-control rounded-0"
                name="last_name"
                value={this.props.state.input.last_name}
                onChange={this.props.inputHandler}
              />
							<small className={'form-text text-danger' + (this.props.state.errors.last_name === null ? ' d-none' : '')}>{this.props.state.errors.last_name}</small>
            </div>
            <div className="form-group">
              <label>Suffix</label>
              <input
                type="text"
                className="form-control rounded-0"
                name="suffix"
                value={this.props.state.input.suffix}
                onChange={this.props.inputHandler}
              />
							<small className={'form-text text-danger' + (this.props.state.errors.suffix === null ? ' d-none' : '')}>{this.props.state.errors.suffix}</small>
            </div>
            <div className="form-group">
              <label>Joined on</label>
              <input
                type="date"
                className="form-control rounded-0"
                name="joined_on"
                value={this.props.state.input.joined_on}
                required
                onChange={this.props.inputHandler}
                onBlur={this.props.inputHandler}
              />
							<small className={'form-text text-danger' + (this.props.state.errors.joined_on === null ? ' d-none' : '')}>{this.props.state.errors.joined_on}</small>
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded-0 mt-2">Submit</button>
          </form>
        </div>
      </div>
    )
  }
}

export default AddMemberForm
