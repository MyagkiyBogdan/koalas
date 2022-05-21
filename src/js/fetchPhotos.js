const BASE_URL = 'https://pixabay.com/api/';
const KEY = '27181891-3778ead93a3f3d83793e3b927';
import axios from 'axios';

export class FetchDataPhotos {
  constructor() {}

  async fetchPhotos(query, page) {
    const url = `${BASE_URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
    try {
      const response = await axios.get(url);
      console.log(response);

      const photos = await response.data;
      return photos;
    } catch (error) {
      console.log(`This is class catched error: ${error}`);
    }
  }
}
