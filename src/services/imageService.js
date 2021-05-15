import { SERVICE_URL } from '../utils/apiHelper';
import endPoints from '../utils/endPoints';
import axios from 'axios';

//using a harcoded value since this is made for a single user.
const testUser = "testUser1";

export const getAllImages = async () => {
    return axios.get(SERVICE_URL + endPoints.FETCH_IMAGES);
}

export const getImageByUserId = async () => {
  return axios.get(SERVICE_URL + endPoints.FETCH_IMAGES + testUser);
}

export const saveSelectedImages = (data) => {
  return axios.post(SERVICE_URL + endPoints.SAVE_SELECTED_IMAGES, data);
}

export const updateSelectedImages = (userId, data)=>{
  return axios.post(SERVICE_URL + endPoints.UPDATE_SELECTED_IMAGES + `/${userId}`, data);
}
