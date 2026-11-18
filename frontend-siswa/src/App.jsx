cat > src/App.jsx << 'EOF'
import { useEffect, useState } from 'react'
import './App.css'

const API_URL = '/api/items'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [nama, setNama] = useState('')

  const fetchItems = async () => {
    try {
      setLoading(true)
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setItems(Array.isArray(data) ? data : data.data ?? [])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleAdd = async () => {
    if (!nama.trim()) return
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama }),
      })
      if (!res.ok) throw new Error('Gagal menambah data')
      setNama('')
      fetchItems()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Gagal menghapus data')
      fetchItems()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1>Data dari Database</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Nama item baru"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
        <button onClick={handleAdd}>Tambah</button>
      </div>

      {loading && <p>Memuat data...</p>}
      {error && <p className="error">Error: {error}</p>}
      {!loading && !error && items.length === 0 && <p>Belum ada data.</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nama}</td>
              <td>
                <button onClick={() => handleDelete(item.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
EOF