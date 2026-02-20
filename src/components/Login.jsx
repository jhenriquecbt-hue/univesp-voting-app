import React, { useState } from 'react'
import { User, Mail, Lock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password, name)
        setError('Cadastro realizado! Verifique seu e-mail para confirmar.')
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-bauhaus-red text-white mb-4">
              <User className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-lead-gray mb-2">
              {isSignUp ? 'Cadastro' : 'Login'}
            </h1>
            <p className="text-gray-600">
              Sistema de Votação de Projetos - Univesp
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-lead-gray mb-2">
                  Nome
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field w-full pl-10"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-lead-gray mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full pl-10"
                  placeholder="seu.email@aluno.univesp.br"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-lead-gray mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full pl-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className={`p-3 text-sm ${error.includes('realizado') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processando...' : (isSignUp ? 'Cadastrar' : 'Entrar')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="text-bauhaus-red hover:text-red-700 font-medium transition-colors"
            >
              {isSignUp ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
            </button>
          </div>

          <div className="mt-4 p-3 bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              <strong>Aviso:</strong> Apenas e-mails terminados em @aluno.univesp.br são permitidos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
