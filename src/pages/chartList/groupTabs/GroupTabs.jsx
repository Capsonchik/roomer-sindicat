import styles from './groupTabs.module.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {
  fetchAllChartsByGroupId,
  fetchAllChartsFormatByGroupId,
  getGroupById
} from "../../../store/chartSlice/chart.actions";
import {setActiveGroup, setCharts, setFilterLoading, setFilters} from "../../../store/chartSlice/chart.slice";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Mousewheel, Keyboard, Scrollbar} from 'swiper/modules';
import {
  selectActiveGroupId,
  selectCharts,
  selectCurrentGroupLoading, selectFilterLoading, selectIsChartLoading,
  selectScrollTabs
} from "../../../store/chartSlice/chart.selectors";
import {getFilters} from "../../../store/chartSlice/filter.actions";

export const GroupTabs = ({groupsReports}) => {
  const dispatch = useDispatch();
  const swiperRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeGroupId = useSelector(selectActiveGroupId)
  const currentGroupLoading = useSelector(selectCurrentGroupLoading)
  const isChartLoading = useSelector(selectIsChartLoading)
  const filterLoading = useSelector(selectFilterLoading);
  const scrollTabs = useSelector(selectScrollTabs)
  const charts = useSelector(selectCharts)

  const isFirstRender = useRef(true)

  useEffect(() => {

    if (groupsReports.length > 0 && !activeGroupId) {
      handleSelect(groupsReports[0].group_id);
    }
    // else {
    //   handleSelect(activeGroupId);
    // }
  }, [groupsReports,activeGroupId]);

  // useEffect(() => {
  //   dispatch(setActiveGroup(groupsReports?.[0].group_id));
  //
  // }, [])


  const fetchCharts = (id) => {
    dispatch(fetchAllChartsByGroupId({groupId: id})).then(() => {
      dispatch(fetchAllChartsFormatByGroupId(id));
    });
  }

  const handleSelect = (id) => {
    // const selectedGroup = groupsReports[index];
    // if (selectedGroup) {
    dispatch(setActiveGroup(id));
    dispatch(getGroupById(id));

    // dispatch(fetchAllChartsByGroupId(selectedGroup.group_id)).then(() => {
    //   dispatch(fetchAllChartsFormatByGroupId(selectedGroup.group_id));
    // });
  }
  // };

  const handleItemClick = (id) => {
    // setSelectedIndex(index);
    dispatch(setCharts([]))
    dispatch(setFilters([]))
    dispatch(setFilterLoading('idle'))
    handleSelect(id);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!swiperRef.current) return;
    // const lastIndex = groupsReports.length - 1;
    if (scrollTabs) {
      swiperRef.current.swiper.slideTo(scrollTabs);
      // return
    }
    // swiperRef.current.swiper.slideTo(lastIndex);
    // swiperRef.current.swiper.slideNext();

  }, [, scrollTabs]);

  useEffect(() => {
    const handleWheel = (event) => {
      // console.log(1)
      if (!swiperRef.current) return;

      if (event.deltaY > 0) {
        swiperRef.current.swiper.slideNext();
      } else if (event.deltaY < 0) {
        swiperRef.current.swiper.slidePrev();
      }
    };

    const swiperEl = swiperRef.current;
    if (swiperEl) {
      swiperEl.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (swiperEl) {
        swiperEl.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <Swiper
        ref={swiperRef}
        cssMode={true}
        navigation={true}
        mousewheel={true}  // Отключаем встроенную обработку колесика
        slidesPerView='auto'
        slidesPerGroupAuto={true}  // Automatically switch by visible slides
        keyboard={true}
        modules={[Navigation, Mousewheel, Keyboard]}
        // scrollbar={{
        //   hide: false,
        // }}
        className={styles.swiper}
        spaceBetween={12}
        // onSlideChange={(swiper) => setSelectedIndex(swiper.activeIndex)}
      >
        {groupsReports.map((group, index) => (

          <SwiperSlide
            className={`${styles.swiper_slide}`}
            key={group.group_id}
          >
            <div

              className={`${styles.carouselItem} ${activeGroupId === group.group_id ? styles.active : ''} ${(currentGroupLoading || filterLoading === 'load' || isChartLoading) ? styles.loading: ''}`}
              onClick={() => {
                if(currentGroupLoading || filterLoading === 'load' || isChartLoading) return
                handleItemClick(group.group_id)
              }}
            >
              <p>
                {group.group_name}
              </p>
            </div>
          </SwiperSlide>

        ))}
      </Swiper>
    </div>
  );
};