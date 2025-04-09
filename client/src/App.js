import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ListPage from './pages/ListPage.js'
import FormPage from './pages/FormPage.js'
import ItemDetailPage from './pages/ItemDetailPage.js'

function App() {
	return (
		<div className='App'>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Navigate to='/list' />} />
					<Route path='/list' element={<ListPage />} />
					<Route path='/form' element={<FormPage />} />
					<Route path='/item/:id' element={<ItemDetailPage />} />
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App
