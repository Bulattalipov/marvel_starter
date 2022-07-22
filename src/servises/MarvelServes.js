import { useHttp } from "../hooks/http.hook";

const useMarvelServes = () => {

  const _apiBase = "https://gateway.marvel.com:443/v1/public/";
  const _apiKey = "apikey=b895061d93ebce03d6c0c921739be4f7";
  const _baseOffset = 209;

  const {loading, error, request, clearError} = useHttp();

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  }

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformCharacter);
  }

  const getComic = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    return _transformComic(res.data.results[0]);
  }

  const getAllComics = async (offset = 0) => {
    const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformComic);
  }



  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description ? `${char.description.slice(0, 210)}` : 'This in no description for this character',
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items
    }
  }

  const _transformComic = (comic) => {
    return {
      id: comic.id,
      title: comic.title,
      description: comic.description || "There is not discription",
      pageCount: comic.pageCount ? `${comic.discription} p.` : "No information about the number of pages",
      url: comic.urls.url,
      price: comic.prices[0].price,
      language: comic.textObjects.language || 'en-us',
      thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension
    }
  }

  return {error, loading, request, clearError, getCharacter, getAllCharacters, getComic, getAllComics};
}

export default useMarvelServes;