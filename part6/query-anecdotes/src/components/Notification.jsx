import { useNotificationValue } from "../notificationContext"

const Notification = () => {

  const Notification = useNotificationValue()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  if ( Notification === '') return null

  return (
    <div style={style}>
      { Notification }
    </div>
  )
}

export default Notification
