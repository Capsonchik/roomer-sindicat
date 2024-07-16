import {Avatar} from "rsuite";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../store/userSlice/user.selectors";

export const UserInterface = ({expand}) => {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <div style={{display: "flex", alignItems: "center", gap: 16, padding: 8}}>
      <Avatar size="md" circle src="https://i.pravatar.cc/150?u=1" />
      {currentUser && currentUser.username ? <span>{currentUser.username}</span> : null}
    </div>
  );
};