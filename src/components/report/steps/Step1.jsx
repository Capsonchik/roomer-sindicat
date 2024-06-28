import {TagPicker} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {selectStepOneData, selectStepOneValues} from "../../../store/main.selectors";
import {setStepOneValues} from "../../../store/main.slice";

export const Step1 = () => {
  const data = useSelector(selectStepOneData).map(item => ({ label: item, value: item }));
  const dispatch = useDispatch();
  const storeData = useSelector(selectStepOneValues)

  const handleTagChange = (values) => {
    dispatch(setStepOneValues(values));
  };

  return (
    <>
      <h5 style={{marginBottom: 16}}>Выберите соответсвующую базу данных из которой надо сделать выборку</h5>
      <TagPicker
        placeholder={'Выберите базу'}
        data={data}
        block
        value={storeData}
        onChange={handleTagChange}
      />
    </>
  );
};