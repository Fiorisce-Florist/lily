export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to Fiorisce</h1>
        <p className="text-xl text-gray-600 mb-8">
          Premium Florist - Beautiful Bouquets for Every Occasion
        </p>
        <a
          href="/products"
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Shop Now
        </a>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Rose Bouquet</h3>
            <p className="text-gray-600 mb-4">Beautiful red roses</p>
            <p className="text-2xl font-bold text-blue-600">Rp 150.000</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Tulip Arrangement</h3>
            <p className="text-gray-600 mb-4">Colorful tulips</p>
            <p className="text-2xl font-bold text-blue-600">Rp 200.000</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Mixed Flowers</h3>
            <p className="text-gray-600 mb-4">Seasonal mix</p>
            <p className="text-2xl font-bold text-blue-600">Rp 180.000</p>
          </div>
        </div>
      </section>
    </div>
  );
}
