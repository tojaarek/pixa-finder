import axios from 'axios';
import Notiflix from 'notiflix';

function changeSpace(value) {
  return value.replace(/ /g, '+');
}

export default async function fetchImages(keyWords) {
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
      Notiflix.Notify.success('Hooray! We found ${data.totalHits} images.');
      displayResults(data.hits);
    }
  } catch (error) {
    console.error(error);
  }
}
