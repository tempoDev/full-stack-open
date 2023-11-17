import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateVote } from './request'
import { useNotificationDispatch } from './notificationContext'

const App = () => {

  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const handleVote = async (anecdote) => {
    console.log('vote')
    updateVoteMutation.mutate({...anecdote, votes: anecdote.votes + 1 })
    await dispatch({ type: 'showNotification', payload: `You voted for '${anecdote.content}'`})

    setTimeout( () => {
      dispatch({ type: 'hideNotification'})
    }, 5000)
  }

  const updateVoteMutation = useMutation(
    updateVote,
    {
      onSuccess: (updatedAnecdote) => {
        const anecdotes = queryClient.getQueryData('anecdotes')
        queryClient.setQueriesData('anecdotes', anecdotes.map( ( anecdote ) => {
          return anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
        }))
      }
    }
  )

  const result = useQuery(
    'anecdotes',
    getAnecdotes,
    {
      retry: 1,
      refetchOnWindowFocus: false
    })

  console.log(result)

  if( result.isLoading ){
    return <div>Loading data...</div>
  }

  if( result.isError){
    return <div>Anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
