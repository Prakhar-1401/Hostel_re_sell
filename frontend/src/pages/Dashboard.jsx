import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi'

export default function Dashboard() {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('active') // active, sold

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const res = await api.get('/products/my-listings/')
      setListings(res.data.results || res.data)
    } catch {
      toast.error('Failed to fetch listings')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return
    try {
      await api.delete(`/products/${id}/delete/`)
      setListings(listings.filter(l => l.id !== id))
      toast.success('Deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleMarkSold = async (id) => {
    try {
      await api.patch(`/products/${id}/update/`, { is_sold: true, is_available: false })
      fetchListings()
      toast.success('Marked as sold')
    } catch {
      toast.error('Failed to update')
    }
  }

  const activeListings = listings.filter(l => !l.is_sold)
  const soldListings = listings.filter(l => l.is_sold)
  const displayed = tab === 'active' ? activeListings : soldListings

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <Link
          to="/sell"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          + New Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border text-center">
          <p className="text-2xl font-bold text-primary-600">{listings.length}</p>
          <p className="text-sm text-gray-600">Total Listings</p>
        </div>
        <div className="bg-white rounded-xl p-4 border text-center">
          <p className="text-2xl font-bold text-green-600">{activeListings.length}</p>
          <p className="text-sm text-gray-600">Active</p>
        </div>
        <div className="bg-white rounded-xl p-4 border text-center">
          <p className="text-2xl font-bold text-orange-600">{soldListings.length}</p>
          <p className="text-sm text-gray-600">Sold</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setTab('active')}
          className={`pb-2 px-1 font-medium ${tab === 'active' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'}`}
        >
          Active Listings
        </button>
        <button
          onClick={() => setTab('sold')}
          className={`pb-2 px-1 font-medium ${tab === 'sold' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'}`}
        >
          Sold Items
        </button>
      </div>

      {/* Listings */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 skeleton rounded-lg" />)}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No {tab} listings yet.
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.thumbnail && <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />}
                </div>
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-primary-600 font-bold">₹{item.price}</p>
                  <p className="text-xs text-gray-500">{item.category_name} • {item.condition?.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link to={`/product/${item.id}`} className="p-2 text-gray-500 hover:text-primary-600">
                  <FiEye />
                </Link>
                {!item.is_sold && (
                  <button
                    onClick={() => handleMarkSold(item.id)}
                    className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100"
                  >
                    Mark Sold
                  </button>
                )}
                <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-red-600">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
