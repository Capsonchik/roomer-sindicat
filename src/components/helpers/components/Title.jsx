import {Heading} from "rsuite";

export const Title = ({title, level}) => {
  return (
    <Heading level={level}>{title}</Heading>
  );
};