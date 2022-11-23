import React, { useEffect, useState } from "react";
import "./Name.css";

const Name = ({ state }) => {
    const { myBoard, active, playerName, onTimeout } = state;
    const [countdown, setCountdown] = useState(10)
    useEffect(() => {
        let interval
        if (active) {
            interval = setInterval(() => {
                setCountdown(countdown => {
                    if (countdown > 0) {
                        return countdown - 1
                    }
                    onTimeout()
                    clearInterval(interval)
                    return 0
                })
            }, 1000)

            return () => clearInterval(interval)
        }
        clearInterval(interval)
        setCountdown(10)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active])
    return (
        <div className={`name-and-timer ${myBoard ? "mine" : "opponent"} ${active ? "timer" : ""}`}>
            {
                (!myBoard && active) && (<small>
                    0:{countdown.toString().padStart(2, "0")}
                </small>)
            }
            <h2>
                {playerName ?? "Opponent"}
            </h2>
        </div>
    );
};

export default Name;
