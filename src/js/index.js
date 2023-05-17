import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const searchInput = document.querySelector('.searchbar__input');
const resultsBox = document.querySelector('.gallery');

function changeSpace(value) {
  return value.replace(/ /g, '+');
}

async function fetchImages(keyWords) {
  const keyWordsEncoded = changeSpace(keyWords);
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=34699239-301f57fe1e87e868102635a18&q=${keyWordsEncoded}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=1`
    );
    console.log(response);
    const { data } = response;
    if (data.hits.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      displayResults(data.hits);
    }
  } catch (error) {
    console.error(error);
  }
}

function displayResults(images) {
  const results = images
    .map(image => {
      return `
    <div class="photo-card">
    <img class="photo-card__image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
    <div class="info">
    <div>
    <img src="./images/likes.png" alt="grey image of heart" width="20" />
    <p class="info-item">${image.likes}</p> 
    </div>
    <div>
    <img src="./images/view.png" alt="grey image of heart" width="20" />
    <p class="info-item">${image.views}</p>
    </div>
    <div>
    <img src="./images/comment.png" alt="grey image of heart" width="20" />
    <p class="info-item">${image.comments}</p>
    </div>
    <div>
    <img src="./images/downloads.png" alt="grey image of heart" width="20" />
    <p class="info-item">${image.downloads}</p>
    </div>
    <div>
    <p class="info-item">
    <b>Tags</b> ${image.tags}</p>
    </div>
    </div>
    </div>
    `;
    })
    .join('');
  if (images.length > 0) {
    resultsBox.innerHTML = results;
  }
}

function searchImages(event) {
  event.preventDefault();
  const searchedImages = searchInput.value.trim();
  fetchImages(searchedImages)
    .then(images => displayResults(images))
    .catch(error => console.error(error));
}

form.addEventListener('submit', searchImages);
