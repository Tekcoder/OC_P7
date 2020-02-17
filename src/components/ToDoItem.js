import React from 'react'

class ToDoItem extends React.Component{
		render(){
				return (
						<div className='todo-item'>
								<input 
										type='checkbox' 
										defaultChecked={this.props.item.completed} 
										onChange={(event) => this.props.handleChange(this.props.item.id)}
								/>
								<p>{this.props.item.text}</p>
						</div>
				)
		}
}

export default ToDoItem
