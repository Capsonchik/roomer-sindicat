import {Avatar} from "rsuite";

export const UserInterface = () => {
  return (
    <div style={{display: "flex", alignItems: "center", gap: 16, padding: 8}}>
      <Avatar size="md" circle src="https://i.pravatar.cc/150?u=1" />
      <span>User name</span>
    </div>
  );
};