import { useEffect, useState } from 'react';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';
import MarvelServes from '../../servises/MarvelServes';

import './charInfo.scss';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);

    const {error, loading, getCharacter, clearError} = MarvelServes();

    useEffect(() => {
        updateChar();
    }, [props.charId]);

    const updateChar = (id) => {
        const {charId} = props;
        if(!charId){
            return;
        }
        clearError();
        getCharacter(charId)
            .then(onLoaded);
    }

    const onLoaded = (char) => {
        setChar(char);
    }

    const skeleton = !(error || loading || char) ? <Skeleton/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const veiw = !(error || loading || !char) ? <Veiw char={char}/> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {veiw}
        </div>
    )
}

const Veiw = ({char}) => {

    const {name, thumbnail, description, url, wiki, comics} = char;

    let imgStyle = {"objectFit": "cover"};

    if(thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"){
        imgStyle = {"objectFit": "contain"};
    }

    return(
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={url} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics for this character'}
                {
                    comics.map((item, i) => {
                        if(i < 10){
                            return(
                                <li className="char__comics-item"
                                    key={i}>
                                    {item.name}
                                </li>
                            )
                        }
                    })
                }
            </ul>
        </>
    )
}

export default CharInfo;