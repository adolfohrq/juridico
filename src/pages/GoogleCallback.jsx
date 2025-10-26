import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User } from '../entities/User';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Obter tokens da URL
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          setError('Falha na autenticação com Google');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        if (!accessToken || !refreshToken) {
          setError('Tokens não recebidos');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Processar login com Google
        await User.handleGoogleCallback(accessToken, refreshToken);

        // Redirecionar para dashboard
        navigate('/dashboard');
      } catch (err) {
        console.error('Erro no callback do Google:', err);
        setError('Erro ao processar login');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          {error ? (
            <>
              <div className="mx-auto h-12 w-12 text-red-600 flex items-center justify-center">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Erro na Autenticação
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {error}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Redirecionando para o login...
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto h-12 w-12 text-blue-600 flex items-center justify-center">
                <svg className="animate-spin h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Autenticando...
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Processando seu login com Google
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
