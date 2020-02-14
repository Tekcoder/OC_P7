import React from 'react';
import ToDoItem from './ToDoItem.js'
import todosData from './todosData'

function Main() {
		const todoItems = todosData.map(item => <ToDoItem key={item.id} item={item} />)
		return (
				<main>
						<div id='todo-list'>
								{todoItems}
						</div>
				</main>
		);
}

export default Main
