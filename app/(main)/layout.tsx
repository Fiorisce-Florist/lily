export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Fiorisce</h1>
            <div className="flex gap-4">
              <a href="/" className="text-gray-700 hover:text-gray-900">
                Home
              </a>
              <a href="/products" className="text-gray-700 hover:text-gray-900">
                Products
              </a>
              <a href="/cart" className="text-gray-700 hover:text-gray-900">
                Cart
              </a>
              <a href="/login" className="text-gray-700 hover:text-gray-900">
                Login
              </a>
            </div>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2026 Fiorisce Florist. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
