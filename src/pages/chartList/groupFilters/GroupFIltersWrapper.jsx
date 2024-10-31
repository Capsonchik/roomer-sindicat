import React, {useState} from "react";
import "./wrapper.scss";
import {GroupFilters} from "./GroupFilters";
import {Divider} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {selectActiveReport, selectFilters} from "../../../store/chartSlice/chart.selectors";
import {setToggleFilters} from "../../../store/chartSlice/filter.slice"; // Импортируем стили

export const GroupFiltersWrapper = ({groups}) => {
  const [show, setShow] = useState(true);
  const activeReport = useSelector(selectActiveReport)
  const filters = useSelector(selectFilters)
  const dispatch = useDispatch();
  const toggleFilters = useSelector(state => state.filters.toogleFilters);

  const toggleShow = () => {
    setShow((prevShow) => !prevShow);
    dispatch(setToggleFilters(!toggleFilters))
  };
  // if(!activeReport || !groups.length) {
  //   return null
  // }

  return (
    <div >
      {activeReport && !!groups.length && !!filters.filter(filter => !filter.column_limit).length && <Divider style={{cursor:'pointer'}} onClick={toggleShow} >{show ? "Скрыть фильтры" : "Показать фильтры"}</Divider>}

      <div className={`filter-wrapper ${show ? "show" : "hide"}`}>
        <div className="filter-content">
          <GroupFilters groups={groups}/>
        </div>
      </div>
    </div>
  );
};