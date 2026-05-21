import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const conditionColors = {
    new: 'bg-green-100 text-green-800',
    like_new: 'bg-blue-100 text-blue-800',
    good: 'bg-yellow-100 text-yellow-800',
    average: 'bg-orange-100 text-orange-800',
    old: 'bg-red-100 text-red-800',
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
        <p className="text-xl font-bold text-primary-600 mt-1">₹{product.price}</p>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs px-2 py-1 rounded-full ${conditionColors[product.condition] || 'bg-gray-100'}`}>
            {product.condition?.replace('_', ' ')}
          </span>
          <span className="text-xs text-gray-500">{product.hostel_name}</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(product.created_at).toLocaleDateString()}
        </p>
      </div>
    </Link>
  )
}
