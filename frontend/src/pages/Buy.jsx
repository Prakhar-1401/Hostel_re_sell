import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import ProductCard from '../components/ProductCard'

export default function Buy() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    ordering: '-created_at',
    condition: '',
    min_price: '',
    max_price: '',
  })

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [filters, search])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/')
      setCategories(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = { ...filters }
      if (search) params.search = search
      Object.keys(params).forEach(k => !params[k] && delete params[k])
      const res = await api.get('/products/', { params })
      setProducts(res.data.results || res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Buy Products</h1>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="overflow-x-auto">
          <div className="flex space-x-3 pb-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/buy/${cat.slug}`}
                className="flex-shrink-0 bg-white border rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:border-primary-300 transition"
              >
                {cat.name} ({cat.product_count})
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border space-y-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
        <div className="flex flex-wrap gap-3">
          <select
            value={filters.ordering}
            onChange={(e) => setFilters({ ...filters, ordering: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="-created_at">Latest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
          </select>
          <select
            value={filters.condition}
            onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="like_new">Like New</option>
            <option value="good">Good</option>
            <option value="average">Average</option>
            <option value="old">Old</option>
          </select>
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.min_price}
            onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
            className="w-24 px-3 py-2 border rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.max_price}
            onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
            className="w-24 px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border">
              <div className="aspect-square skeleton" />
              <div className="p-4 space-y-2">
                <div className="h-4 skeleton w-3/4" />
                <div className="h-5 skeleton w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No products found. Be the first to list something!
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
