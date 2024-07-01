import {Avatar} from "rsuite";

export const UserInterface = ({expand}) => {


  return (
    <div style={{display: "flex", alignItems: "center", gap: 16, padding: 8}}>
      <Avatar size="md" circle src="https://i.pravatar.cc/150?u=1" />
      {expand ? <span>User name</span> : null}
    </div>
  );
};