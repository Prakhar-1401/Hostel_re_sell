import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { FiPhone, FiMail, FiMapPin, FiTrash2 } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}/`)
        setProduct(res.data)
      } catch (err) {
        toast.error('Product not found')
        navigate('/buy')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    try {
      await api.delete(`/products/${id}/delete/`)
      toast.success('Listing deleted')
      navigate('/dashboard')
    } catch {
      toast.error('Failed to delete')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="aspect-video skeleton rounded-xl" />
        <div className="h-8 skeleton w-1/2" />
        <div className="h-6 skeleton w-1/4" />
      </div>
    )
  }

  if (!product) return null

  const whatsappUrl = `https://wa.me/91${product.seller?.phone_number}?text=Hi, I'm interested in your "${product.name}" listed on HostelMart.`

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            {product.images?.length > 0 ? (
              <img
                src={product.images[activeImage]?.image_url || product.images[activeImage]?.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                    i === activeImage ? 'border-primary-500' : 'border-transparent'
                  }`}
                >
                  <img src={img.image_url || img.image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div>
            <span className="text-sm text-primary-600 font-medium">{product.category_name}</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
            <p className="text-3xl font-bold text-primary-600 mt-2">₹{product.price}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              {product.condition?.replace('_', ' ')}
            </span>
            {product.is_sold && (
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                Sold
              </span>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h3 className="font-medium">Description</h3>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">{product.description}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h3 className="font-medium">Location</h3>
            <p className="text-gray-600 text-sm flex items-center space-x-1">
              <FiMapPin />
              <span>{product.hostel_name} {product.room_number && `- Room ${product.room_number}`}</span>
            </p>
          </div>

          {/* Seller Contact */}
          <div className="bg-white border rounded-xl p-4 space-y-3">
            <h3 className="font-medium">Seller: {product.seller?.full_name}</h3>
            <div className="space-y-2">
              <a
                href={`tel:${product.seller?.phone_number}`}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
              >
                <FiPhone /> <span>{product.seller?.phone_number}</span>
              </a>
              <a
                href={`mailto:${product.seller?.email}`}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
              >
                <FiMail /> <span>{product.seller?.email}</span>
              </a>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition"
            >
              <FaWhatsapp size={20} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Owner actions */}
          {user?.id === product.seller?.id && (
            <button
              onClick={handleDelete}
              className="flex items-center justify-center space-x-2 w-full bg-red-50 text-red-600 py-2 rounded-lg border border-red-200 hover:bg-red-100 transition"
            >
              <FiTrash2 />
              <span>Delete Listing</span>
            </button>
          )}

          <p className="text-xs text-gray-400">
            Listed on {new Date(product.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}
