import React from 'react';
import ToDoItem from './ToDoItem.js'
import todosData from './todosData'

class Main extends React.Component {
		constructor(){
				super()
				this.state = {
						todos: todosData,
				}
				this.handleChange = this.handleChange.bind(this)
		}

		handleChange(id){
				this.setState(prevState => { 
						let updatedTodos = prevState.todos.map(todo => {
								if(todo.id === id){
										todo.completed = !todo.completed;
								}
								return todo
						})
						return {
								todos: updatedTodos
						}
				})
		}

		render() {
				const todoItems = this.state.todos.map(
						item => <ToDoItem key={item.id} 
								item={item} 
								handleChange={this.handleChange}/>)
				return (
						<main>
								<div id='todo-list'>
										{todoItems}
								</div>
						</main>
				);
		}
}

export default Main
