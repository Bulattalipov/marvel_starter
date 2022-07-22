import { useEffect, useState, useRef } from 'react';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import MarvelServes from '../../servises/MarvelServes';
import './charList.scss';

const CharList = ({onCharSelected}) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnd, setCharEnd] = useState(false);

    const {error, loading, getAllCharacters} = MarvelServes();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onLoaded);
    }


    const onLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9){
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset + 9);
        setCharEnd(ended);
    }

    const itemsRef = useRef([]);

    const focusOnItem = (id) => {
        itemsRef.current.forEach(item => item.classList.remove('char__item_selected'));
        itemsRef.current[id].classList.add('char__item_selected');
        itemsRef.current[id].focus();
    }


    const renderItems = (arr) => {
        let items = arr.map((item, i) => {
            let imgStyle = {"objectFit": "cover"};

            if(item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" || item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif"){
                imgStyle = {"objectFit": "contain"};
            }

            return (
                <li className="char__item"
                    key={item.id}
                    ref={el => itemsRef.current[i] = el}
                    onClick={() => {
                        onCharSelected(item.id);
                        focusOnItem(i)
                    }}>
                    <img src={item.thumbnail}
                         alt={item.name}
                         style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })

        return(
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnd ? 'none': 'block'}}
                    onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default CharList;