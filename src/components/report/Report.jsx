import styles from './styles.module.scss';
import {Panel, Steps, ButtonGroup, Button} from "rsuite";
import {useState} from "react";
import {Step1} from "./steps/Step1";
import {Step2} from "./steps/Step2";
import {Step3} from "./steps/Step3";
import {Step4} from "./steps/Step4";
import {Step5} from "./steps/Step5";

export const Report = () => {
  const [step, setStep] = useState(0);
  const onChange = nextStep => {
    setStep(nextStep < 0 ? 0 : nextStep > 4 ? 4 : nextStep);
  };

  const onNext = () => onChange(step + 1);
  const onPrevious = () => onChange(step - 1);

  const switchStep = (step) => {
    switch (step) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 />;
      case 2:
        return <Step3 />;
      case 3:
        return <Step4 />;
      case 4:
        return <Step5 />;
      default:
        return null;
    }
  };

  const switchStepTitle = (step) => {
    switch (step) {
      case 0:
        return 'Выбор БД';
      case 1:
        return 'Тип анализа';
      case 2:
        return 'Измерение';
      case 3:
        return 'Результат';
      case 4:
        return 'Экспорт';
      default:
        return null;
    }
  }

  return (
    <div className={styles.container}>
      <div>
        <Steps current={step}>
          <Steps.Item title="Выбор БД"/>
          <Steps.Item title="Тип анализа"/>
          <Steps.Item title="Измерение"/>
          <Steps.Item title="Результат"/>
          <Steps.Item title="Экспорт"/>
        </Steps>
        <hr/>
        <Panel header={`Шаг: ${switchStepTitle(step)}`}>
          {switchStep(step)}
        </Panel>
        <hr/>
        <ButtonGroup>
          <Button onClick={onPrevious} disabled={step === 0}>
            Предыдущий шаг
          </Button>
          <Button color={step === 3 ? 'primary' : ''} onClick={onNext} disabled={step === 4}>
            {step !== 3 ? 'Следующий шаг' : 'Сохранить и перейти к экспорту'}
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};