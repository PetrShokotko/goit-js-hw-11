import { Notify } from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

async function fetchPhotos(searchQuery, page) {
  const apiKey = '38622369-5233b95d6674dc08f7eab892f';
  const baseUrl = 'https://pixabay.com/api/';
  const imageType = 'photo';
  const orientation = 'horizontal';
  const safeSearch = true;
  const perPage = 40;

  try {
    const response = await axios.get(
      `${baseUrl}?key=${apiKey}&q=${encodeURIComponent(searchQuery)}&image_type=${imageType}&orientation=${orientation}&safesearch=${safeSearch}&per_page=${perPage}&page=${page}`
    );
    return response.data;
  } catch (error) {
    throw new Error('Не удалось загрузить изображения');
  }
}

function generateGalleryMarkup(hits) {
  return hits
    .map(
      (hit) => `
      <div class="photo-card">
        <a href="${hit.largeImageURL}">
          <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Лайков:</b> ${hit.likes}</p>
          <p class="info-item"><b>Просмотров:</b> ${hit.views}</p>
          <p class="info-item"><b>Комментарие:</b> ${hit.comments}</p>
          <p class="info-item"><b>Загрузок:</b> ${hit.downloads}</p>
        </div>
      </div>
    `
    )
    .join('');
}

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let currentPage = 1;

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const searchQuery = formData.get('searchQuery');

  try {
    const data = await fetchPhotos(searchQuery, currentPage);

    if (data.hits.length === 0) {
      gallery.innerHTML = '';
      loadMoreBtn.style.display = 'none';
      throw new Error('Извините, но нет изображений ¯\_(ツ)_/¯, соответствующих вашему запросу. Пожалуйста, попробуйте еще раз.');
    }

    const galleryMarkup = generateGalleryMarkup(data.hits);
    gallery.innerHTML = galleryMarkup;
    loadMoreBtn.style.display = 'block';
    currentPage = 1;

    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionPosition: 'bottom',
    });

  } catch (error) {
    console.error(error);
  }
});

loadMoreBtn.addEventListener('click', async () => {
  const formData = new FormData(searchForm);
  const searchQuery = formData.get('searchQuery');
  currentPage++;

  try {
    const data = await fetchPhotos(searchQuery, currentPage);

    if (data.hits.length === 0 || currentPage > Math.ceil(data.totalHits / 40)) {
      loadMoreBtn.style.display = 'none';
      return;
    }

    const galleryMarkup = generateGalleryMarkup(data.hits);
    gallery.insertAdjacentHTML('beforeend', galleryMarkup);

    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionPosition: 'bottom',
    });

  } catch (error) {
    console.error(error);
  }
});

gallery.addEventListener('click', (event) => {
  const clickedElement = event.target;
  const photoCard = clickedElement.closest('.photo-card');
  const photoLink = photoCard.querySelector('a');

  if (photoLink) {
    photoLink.click();
  }
});