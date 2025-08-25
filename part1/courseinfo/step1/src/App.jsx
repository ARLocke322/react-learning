const Header = (props) => {
  // console.log(props)
  return (
    <h1>{props.course}</h1>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>{props.part} {props.excercise}</p>
    </div>
  )
}
const Content = (props) => {

  return (
    <div>
      <Part part={props.parts[0].name} excercise={props.parts[0].excercises} />
      <Part part={props.parts[1].name} excercise={props.parts[1].excercises} />
      <Part part={props.parts[2].name} excercise={props.parts[2].excercises} />
    </div>
  )
}

const Total = (props) => {
  console.log(props)
  const sum = props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises
  return (
    <div>
      <p>Number of exercises {sum}</p>
    </div>
  )

}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App