"use client";

import { useState } from 'react';

export default function TestEmailPage() {
  const [email, setEmail] = useState('dmitri.ivkin@gmail.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Неизвестная ошибка');
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-6">
            📧 Тест отправки Email
          </h1>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Информация:</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
              <li>Письмо будет отправлено на указанный email</li>
              <li>Также будет отправлено письмо администратору</li>
              <li>Проверьте папку "Входящие" и "Спам"</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email для тестирования:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dmitri.ivkin@gmail.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="mt-2 text-xs text-gray-500">
                В тестовом режиме Resend можно отправлять только на верифицированные email
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Отправка...' : 'Отправить тестовый email'}
            </button>
          </form>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-red-600 font-bold text-lg mr-2">❌</span>
                <h3 className="text-red-800 font-semibold">Ошибка</h3>
              </div>
              <p className="text-red-700 mt-2">{error}</p>
            </div>
          )}

          {result && result.success && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-green-600 font-bold text-lg mr-2">✅</span>
                <h3 className="text-green-800 font-semibold">Успешно!</h3>
              </div>
              <p className="text-green-700 mt-2">
                Тестовые письма отправлены. Проверьте почту!
              </p>
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-green-600 hover:text-green-800">
                  Показать детали ответа
                </summary>
                <pre className="mt-2 p-3 bg-white border border-green-200 rounded text-xs overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {result && !result.success && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-yellow-600 font-bold text-lg mr-2">⚠️</span>
                <h3 className="text-yellow-800 font-semibold">Предупреждение</h3>
              </div>
              {result.error && (
                <p className="text-yellow-700 mt-2">
                  <strong>Ошибка:</strong> {result.error}
                </p>
              )}
              {result.details && (
                <p className="text-yellow-700 mt-2">
                  <strong>Детали:</strong> {result.details}
                </p>
              )}
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-yellow-600 hover:text-yellow-800">
                  Показать полный ответ
                </summary>
                <pre className="mt-2 p-3 bg-white border border-yellow-200 rounded text-xs overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
