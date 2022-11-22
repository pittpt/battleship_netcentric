import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnchor, faFerry, faCircleXmark, faBomb  } from "@fortawesome/free-solid-svg-icons";
import { MISSED, SELECTED, CONFIRMED, HIT } from "../../../../constants";

const CoordinateListItem = ({ clickHandler, state }) => {
  const { type, shipName } = state;
  const className = shipName ? `square ${shipName}` : "square";
  return (
    <div className={className} onClick={clickHandler}>
      {type === SELECTED && (
        <FontAwesomeIcon icon={faAnchor} style={{ color: "white" }} />
      )}
      {type === CONFIRMED && <FontAwesomeIcon icon={faFerry} />}
      {type === MISSED && (
        <FontAwesomeIcon icon={faCircleXmark} style={{ color: "white" }} />
      )}
      {type === HIT && (
        <FontAwesomeIcon icon={faBomb} style={{ color: "white" }} />
      )}
    </div>
  );
};

export default CoordinateListItem;
