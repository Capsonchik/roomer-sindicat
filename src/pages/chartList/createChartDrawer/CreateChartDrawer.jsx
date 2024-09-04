import styles from './createChartDrawer.module.scss'
import {Button, Drawer} from "rsuite";
import {FormProvider, useForm} from "react-hook-form";
import {CustomInput} from "../../../components/rhfInputs/customInput/CustomInput";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useSelector} from "react-redux";
import {selectGroupsReports, selectReportsClients} from "../../../store/chartSlice/chart.selectors";
import {PreventOverflowContainer} from "../chartFilters/main/MainForm";
import {CustomSelectPicker} from "../../../components/rhfInputs/selectPicker/SelectPicker";
import React from "react";

export const CreateChartDrawer = ({open, onClose}) => {
  const reportsClients = useSelector(selectReportsClients)
  const groupsReports = useSelector(selectGroupsReports)

  const loginSchema = yup.object().shape({
    // title: yup.string().required("Название обязательно"),
    // description: yup.string().required("Описание обязательно").max(200, 'Маскимальное количетсво символов 200'), // Add the password field
  });

  const methods = useForm({
    // resolver: yupResolver(loginSchema),
  })
  return (
    <Drawer open={open} onClose={onClose} style={{maxWidth: 700, width: '100%'}}>
      <Drawer.Body style={{maxHeight: '100% !important'}}>
        <div className={styles.wrapper}>


          <FormProvider {...methods}>
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
                    placeholder="Выберите отчет"
                    className={styles.select}
                    container={getContainer}
                    preventOverflow

                  />
                )}

              </PreventOverflowContainer>
            </div>
            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>Группа</h6>
              <PreventOverflowContainer
                // height={34}
              >
                {getContainer => (
                  <CustomSelectPicker
                    name={'group_id'}
                    // defaultValue={activeReport}
                    data={groupsReports.map((group) => ({label: group.group_name, value: group.group_id}))}
                    searchable={false}
                    placeholder="Выберите группу"
                    className={styles.select}
                    container={getContainer}
                    // preventOverflow

                  />
                )}

              </PreventOverflowContainer>
            </div>
            <div className={styles.input_wrapper}>
              <h6 className={styles.label}>Описание</h6>
              <CustomInput name={'description'} as={'textarea'} className={styles.description}/>

            </div>

            <Button className={styles.patch_btn} onClick={(e) => {
              e.stopPropagation()
              // methods.handleSubmit(handlePatch)()
            }}>Сохранить</Button>
          </FormProvider>
        </div>
      </Drawer.Body>
    </Drawer>
  )
}