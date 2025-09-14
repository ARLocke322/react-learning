
const notificationReducer = (state, action) => {
    switch (action.type) {
    case 'CONFIRM': return { message: action.payload, type: 'success' }
    case 'ERROR': return { message: action.payload, type: 'error' }
    default: return { message: '', type: 'confirmStyle' }
    }
}


export default notificationReducer