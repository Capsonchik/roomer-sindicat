import {TagPicker} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {selectTableColumnKeys} from "../../../../store/tableSlice/table.selectors";
import {setColumnKeys} from "../../../../store/tableSlice/table.slice";
import {DEFAULT_COLUMNS} from "../../../../consts/tableMocks";

export const ColumnPicker = () => {
  const dispatch = useDispatch();
  const columnKeys = useSelector(selectTableColumnKeys);

  const handleColumnChange = (value) => {
    dispatch(setColumnKeys(value));
  };

  return (
    <TagPicker
      style={{marginBottom: '1rem'}}
      data={DEFAULT_COLUMNS}
      labelKey="label"
      valueKey="key"
      value={columnKeys}
      onChange={handleColumnChange}
      cleanable={false}
    />
  );
};