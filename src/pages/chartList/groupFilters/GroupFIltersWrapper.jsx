import React, {useState} from "react";
import "./wrapper.scss";
import {GroupFilters} from "./GroupFilters";
import {Divider} from "rsuite";
import {useSelector} from "react-redux";
import {selectActiveReport, selectFilters} from "../../../store/chartSlice/chart.selectors"; // Импортируем стили

export const GroupFiltersWrapper = ({groups}) => {
  const [show, setShow] = useState(true);
  const activeReport = useSelector(selectActiveReport)
  const filters = useSelector(selectFilters)

  const toggleShow = () => {
    setShow((prevShow) => !prevShow);
  };
  // if(!activeReport || !groups.length) {
  //   return null
  // }

  return (
    <div >
      {activeReport && !!groups.length && !!filters.length && <Divider style={{cursor:'pointer'}} onClick={toggleShow} >{show ? "Скрыть фильтры" : "Показать фильтры"}</Divider>}

      <div className={`filter-wrapper ${show ? "show" : "hide"}`}>
        <div className="filter-content">
          <GroupFilters groups={groups}/>
        </div>
      </div>
    </div>
  );
};