import { useNotificationValue } from '../NotificationContext'

const styles = {
    success: {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    error: {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }
}

const Notification = () => {
    const { message, type } = useNotificationValue()

    if (!message) return null

    return (
        <div style={styles[type] || 'confirm'}>
            {message}
        </div>
    )
}

export default Notification