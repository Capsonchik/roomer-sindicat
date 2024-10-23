import React, {useState} from "react";
import "./wrapper.scss";
import {GroupFilters} from "./GroupFilters";
import {Divider} from "rsuite"; // Импортируем стили

export const GroupFiltersWrapper = ({groups}) => {
  const [show, setShow] = useState(true);

  const toggleShow = () => {
    setShow((prevShow) => !prevShow);
  };

  return (
    <div >
      <Divider onClick={toggleShow} >{show ? "Скрыть фильтры" : "Показать фильтры"}</Divider>
      {/*<button onClick={toggleShow} className="toggle-button">*/}
      {/*  {show ? "Скрыть фильтры" : "Показать фильтры"}*/}
      {/*</button>*/}
      <div className={`filter-wrapper ${show ? "show" : "hide"}`}>
        <div className="filter-content">
          <GroupFilters groups={groups}/>
        </div>
      </div>
    </div>
  );
};