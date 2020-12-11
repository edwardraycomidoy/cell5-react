import React from 'react'

class AddCollectionForm extends React.Component {
	render() {
		let options

		if(this.props.state.members.length > 0)	{
			options = this.props.state.members.map((members) => {
				return (
					<option key={`m-${members.id}`} value={members.id}>
            {members.last_name}, {members.first_name} {members.suffix !== null ? members.suffix : ''} {members.middle_initial !== null ? `${members.middle_initial}.` : ''}
					</option>
				)
			})
		}

   	return (
      <div className="card rounded-0 mt-3 w-100">
        <div className="card-body">
          <form onSubmit={this.props.submitHandler}>
            <div className="form-group">
              <label>Member</label>
              <select
                name="member_id"
                className="form-control rounded-0"
                onChange={this.props.inputHandler}
                value={this.props.state.input.member_id}
                required
              >
                <option value="">&nbsp;</option>
                {options}
              </select>
							<small className={'form-text text-danger' + (this.props.state.errors.member_id === null ? ' d-none' : '')}>{this.props.state.errors.member_id}</small>
            </div>
            <div className="form-group mb-0">
              <label>Claimant</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="claimant" id="claimant-member" value="0" checked={this.props.state.input.claimant === 0 ? 'checked' : ''} onChange={this.props.toggleClaimantHandler} />
              <label className="form-check-label" htmlFor="claimant-member">Member</label>
            </div>
            <div className="form-check mb-3">
              <input className="form-check-input" type="radio" name="claimant" id="claimant-beneficiary" value="1" checked={this.props.state.input.claimant === 1 ? 'checked' : ''} onChange={this.props.toggleClaimantHandler} />
              <label className="form-check-label" htmlFor="claimant-beneficiary">Beneficiary</label>
            </div>
            {
              this.props.state.input.claimant === 1 &&
							<React.Fragment>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control rounded-0"
                    name="first_name"
                    value={this.props.state.input.first_name}
                    onChange={this.props.inputHandler}
                    required
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
                    required
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
              </React.Fragment>
            }
            <div className="form-group">
              <label>Due on</label>
              <input
                type="date"
                className="form-control rounded-0"
                name="due_on"
                value={this.props.state.input.due_on}
                required
                onChange={this.props.inputHandler}
                onBlur={this.props.inputHandler}
              />
              <small className={'form-text text-danger' + (this.props.state.errors.due_on === null ? ' d-none' : '')}>{this.props.state.errors.due_on}</small>
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded-0 mt-2">Submit</button>
          </form>
        </div>
      </div>
    )
  }
}

export default AddCollectionForm
