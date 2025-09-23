import axios from 'axios';
import { DiaryEntry, NewDiaryEntry } from '../types';

const baseUrl = 'http://localhost:3000/api/diaries'

export const getAllDiaries = () => {
    return axios.get<DiaryEntry[]>(baseUrl).then(response => response.data)
}

export const createDiary = async (object: NewDiaryEntry) => {
    try {
        const response = await axios.post<DiaryEntry>(baseUrl, object)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error('Creating diary failed, invalid input')
            // Do something with this error...
        } else {
            console.error(error);
        }
    }

}