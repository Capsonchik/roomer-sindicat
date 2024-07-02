import {Heading} from "rsuite";

export const Title = ({title, level}) => {
  return (
    <Heading style={{marginBottom: 16}} level={level}>{title}</Heading>
  );
};