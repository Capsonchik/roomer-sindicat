import styles from './styles.module.scss';
import {Button, Drawer, Placeholder} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {selectGraphPreview, selectIsDrawerOpen} from "../../../store/reportSlice/reportSlice.selectors";
import {setIsDrawerOpen} from "../../../store/reportSlice/reportSlice";
import {dateFormatter} from "../../helpers/dateFormatter";

export const PreviewDrawer = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsDrawerOpen);
  const preview = useSelector(selectGraphPreview);


  return (
    <Drawer open={isOpen} onClose={() => dispatch(setIsDrawerOpen(false))}>
      <Drawer.Header>
        <Drawer.Title>{preview && preview.reportName}</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body className={styles.body}>
        <span>Автор: {preview && preview.authorName ? preview.authorName : 'Автор не указан'}</span>
        <span>Дата создания: {preview && dateFormatter(preview.createdAt)}</span>

        <iframe
          title={preview && preview.reportName}
          width="100%"
          height="500"
          seamless
          frameBorder="0"
          scrolling="no"
          src={preview && preview.link }
        >
        </iframe>


      </Drawer.Body>
    </Drawer>
  );
};