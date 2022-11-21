import React from "react";
import "./style.css";
import Display from "../../components/Display";
import LogList from "../../components/Log";
import Heading from "../../components";
import useGame from "../../hooks/useGame";

const MainPage = () => {
    const { myState, opponentState, logState } = useGame();

    const { messages, newGame } = logState;

    return (
        <>
            <Heading />
            <Display {...{ myState, opponentState, newGame }} />
            <LogList {...{ messages }} />
        </>
    );
};

export default MainPage;
