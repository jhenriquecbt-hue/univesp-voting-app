import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Image } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../supabase'

export default function ProjectSubmission() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    summary: '',
    techniques: '',
    example: '',
    image_url: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const charLimits = {
    summary: 500,
    techniques: 600,
    example: 1000
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome do projeto é obrigatório'
    }
    
    if (!formData.summary.trim()) {
      newErrors.summary = 'Resumo é obrigatório'
    } else if (formData.summary.length > charLimits.summary) {
      newErrors.summary = `Resumo deve ter no máximo ${charLimits.summary} caracteres`
    }
    
    if (!formData.techniques.trim()) {
      newErrors.techniques = 'Técnicas é obrigatório'
    } else if (formData.techniques.length > charLimits.techniques) {
      newErrors.techniques = `Técnicas deve ter no máximo ${charLimits.techniques} caracteres`
    }
    
    if (!formData.example.trim()) {
      newErrors.example = 'Exemplo é obrigatório'
    } else if (formData.example.length > charLimits.example) {
      newErrors.example = `Exemplo deve ter no máximo ${charLimits.example} caracteres`
    }
    
    if (formData.image_url && !isValidUrl(formData.image_url)) {
      newErrors.image_url = 'URL da imagem inválida'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpar erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: formData.name.trim(),
          summary: formData.summary.trim(),
          techniques: formData.techniques.trim(),
          example: formData.example.trim(),
          image_url: formData.image_url.trim() || null
        })
      
      if (error) throw error
      
      setSuccess(true)
      setFormData({
        name: '',
        summary: '',
        techniques: '',
        example: '',
        image_url: ''
      })
      
      // Redirecionar após 3 segundos
      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
      
    } catch (error) {
      setErrors({ submit: 'Erro ao salvar projeto. Tente novamente.' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Save className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-lead-gray mb-2">
            Projeto Salvo!
          </h2>
          <p className="text-gray-600 mb-4">
            Seu projeto foi submetido com sucesso.
          </p>
          <p className="text-sm text-gray-500">
            Redirecionando para o dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-off-white">
      <div className="bg-white border-b-2 border-gray-300">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-bauhaus-red hover:text-red-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-lead-gray mb-2">
            Submeter Projeto
          </h1>
          <p className="text-gray-600">
            Preencha os dados do seu projeto para participar da votação.
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 text-sm">
                {errors.submit}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-lead-gray mb-2">
                Nome do Projeto *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`input-field w-full ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Nome do seu projeto"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-lead-gray mb-2">
                Resumo * 
                <span className="text-gray-500 ml-2">
                  ({formData.summary.length}/{charLimits.summary} caracteres)
                </span>
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                className={`textarea-field w-full h-24 ${errors.summary ? 'border-red-500' : ''}`}
                placeholder="Descreva brevemente o seu projeto..."
                maxLength={charLimits.summary}
                required
              />
              {errors.summary && (
                <p className="mt-1 text-sm text-red-600">{errors.summary}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-lead-gray mb-2">
                Técnicas Utilizadas *
                <span className="text-gray-500 ml-2">
                  ({formData.techniques.length}/{charLimits.techniques} caracteres)
                </span>
              </label>
              <textarea
                value={formData.techniques}
                onChange={(e) => handleInputChange('techniques', e.target.value)}
                className={`textarea-field w-full h-32 ${errors.techniques ? 'border-red-500' : ''}`}
                placeholder="Descreva as técnicas e tecnologias utilizadas..."
                maxLength={charLimits.techniques}
                required
              />
              {errors.techniques && (
                <p className="mt-1 text-sm text-red-600">{errors.techniques}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-lead-gray mb-2">
                Exemplo de Aplicação *
                <span className="text-gray-500 ml-2">
                  ({formData.example.length}/{charLimits.example} caracteres)
                </span>
              </label>
              <textarea
                value={formData.example}
                onChange={(e) => handleInputChange('example', e.target.value)}
                className={`textarea-field w-full h-40 ${errors.example ? 'border-red-500' : ''}`}
                placeholder="Descreva um exemplo prático de aplicação do seu projeto..."
                maxLength={charLimits.example}
                required
              />
              {errors.example && (
                <p className="mt-1 text-sm text-red-600">{errors.example}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-lead-gray mb-2">
                URL da Imagem
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  className={`input-field w-full pl-10 ${errors.image_url ? 'border-red-500' : ''}`}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              {errors.image_url && (
                <p className="mt-1 text-sm text-red-600">{errors.image_url}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Opcional: URL de uma imagem que represente seu projeto
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border-2 border-gray-300 text-lead-gray font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando...' : 'Salvar Projeto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
