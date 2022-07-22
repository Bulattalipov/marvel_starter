import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import MarvelServes from '../../servises/MarvelServes';

import './comicsList.scss';

const ComicsList = () => {

    const [comicList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [comicsEnd, setComicsEnd] = useState(false);

    const {error, loading, getAllComics} = MarvelServes();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onLoaded);
    }

    const onLoaded = (newComicList) => {
        let ended = false;
        if(newComicList.length < 8){
            ended = true;
        }

        setCharList(comicList => [...comicList, ...newComicList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset + 8);
        setComicsEnd(ended);
    }

    const renderComics = (arr) => {
        let items = arr.map((item, i) => {
            return(
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}$</div>
                    </Link>
                </li>
            )
        });

        return(
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderComics(comicList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': comicsEnd ? 'none': 'block'}}
                    onClick={onRequest}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;