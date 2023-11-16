import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { addVote } from "../reducers/anecdoteReducer";

export default function AnecdoteList() {

    const dispatch = useDispatch()
    const anecdotes = useSelector(({filter, anecdotes}) => {
        if ( filter !== 'ALL'){
            return anecdotes.filter( anecdote => anecdote.content.toLowerCase().includes( filter.toLowerCase() ))
        } else {
            return anecdotes
        }
    });

  const voteAnecdote = (id, anecdote) => {
    dispatch(addVote(id))
    dispatch(setNotification(`You voted "${anecdote}"`, 5))
  }

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteAnecdote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
}
