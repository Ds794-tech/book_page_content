import Dashboard from './view/Dashboard'
import { Route, Routes } from 'react-router-dom'
import RichTextEditor from './components/editor/Editor'
import Layout from './layout/Layout'
import BookDetails from './view/BookDetail'
import Books from './view/Books'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Books />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/create-page' element={<RichTextEditor />} />
        <Route path='/edit-page/:id' element={<RichTextEditor />} />
        <Route path='/view-page/:id' element={<BookDetails />} />
      </Route>
    </Routes>
  )
}

export default App
