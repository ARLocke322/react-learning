const Header = (props) => <h1>{props.course}</h1>


const Total = ({parts}) => <p>Number of exercises {parts.reduce((a, c) => a + c.exercises, 0)}</p>

const Content = ( {parts} ) => (
  <div>
      {parts.map(part =>
        <Part key={part.name} part={part} />
      )}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Course = ({ name, parts }) => {
  return (
    <div>
      <Header course={name} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

export default Course