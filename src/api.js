import axios from 'axios';

const apiKey = '38622369-5233b95d6674dc08f7eab892f';
const baseUrl = 'https://pixabay.com/api/';
const imageType = 'photo';
const orientation = 'horizontal';
const safeSearch = true;
const perPage = 40;

export async function fetchPhotos(searchQuery, page) {
  try {
    const response = await axios.get(
      `${baseUrl}?key=${apiKey}&q=${encodeURIComponent(searchQuery)}&image_type=${imageType}&orientation=${orientation}&safesearch=${safeSearch}&per_page=${perPage}&page=${page}`
    );
    return response.data;
  } catch (error) {
    throw new Error('Не удалось загрузить изображения');
  }
}