import React from 'react';
import ToDoItem from './ToDoItem.js'
import todosData from './todosData'

class Main extends React.Component {
		render() {
				const todoItems = todosData.map(item => <ToDoItem key={item.id} item={item} />)
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
