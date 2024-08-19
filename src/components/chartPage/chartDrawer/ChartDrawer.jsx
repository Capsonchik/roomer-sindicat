import {Button, Drawer, Input} from "rsuite";
import styles from "./chartDrawer.module.scss";
import {useEffect, useState} from "react";
export const ChartDrawer = ({open,onClose,chart}) => {
  const [inputTitle, setInputTitle] = useState(chart.title)
  const [inputDescription, setInputDescription] = useState(chart.description)


  const handleSave = () => {
    // setTitle(inputTitle)
    // setDescription(inputDescription)
    // onClose()
  }
  return (
    <Drawer open={open} onClose={onClose} style={{maxWidth:600,width:'100%'}}>
      <Drawer.Body>
        <div className={styles.wrapper}>
          <div className={styles.group}>
            <h6>title</h6>
            <Input placeholder="title" onChange={(value) => setInputTitle(value)} value={inputTitle}/>
          </div>
          <div className={styles.group}>
            <h6>description</h6>
            <Input placeholder="description" onChange={(value) => setInputDescription(value)} value={inputDescription}/>
          </div>

          <Button onClick={handleSave}>Сохранить</Button>
        </div>
      </Drawer.Body>
    </Drawer>
  )
}