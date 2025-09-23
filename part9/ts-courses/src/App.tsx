interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartRequirements extends CoursePartDescription {
  requirements: string[];
  kind: "special";
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartRequirements;

const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part",
    kind: "basic"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: "group"
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string",
    kind: "basic"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
    kind: "background"
  },
  {
    name: "TypeScript in frontend",
    exerciseCount: 10,
    description: "a hard part",
    kind: "basic",
  },
  {
    name: "Backend development",
    exerciseCount: 21,
    description: "Typing the backend",
    requirements: ["nodejs", "jest"],
    kind: "special"
  }
];

const Part = ({ course }: { course: CoursePart }) => {
  switch (course.kind) {
    case "basic": {
      return (
        <div>
          <b>{course.name} {course.exerciseCount} </b>
          <p>{course.description}</p>
        </div>
      )
    }
    case "group": {
      return (
        <div>
          <b>{course.name} {course.exerciseCount} </b>
          <p>project exercises {course.groupProjectCount}</p>
        </div>
      )
    }
    case "background": {
      return (
        <div>
          <b>{course.name} {course.exerciseCount} </b>
          <p>{course.description}</p>
          <p>background material: {course.backgroundMaterial}</p>
        </div>
      )
    }
    case "special": {
      return (
        <div>
          <b>{course.name} {course.exerciseCount} </b>
          <p>{course.description}</p>
          <p>required skills: {course.requirements.map(requirement => requirement + "; ")}</p>
        </div>
      )
    }
  }
}

const Header = ({ name }: { name: string }) => <h1>{name}</h1>

const Content = ({ courses }: { courses: CoursePart[] }) => {
  return (
    <div>
      {courses.map(course => <Part key={course.name} course={course} />)}
    </div>
  )

}
const Total = ({ total }: { total: number }) => <p>Number of exercises {total}</p>

const App = () => {
  const courseName = "Half Stack application development";

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header name={courseName} />
      <Content courses={courseParts} />
      <Total total={totalExercises} />
    </div>
  );
};

export default App;