import { Loading } from 'notiflix/build/notiflix-loading-aio';

const COUNTRY_API_URL = 'https://restcountries.com/v3.1/name/';

const fetchCountries = name => {
  Loading.circle();
  return fetch(
    `${COUNTRY_API_URL}${name}?fields=name,capital,population,flags,languages`
  )
    .then(response => response.json())
    .finally(() => {
      Loading.remove(300);
    });
};

export { fetchCountries };
