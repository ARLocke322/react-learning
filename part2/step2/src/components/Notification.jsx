const Notification = ({ message, style }) => {
    const confirmStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 1,
        marginBottom: 10,
    }
    const errorStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 1,
        marginBottom: 10,
    }

    if (message === null) {
        return null
    }

    return (
        <div style={style === 'confirmStyle' ? confirmStyle : errorStyle}>
            {message}
        </div>
    )
}

export default Notification