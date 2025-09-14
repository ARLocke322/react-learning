
const userReducer = (state, action) => {
    switch (action.type) {
    case 'ADD': return action.payload
    case 'CLEAR': return null
    default: return state
    }
}

export default userReducer