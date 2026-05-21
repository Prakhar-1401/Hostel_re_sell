import { Link } from 'react-router-dom'
import { FiShoppingBag, FiDollarSign, FiArrowRight } from 'react-icons/fi'

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Hostel Marketplace
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Buy & sell used items within your hostel community. 
          From coolers to cycles — find affordable deals or sell what you no longer need.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/buy"
            className="inline-flex items-center justify-center space-x-2 bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700 transition"
          >
            <FiShoppingBag />
            <span>Buy Products</span>
          </Link>
          <Link
            to="/sell"
            className="inline-flex items-center justify-center space-x-2 bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-50 transition"
          >
            <FiDollarSign />
            <span>Sell Products</span>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">1</span>
            </div>
            <h3 className="font-semibold mb-2">List Your Item</h3>
            <p className="text-gray-600 text-sm">Upload photos, set price, and describe your item</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">2</span>
            </div>
            <h3 className="font-semibold mb-2">Get Discovered</h3>
            <p className="text-gray-600 text-sm">Buyers browse categories and find your listing</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">3</span>
            </div>
            <h3 className="font-semibold mb-2">Connect & Deal</h3>
            <p className="text-gray-600 text-sm">Buyers contact you directly via WhatsApp or phone</p>
          </div>
        </div>
      </section>

      {/* Popular categories preview */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Popular Categories</h2>
          <Link to="/buy" className="text-primary-600 flex items-center space-x-1 hover:underline">
            <span>View All</span>
            <FiArrowRight />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Cooler', 'Cycle', 'Mattress', 'Electronics', 'Books', 'Furniture', 'Kettle', 'Guitar'].map((cat) => (
            <Link
              key={cat}
              to={`/buy/${cat.toLowerCase()}`}
              className="bg-white rounded-xl p-6 text-center shadow-sm border hover:shadow-md transition"
            >
              <span className="text-lg font-medium text-gray-800">{cat}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
