import {Button, Drawer} from "rsuite";
import styles from "./groupDrawer.module.scss";
import {ChartEditor} from "../chartEditor/ChartEditor";
import {FormProvider, useForm} from "react-hook-form";
import {CustomInput} from "../../../components/rhfInputs/customInput/CustomInput";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllGroups, patchGroupById} from "../../../store/chartSlice/chart.actions";
import {selectActiveReport} from "../../../store/chartSlice/chart.selectors";


export const GroupDrawer = ({open, onClose, activeGroup}) => {
  const methods = useForm()
  const dispatch = useDispatch();
  const activeReport = useSelector(selectActiveReport)
  console.log(activeReport)
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
              <h6 className={styles.label}>{activeGroup?.group_name}</h6>
              <CustomInput name={'title'}/>

            </div>
            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>{activeGroup?.description}</h6>
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