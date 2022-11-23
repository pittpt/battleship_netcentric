import React, { useEffect } from "react";
import "./style.css";
import Display from "../../components/Display";
import LogList from "../../components/Log";
import Heading from "../../components/Heading";
import Popup from "../../components/Popup";
import useGame from "../../hooks/useGame";
import { useLocation } from "react-router-dom";

const MainPage = () => {
    const { myState, opponentState, logState } = useGame();

    const { messages, newGame, popupMessage } = logState;
    const { state } = useLocation();

    useEffect(() => {
        newGame(state);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Heading showScore myScore={myState.score} opponentScore={opponentState.opponentScore} />
            <Display {...{ myState, opponentState, newGame }} />
            <LogList {...{ messages }} />
            {
                popupMessage && <Popup {...{ newGame }} myScore={myState.score} opponentScore={opponentState.opponentScore}>{popupMessage}</Popup>
            }
        </>
    );
};

export default MainPage;
