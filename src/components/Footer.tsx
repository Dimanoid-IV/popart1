export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-indigo-600 mb-4">PopArt.ee</h3>
            <p className="text-sm text-gray-600">
              Transforming your precious memories into artistic digital paintings.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: info@popart.ee</li>
              <li>Location: Tallinn, Estonia</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PopArt.ee. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
