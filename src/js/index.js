'use strict';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const searchInput = document.querySelector('.searchbar__input');
const resultsBox = document.querySelector('.gallery');
const mainElement = document.querySelector('main');
const loadMore = document.querySelector('.load-more');
let page = 1;
let endOfResults = false;

function changeSpace(value) {
  return value.replace(/ /g, '+');
}

async function fetchImages(keyWords, page) {
  const keyWordsEncoded = changeSpace(keyWords);
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=34699239-301f57fe1e87e868102635a18&q=${keyWordsEncoded}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    const { data } = response;
    if (data.hits.length === 0) {
      return [];
    } else {
      if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
      if (page * 40 >= data.totalHits) {
        endOfResults = true;
        loadMore.classList.add('hide');
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }
      return data.hits;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

function displayResults(images) {
  const results = images
    .map(image => {
      return `
    <div class="photo-card">
    <a href="${image.largeImageURL}"><img class="photo-card__image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
    <div class="info">
    <div class="info-box">
    <img src="https://i.ibb.co/b5XrpVp/likes.png" alt="grey image of heart" width="17" />
    <p class="info-item">${image.likes}</p> 
    </div>
    <div class="info-box">
    <img src="https://i.ibb.co/6WwrCD7/view.png" alt="grey image of heart" width="17" />
    <p class="info-item">${image.views}</p>
    </div>
    <div class="info-box">
    <img src="https://i.ibb.co/dbn57bh/comment.png" alt="grey image of heart" width="17" />
    <p class="info-item">${image.comments}</p>
    </div>
    <div class="info-box">
    <img src="https://i.ibb.co/fC7jH15/downloads.png" alt="grey image of heart" width="17" />
    <p class="info-item">${image.downloads}</p>
    </div>
    </div>
    </div>
    </div>
    `;
    })
    .join('');
  if (images.length > 0) {
    resultsBox.insertAdjacentHTML('beforeend', results);
  }
  mainElement.classList.remove('hide');
}

function searchImages(event) {
  event.preventDefault();
  resultsBox.innerHTML = '';
  page = 1;
  const searchedImages = searchInput.value.trim();
  if (searchedImages.length > 0) {
    fetchImages(searchedImages, page)
      .then(images => {
        if (images.length === 0) {
          resultsBox.innerHTML = '';
          Notiflix.Notify.warning(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else if (images.length < 40) {
          loadMore.classList.add('hide');
          displayResults(images);
        } else {
          loadMore.classList.remove('hide');
          displayResults(images);
        }
      })
      .catch(error => console.error(error));
  } else {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please precise your request.'
    );
    mainElement.classList.add('hide');
  }
}

function handleButtonClick() {
  if (endOfResults) {
    return;
  }
  fetchImages(searchInput.value.trim(), page + 1)
    .then(images => {
      if (images.length > 0) {
        displayResults(images);
        page += 1;
      }
    })
    .catch(error => console.error(error));
}

form.addEventListener('submit', searchImages);
loadMore.addEventListener('click', handleButtonClick);

const gallery = new SimpleLightbox('.photo-card a', {});
gallery.refresh();
