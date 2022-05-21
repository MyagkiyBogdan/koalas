import './sass/main.scss';
import { gallery } from './js/lightBoxGallery';
import { FetchDataPhotos } from './js/fetchPhotos';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const findPhotos = new FetchDataPhotos();

const refs = {
  queryInput: document.querySelector('.search-input'),
  searchForm: document.querySelector('.search-form'),
  photoBlock: document.querySelector('.photo-card'),
  loadMore: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onClickFindPhotos);
refs.loadMore.addEventListener('click', fetchMorePhotos);
let page = 1;
let totalHits;

async function onClickFindPhotos(event) {
  event.preventDefault();
  // Проверка на пустую строку
  if (!event.target.elements['search-box'].value) {
    Notify.failure('Write what photos we should look for please');
    return;
  }
  // try {
  page = 1;
  const photosByValue = await findPhotos.fetchPhotos(
    event.target.elements['search-box'].value,
    page,
  );
  const markUpByValue = await publishFirstMarkup(photosByValue);
  totalHits = photosByValue.totalHits;
  page += 1;
  // } catch (error) {
  //   Notify.failure('ERROR', error);
  // }
}

async function fetchMorePhotos() {
  try {
    const photosByValue = await findPhotos.fetchPhotos(refs.queryInput.value, page);
    const markUpByValue = await publisMoreMarkup(photosByValue);
    console.log(page);
  } catch (error) {
    Notify.info(`We're sorry, but you've reached the end of search results.`);
  }
}

function publishFirstMarkup(colection) {
  const markup = createPhotosMarkup(colection);
  // Проверка на false
  if (markup) {
    refs.photoBlock.innerHTML = markup.join('');
    gallery.refresh();
    refs.loadMore.classList.remove('visually-hidden');
    scrollToTop();
  }
}

function publisMoreMarkup(colection) {
  const markup = createPhotosMarkup(colection).join('');
  refs.photoBlock.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
  refs.loadMore.classList.remove('visually-hidden');
  let photosLeft = totalHits - 40 * page;
  if (photosLeft <= 0) {
    Notify.info(`We're sorry, but you've reached the end of search results.`);
  }
  page += 1;
  smoothScrolling();
  console.log(photosLeft);
}

function createPhotosMarkup(photos) {
  if ((photos.hits.length === 0) & (page === 1)) {
    refs.loadMore.classList.add('visually-hidden');
    refs.photoBlock.innerHTML = '';
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  } else {
    if (page === 1) {
      Notify.success(`Hooray! We found ${photos.totalHits} images.`);
    }
    const markup = photos.hits.map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
			    <a class="gallery__link" href="${largeImageURL}">
			<img src='${webformatURL}' alt="${tags}" loading="lazy" class="gallery__image"/>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
	</a>`,
    );
    return markup;
  }
}

function smoothScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 1.3,
    behavior: 'smooth',
  });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
