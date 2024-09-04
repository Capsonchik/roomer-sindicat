import styles from './groupTabs.module.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {fetchAllChartsByGroupId, fetchAllChartsFormatByGroupId} from "../../../store/chartSlice/chart.actions";
import {setActiveGroup} from "../../../store/chartSlice/chart.slice";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Mousewheel, Keyboard, Scrollbar} from 'swiper/modules';
import {selectActiveGroupId} from "../../../store/chartSlice/chart.selectors";

export const GroupTabs = ({groupsReports}) => {
  const dispatch = useDispatch();
  const swiperRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeGroupId = useSelector(selectActiveGroupId)
  const isFirstRender = useRef(true)

  useEffect(() => {

    if (groupsReports.length > 0) {
      handleSelect(groupsReports[0].group_id);
    }
    // else {
    //   handleSelect(activeGroupId);
    // }
  }, []);

  useEffect(() => {
    if (activeGroupId) {
      fetchCharts(activeGroupId)
    }

  }, [activeGroupId])


  const fetchCharts = (id) => {
    dispatch(fetchAllChartsByGroupId(id)).then(() => {
      dispatch(fetchAllChartsFormatByGroupId(id));
    });
  }

  const handleSelect = (id) => {
    // const selectedGroup = groupsReports[index];
    // if (selectedGroup) {
    dispatch(setActiveGroup(id));
    // dispatch(fetchAllChartsByGroupId(selectedGroup.group_id)).then(() => {
    //   dispatch(fetchAllChartsFormatByGroupId(selectedGroup.group_id));
    // });
  }
  // };

  const handleItemClick = (id) => {
    // setSelectedIndex(index);
    handleSelect(id);
  };

  useEffect(() => {
    if(isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!swiperRef.current) return;
    const lastIndex = groupsReports.length - 1;
    swiperRef.current.swiper.slideTo(lastIndex);
    // swiperRef.current.swiper.slideNext();

  }, [groupsReports.length]);

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
          <div>
            <SwiperSlide
              className={`${styles.swiper_slide} ${activeGroupId === group.group_id ? styles.active : ''}`}
              key={group.group_id}
            >
              <div
                className={styles.carouselItem}
                onClick={() => handleItemClick(group.group_id)}
              >
                {group.group_name}
              </div>
            </SwiperSlide>
          </div>
        ))}
      </Swiper>
    </div>
  );
};