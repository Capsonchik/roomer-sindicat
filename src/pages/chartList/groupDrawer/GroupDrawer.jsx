import {Button, Drawer} from "rsuite";
import styles from "./groupDrawer.module.scss";
import {ChartEditor} from "../chartEditor/ChartEditor";
import {FormProvider, useForm} from "react-hook-form";
import {CustomInput} from "../../../components/rhfInputs/customInput/CustomInput";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllGroups, patchGroupById, postGroup} from "../../../store/chartSlice/chart.actions";
import {
  selectActiveGroupId,
  selectActiveReport,
  selectReportsClients,
  selectTypeGroupDrawer
} from "../../../store/chartSlice/chart.selectors";

import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {PreventOverflowContainer} from "../chartFilters/main/MainForm";
import {CustomSelectPicker} from "../../../components/rhfInputs/selectPicker/SelectPicker";
import {labelArray} from "../label.config";

export const GroupDrawer = ({open, onClose, activeGroup}) => {
  const reportsClients = useSelector(selectReportsClients)

  const loginSchema = yup.object().shape({
    title: yup.string().required("Название обязательно"),
    description: yup.string().required("Описание обязательно").max(200, 'Маскимальное количетсво символов 200'), // Add the password field
  });

  const methods = useForm({
    resolver: yupResolver(loginSchema),
  })
  const dispatch = useDispatch();
  const activeReport = useSelector(selectActiveReport)
  const activeGroupId = useSelector(selectActiveGroupId)
  const typeGroupDrawer = useSelector(selectTypeGroupDrawer)
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

  const handleCreateGroup = (data) => {
    console.log(data)
    // dispatch(postGroup(data))
  }
  console.log(reportsClients)

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
              <CustomInput name={'description'} as={'textarea'} className={styles.description}/>

            </div>

            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>Отчет</h6>
              <PreventOverflowContainer
                // height={34}
              >
                {getContainer => (
                  <CustomSelectPicker
                    name={'report_id'}
                    data={reportsClients.map((report) => ({label: report.report_name, value: report.report_id}))}
                    searchable={false}
                    placeholder="Отчет"
                    className={styles.report_select}
                    container={getContainer}
                    preventOverflow

                  />
                )}

              </PreventOverflowContainer>
            </div>


            {typeGroupDrawer === 'edit' && (
              <Button className={styles.patch_btn} onClick={(e) => {
                e.stopPropagation()
                methods.handleSubmit(handlePatch)()
              }}>Сохранить</Button>
            )}
            {typeGroupDrawer === 'add' && (
              <Button className={styles.patch_btn} onClick={(e) => {
                e.stopPropagation()
                methods.handleSubmit(handleCreateGroup)()
              }}>Создать</Button>
            )}

          </FormProvider>
        </div>
      </Drawer.Body>
    </Drawer>
  )

}