import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, Plus, Vote, LogOut, User, Users, TrendingUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../supabase'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  
  const [projects, setProjects] = useState([])
  const [votingData, setVotingData] = useState([])
  const [userProject, setUserProject] = useState(null)
  const [userVotes, setUserVotes] = useState([])
  const [totalUsers, setTotalUsers] = useState(6) // Assumindo 6 membros no grupo
  const [usersWhoVoted, setUsersWhoVoted] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Buscar todos os projetos com contagem de votos
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          user:users(name, email),
          votes(count)
        `)
        .order('created_at', { ascending: false })

      if (projectsError) throw projectsError
      
      setProjects(projectsData || [])

      // Preparar dados para o gráfico
      const chartData = projectsData?.map(project => ({
        name: project.name.length > 20 ? project.name.substring(0, 20) + '...' : project.name,
        votes: project.votes?.[0]?.count || 0,
        fullName: project.name
      })) || []

      setVotingData(chartData.sort((a, b) => b.votes - a.votes))

      // Buscar projeto do usuário
      const { data: userProjectData } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setUserProject(userProjectData)

      // Buscar votos do usuário
      const { data: userVotesData } = await supabase
        .from('votes')
        .select(`
          project_id,
          projects(name, user:users(name))
        `)
        .eq('user_id', user.id)

      setUserVotes(userVotesData || [])

      // Contar usuários que votaram
      const { data: votersData } = await supabase
        .from('votes')
        .select('user_id')
        .neq('user_id', null)

      const uniqueVoters = new Set(votersData?.map(v => v.user_id))
      setUsersWhoVoted(uniqueVoters.size)

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const votingPercentage = totalUsers > 0 ? (usersWhoVoted / totalUsers) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-lead-gray">Carregando dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-lead-gray">
                Dashboard - Sistema de Votação
              </h1>
              <p className="text-gray-600">
                Bem-vindo, {user.user_metadata?.name || user.email.split('@')[0]}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center text-bauhaus-red hover:text-red-700 font-medium transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-bauhaus-blue" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Participação</p>
                <p className="text-2xl font-bold text-lead-gray">
                  {usersWhoVoted}/{totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Projetos</p>
                <p className="text-2xl font-bold text-lead-gray">
                  {projects.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <Vote className="w-6 h-6 text-bauhaus-red" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Seus Votos</p>
                <p className="text-2xl font-bold text-lead-gray">
                  {userVotes.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="card mb-8">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-lead-gray">Progresso da Votação</h3>
              <span className="text-sm font-medium text-gray-600">
                {votingPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-bauhaus-red h-4 rounded-full transition-all duration-300"
                style={{ width: `${votingPercentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {usersWhoVoted} de {totalUsers} membros já votaram
            </p>
          </div>
        </div>

        {/* Voting Chart */}
        <div className="card mb-8">
          <h3 className="text-lg font-bold text-lead-gray mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Votos por Projeto
          </h3>
          {votingData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={votingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      return (
                        <div className="bg-white p-2 border border-gray-300 shadow-sm">
                          <p className="font-medium">{payload[0].payload.fullName}</p>
                          <p className="text-sm">Votos: {payload[0].value}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="votes" fill="#DC143C" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-600">
              Nenhum projeto encontrado
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => navigate('/submit')}
            className="card hover:border-bauhaus-red transition-colors text-left group"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-bauhaus-red rounded-lg flex items-center justify-center mr-4 group-hover:bg-red-700 transition-colors">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lead-gray mb-1">
                  {userProject ? 'Editar Projeto' : 'Submeter Projeto'}
                </h3>
                <p className="text-sm text-gray-600">
                  {userProject 
                    ? 'Atualize os dados do seu projeto' 
                    : 'Adicione seu projeto à votação'
                  }
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/voting')}
            className="card hover:border-bauhaus-blue transition-colors text-left group"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-bauhaus-blue rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-700 transition-colors">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lead-gray mb-1">Votar em Projetos</h3>
                <p className="text-sm text-gray-600">
                  Selecione 3 projetos para votar
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* User Info */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Seu e-mail</p>
                <p className="font-medium text-lead-gray">{user.email}</p>
              </div>
            </div>
            {userProject && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Seu projeto</p>
                <p className="font-medium text-lead-gray">{userProject.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
