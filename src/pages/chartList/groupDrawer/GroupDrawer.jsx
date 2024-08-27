import {Button, Drawer} from "rsuite";
import styles from "./groupDrawer.module.scss";
import {ChartEditor} from "../chartEditor/ChartEditor";
import {FormProvider, useForm} from "react-hook-form";
import {CustomInput} from "../../../components/rhfInputs/customInput/CustomInput";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllGroups, patchGroupById} from "../../../store/chartSlice/chart.actions";
import {selectActiveReport} from "../../../store/chartSlice/chart.selectors";

import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";

export const GroupDrawer = ({open, onClose, activeGroup}) => {


  const loginSchema = yup.object().shape({
    title: yup.string().required("Название обязательно"),
    description: yup.string().required("Описание обязательно").max(200, 'Маскимальное количетсво символов 200'), // Add the password field
  });

  const methods = useForm({
    resolver: yupResolver(loginSchema),
  })
  const dispatch = useDispatch();
  const activeReport = useSelector(selectActiveReport)
  // console.log(activeReport)
  useEffect(() => {
    methods.reset({
      title: activeGroup?.group_name,
      description: activeGroup?.description,
    })
  }, [activeGroup])

  const handlePatch = (data) => {
    console.log(data)
    dispatch(patchGroupById({
      id: activeGroup.group_id,
      title: data.title,
      description: data.description,
    })).then(() => {
      onClose()
      dispatch(fetchAllGroups(activeReport))
    })
  }

  return (
    <Drawer open={open} onClose={onClose} style={{maxWidth: 700, width: '100%'}}>
      <Drawer.Body style={{maxHeight: '100% !important'}}>
        <div className={styles.wrapper}>


          <FormProvider {...methods}>
            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>Название</h6>
              <CustomInput name={'title'}/>

            </div>
            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>Описание</h6>
              <CustomInput name={'description'}/>

            </div>

            <Button className={styles.patch_btn} onClick={() => {
              methods.handleSubmit(handlePatch)()
            }}>Сохранить</Button>
          </FormProvider>
        </div>
      </Drawer.Body>
    </Drawer>
  )

}