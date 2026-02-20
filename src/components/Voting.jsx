import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckSquare, Square, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../supabase'

export default function Voting() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [projects, setProjects] = useState([])
  const [selectedProjects, setSelectedProjects] = useState([])
  const [userProject, setUserProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProjects()
    fetchUserProject()
    fetchUserVotes()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          user:users(name, email),
          votes(count)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      setError('Erro ao carregar projetos')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      setUserProject(data)
    } catch (error) {
      console.error('Erro ao buscar projeto do usuário:', error)
    }
  }

  const fetchUserVotes = async () => {
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('project_id')
        .eq('user_id', user.id)

      if (error) throw error
      
      setSelectedProjects(data?.map(vote => vote.project_id) || [])
    } catch (error) {
      console.error('Erro ao buscar votos do usuário:', error)
    }
  }

  const toggleProjectSelection = (projectId) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(prev => prev.filter(id => id !== projectId))
    } else {
      if (selectedProjects.length >= 3) {
        setError('Você só pode selecionar exatamente 3 projetos')
        setTimeout(() => setError(''), 3000)
        return
      }
      setSelectedProjects(prev => [...prev, projectId])
    }
  }

  const canSubmit = selectedProjects.length === 3

  const handleSubmitVotes = async () => {
    if (!canSubmit) return

    setSubmitting(true)
    setError('')

    try {
      // Remover votos anteriores
      await supabase
        .from('votes')
        .delete()
        .eq('user_id', user.id)

      // Inserir novos votos
      const votesToInsert = selectedProjects.map(projectId => ({
        user_id: user.id,
        project_id: projectId
      }))

      const { error } = await supabase
        .from('votes')
        .insert(votesToInsert)

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)

    } catch (error) {
      setError('Erro ao salvar votos. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-lead-gray">Carregando projetos...</div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-lead-gray mb-2">
            Votos Confirmados!
          </h2>
          <p className="text-gray-600 mb-4">
            Seus votos foram registrados com sucesso.
          </p>
          <p className="text-sm text-gray-500">
            Redirecionando para o dashboard...
          </p>
        </div>
      </div>
    )
  }

  const availableProjects = projects.filter(project => 
    project.user_id !== user.id
  )

  return (
    <div className="min-h-screen bg-off-white">
      <div className="bg-white border-b-2 border-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-bauhaus-red hover:text-red-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-lead-gray mb-2">
            Votação de Projetos
          </h1>
          <p className="text-gray-600">
            Selecione exatamente 3 projetos para votar. Você não pode votar no seu próprio projeto.
          </p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border-2 border-bauhaus-blue">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-bauhaus-blue mr-2" />
              <span className="font-medium text-lead-gray">
                Projetos selecionados: {selectedProjects.length}/3
              </span>
            </div>
            <div className={`px-3 py-1 rounded text-sm font-medium ${
              canSubmit 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {canSubmit ? 'Pronto para votar!' : 'Selecione 3 projetos'}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 border border-red-200 text-sm">
            {error}
          </div>
        )}

        {availableProjects.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">
              Nenhum projeto disponível para votação no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {availableProjects.map((project) => {
              const isSelected = selectedProjects.includes(project.id)
              const voteCount = project.votes?.[0]?.count || 0
              
              return (
                <div
                  key={project.id}
                  className={`card cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'border-bauhaus-red bg-red-50' 
                      : 'hover:border-gray-400 hover:shadow-md'
                  }`}
                  onClick={() => toggleProjectSelection(project.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-lead-gray mb-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        por {project.user?.name}
                      </p>
                    </div>
                    <div className="ml-4">
                      {isSelected ? (
                        <CheckSquare className="w-6 h-6 text-bauhaus-red" />
                      ) : (
                        <Square className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {project.image_url && (
                    <div className="mb-4">
                      <img
                        src={project.image_url}
                        alt={project.name}
                        className="w-full h-32 object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-lead-gray">Resumo:</span>
                      <p className="text-gray-600 line-clamp-2">
                        {project.summary}
                      </p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-lead-gray">Técnicas:</span>
                      <p className="text-gray-600 line-clamp-2">
                        {project.techniques}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Votos recebidos:</span>
                      <span className="font-medium text-lead-gray">{voteCount}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleSubmitVotes}
            disabled={!canSubmit || submitting}
            className={`btn-primary px-8 py-3 ${
              !canSubmit || submitting 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
          >
            {submitting ? 'Processando...' : 'Confirmar Votos'}
          </button>
        </div>
      </div>
    </div>
  )
}
