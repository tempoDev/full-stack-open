import { useSelector } from 'react-redux'

export default function Notification() {
    const notification = useSelector(state => state.notification)

    const style = {
      border: 'solid',
      padding: 10,
      borderWidth: 1
    }
    return (
      <div style={style}>
        { notification }
      </div>
    )
}
