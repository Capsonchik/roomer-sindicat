import {Button, Drawer, Input} from "rsuite";
import styles from "./chartDrawer.module.scss";
import {useEffect, useState} from "react";
import {ChartEditor} from "../chartEditor/ChartEditor";
export const ChartDrawer = ({open,onClose,chart}) => {


    const handleSave = () => {
        // setTitle(inputTitle)
        // setDescription(inputDescription)
        // onClose()
    }
    return (
        <Drawer open={open} onClose={onClose} style={{maxWidth:600,width:'100%'}}>
            <Drawer.Body>
                <div className={styles.wrapper}>
                    <ChartEditor chart={chart}/>


                    <Button onClick={handleSave}>Сохранить</Button>
                </div>
            </Drawer.Body>
        </Drawer>
    )
}