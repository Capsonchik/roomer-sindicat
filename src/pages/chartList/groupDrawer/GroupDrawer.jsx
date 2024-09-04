import {Button, Drawer, Message} from "rsuite";
import styles from "./groupDrawer.module.scss";
import {ChartEditor} from "../chartEditor/ChartEditor";
import {FormProvider, useForm} from "react-hook-form";
import {CustomInput} from "../../../components/rhfInputs/customInput/CustomInput";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {deleteGroupById, fetchAllGroups, patchGroupById, postGroup} from "../../../store/chartSlice/chart.actions";
import {
  selectActiveGroupId,
  selectActiveReport, selectCharts, selectGroupsReports,
  selectReportsClients,
  selectTypeGroupDrawer
} from "../../../store/chartSlice/chart.selectors";

import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {PreventOverflowContainer} from "../chartFilters/main/MainForm";
import {CustomSelectPicker} from "../../../components/rhfInputs/selectPicker/SelectPicker";
import cl from 'classnames'
import {labelArray} from "../label.config";
import {setActiveGroup, setScrollTabs} from "../../../store/chartSlice/chart.slice";

export const GroupDrawer = ({open, onClose, activeGroup = null}) => {
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
  const charts = useSelector(selectCharts)
  const groups = useSelector(selectGroupsReports);
  const [isDelete, setIsDelete] = useState(false)
  const [isValidDeleteGroup, setIsValidDeleteGroup] = useState(false)
  // console.log(methods.formState)
  useEffect(() => {
    setIsValidDeleteGroup(false)
    if (typeGroupDrawer === 'edit') {
      // console.log(22)
      methods.reset({
        title: activeGroup?.group_name,
        description: activeGroup?.description,
        report_id: activeReport,
      })
    }
    else {
      // console.log(typeGroupDrawer)
      methods.reset({
        title: '',
        description: '',
        report_id: null,
      })
    }

    // setIsDelete(false)
  }, [open])

  const handlePatch = (data) => {
    // console.log(data)
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
    // console.log(data)
    dispatch(postGroup(data)).then((res) => {
      // console.log(res)
      // const index = groups.findIndex(group => group.group_id === res.payload.group_id)
      dispatch(setActiveGroup(res.payload.group_id))
      dispatch(setScrollTabs(groups.length - 1))
    }).catch((error) => {
      console.log(error)
    })
    onClose()
  }
  const handleDeleteGroup = () => {
    if(charts.length) {
      setIsValidDeleteGroup(true)
      return
    }
    const index = groups.findIndex(group => group.group_id === activeGroup.group_id)
    // console.log(data)
    dispatch(deleteGroupById(activeGroup.group_id)).then(() => {
      // const foundNewActive = groups.findIndex(group => )
      if (groups[index - 1]) {
        dispatch(setActiveGroup(groups[index - 1].group_id))

      } else {
        dispatch(setActiveGroup(groups[0].group_id))
      }
    })
    onClose()
  }

  const message = (
    <Message showIcon type={'error'} closable onClose={() => setIsValidDeleteGroup(false)}>
      <strong>Сначала удалите графики из группы</strong>
    </Message>
  );
  // console.log(reportsClients)

  return (
    <Drawer open={open} onClose={() => {
      onClose()
      setIsDelete(false)
      // methods.reset({})
    }} style={{maxWidth: 700, width: '100%'}}>
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
                    // defaultValue={activeReport}
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

            {isValidDeleteGroup && message}

            <div className={styles.buttons}>
              {typeGroupDrawer === 'edit' && (
                <Button
                  className={cl(styles.patch_btn, {
                    [styles.isDelete]: isDelete
                  })}
                  onClick={(e) => {
                    if (!isDelete) {
                      setIsDelete(true)
                      return
                    }
                    // e.stopPropagation()
                    handleDeleteGroup()
                  }}>{!isDelete ? 'Удалить' : 'Да, удалить'}</Button>
              )}
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
            </div>


          </FormProvider>
        </div>
      </Drawer.Body>
    </Drawer>
  )

}