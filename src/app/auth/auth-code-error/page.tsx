export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-6">
          There was an error confirming your email. This could be because:
        </p>
        <ul className="text-left text-gray-600 mb-6 space-y-2">
          <li>• The confirmation link has expired</li>
          <li>• The link has already been used</li>
          <li>• The link is invalid</li>
        </ul>
        <a
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Login
        </a>
      </div>
    </div>
  )
}