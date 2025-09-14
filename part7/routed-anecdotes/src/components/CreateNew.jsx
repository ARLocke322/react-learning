import { useField } from "../hooks"


const CreateNew = (props) => {
    const content = useField('text')
    const author = useField('text')
    const info = useField('text')


    const handleSubmit = (e) => {
        e.preventDefault()
        props.addNew({
            content: content.inputParams.value,
            author: author.inputParams.value,
            info: info.inputParams.value,
            votes: 0
        })
    }

    const clearFields = (e) => {
        e.preventDefault()
        content.reset()
        author.reset()
        info.reset()
        
    }

    return (
        <div>
            <h2>create a new anecdote</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    content
                    <input {...content.inputParams} />
                </div>
                <div>
                    author
                    <input {...author.inputParams} />
                </div>
                <div>
                    url for more info
                    <input {...info.inputParams} />
                </div>
                <button>create</button>
            </form>
            <button onClick={clearFields}>reset</button>
        </div>
    )

}

export default CreateNew
