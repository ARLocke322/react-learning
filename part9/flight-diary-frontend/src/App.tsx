import { useEffect, useState } from 'react'
import { DiaryEntry, NewDiaryEntry } from './types';
import { getAllDiaries, createDiary } from './services/diaryService';
import DiaryForm from './components/DiaryForm';

const Diary = ({ diary }: { diary: DiaryEntry }) => {
  return (
    <div>
      <h3>{diary.date}</h3>
      <li>{diary.weather}</li>
      <li>{diary.visibility}</li>
      <li>{diary.comment}</li>
    </div>
  )
}

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([])
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data)
    })
  }, [])



  const addDiary = async (diaryObject: NewDiaryEntry) => {
    try {
      const newDiary = await createDiary(diaryObject);
      if (newDiary) {
        setDiaries(diaries.concat(newDiary));
      }
    } catch (e) {
      // Type the error properly
      if (e instanceof Error) {
        setErrorMessage(e.message) 
        setTimeout(() => {
          setErrorMessage('')
        }, 5000)
      }
    }
  };

  return (
    <div>
      <p style={{color: "red"}}>{errorMessage}</p> 
      <DiaryForm addDiary={addDiary} />
      {diaries.map(diary => <Diary key={diary.id} diary={diary} />)}
    </div>
  );
};

export default App;