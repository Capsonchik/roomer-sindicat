import styles from './createChartDrawer.module.scss'
import {Button, Drawer} from "rsuite";
import {FormProvider, useForm} from "react-hook-form";
import {CustomInput} from "../../../components/rhfInputs/customInput/CustomInput";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";

export const CreateChartDrawer = ({open, onClose}) => {

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
              <h6 className={styles.label}>Название</h6>
              <CustomInput name={'title'}/>

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