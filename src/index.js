import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DELAY = 300;

const inputCountry = document.querySelector('input#search-box');
const listCountry = document.querySelector('.list-country');
const infoCountry = document.querySelector('.info-country');

function cleanMarkup(ref) {
  ref.innerHTML = '';
}

function inputHandler(e) {
  const searchInput = e.target.value.trim();

  if (!searchInput) {
    cleanMarkup(listCountry);
    cleanMarkup(infoCountry);
    return;
  }

  fetchCountries(searchInput)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        cleanMarkup(listCountry);
        cleanMarkup(infoCountry);
        Notify.warning(
          'Too many matches found. Please enter a more specific name'
        );

        return;
      }

      renderMarkup(data);
    })
    .catch(err => {
      cleanMarkup(listCountry);
      cleanMarkup(infoCountry);
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderMarkup(data) {
  if (data.length === 1) {
    cleanMarkup(listCountry);
    const infoMarkup = createInfoMarkup(data);
    infoCountry.innerHTML = infoMarkup;
  } else {
    cleanMarkup(infoCountry);
    const listMarkup = createListMarkup(data);
    listCountry.innerHTML = listMarkup;

    const selectCountry = document.querySelectorAll('li');
    selectCountry.forEach(button => {
      button.addEventListener('click', event => {
        const indexCountry = event.currentTarget.dataset.name;
        console.log(indexCountry)
        const newArr = data.filter(el => {
          el.name.common == indexCountry;
          console.log(el.name.common);
        });
        console.log(newArr);
      });
    });
  }
}

function createInfoMarkup(data) {
  return data.map(
    ({ name, capital, population, flags, languages, region }) =>
      `<li>
        <h2><img src="${flags.svg}" alt="${
        name.common
      }" width="50" height="40"/>${name.official} - ${name.common}</h2>
        <p><span>Capital:</span> ${capital}</p>
        <p><span>Region:</span> ${region}</p>
        <p><span>Population:</span> ${population}</p>
        <p><span>Languages:</span> ${Object.values(languages)}</p>
        </li>`
  );
}

function createListMarkup(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li data-name="${name.common}"><img src="${flags.svg}" alt="${name.common}" width="40" height="30"/>${name.common}</li>`
    )
    .join('');
}
inputCountry.addEventListener('input', debounce(inputHandler, DELAY));
