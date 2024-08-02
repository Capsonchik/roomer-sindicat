import React from 'react';
import {Message, Button} from 'rsuite';
import 'rsuite/dist/rsuite.min.css'; // Подключение стилей rsuite
import styles from './errorMessage.module.scss'

export const ErrorMessage = ({errorMessage}) => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div
      className={styles.wrapper}
      style={{margin: '20px'}}>
      <Message type="error" className={styles.messageBody}>
        <div className={styles.content}>
          <strong>{errorMessage}</strong>
          <Button appearance="default" onClick={handleReload} style={{marginTop: '10px'}}>
            Перезагрузить страницу
          </Button>
        </div>

      </Message>
    </div>
  );
};

