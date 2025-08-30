const Persons = ({ persons, newFilter, deletePerson }) => {
    return (
        persons.filter((person) => (person.name.toLowerCase().includes(newFilter) || person.number.toLowerCase().includes(newFilter)))
            .map(person =>
                <Person key={person.number} person={person} deletePerson={deletePerson}/>
            )
    )
}

const Person = ({ person,  deletePerson}) => {
    const handleDelete = () => {
        if (window.confirm(`Delete ${person.name} ?`)) {
            deletePerson(person.id)
        }
    }
    return (
        <div>
            <p>{person.name} {person.number} <button onClick={handleDelete}>delete</button></p>
            
        </div> 
    )
}

export default Persons