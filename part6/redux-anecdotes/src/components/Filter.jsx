import { useDispatch } from "react-redux"

export default function Filter() {

    const dispatch = useDispatch()

    const handleChange = (event) => {
        dispatch({type: 'filter/filterReducer', payload: event.target.value})
    }
    
    const style = {
        marginBottom: 10
    }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}
