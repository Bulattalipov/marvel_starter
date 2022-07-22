import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import MarvelServes from '../../servises/MarvelServes';

import './singleComicPage.scss';

const SingleComicPage = () => {
    const {comicId} = useParams();
    const [comic, setComic] = useState(null);

    const {error, loading, getComic, clearError} = MarvelServes();

    useEffect(() => {
        updateComic();
    }, [comicId]);

    const updateComic = () => {
        clearError();
        getComic(comicId)
            .then(onComicLoaded);
    }

    const onComicLoaded = (comic) => {
      setComic(comic);
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const veiw = !(error || loading || !comic) ? <Veiw comic={comic}/> : null;


    return (
      <>
        {errorMessage}
        {spinner}
        {veiw}
      </>
    )
}

const Veiw = ({comic}) => {
  const {title, discription, pageCount, language, price, thumbnail} = comic;

  return(
    <div className="single-comic">
        <img src={thumbnail} alt={title} className="single-comic__img"/>
        <div className="single-comic__info">
            <h2 className="single-comic__name">{title}</h2>
            <p className="single-comic__descr">{discription}</p>
            <p className="single-comic__descr">{pageCount} pages</p>
            <p className="single-comic__descr">Language: {language}</p>
            <div className="single-comic__price">{price}$</div>
        </div>
        <Link to="/comics" className="single-comic__back">Back to all</Link>
    </div>
  )
}

export default SingleComicPage;