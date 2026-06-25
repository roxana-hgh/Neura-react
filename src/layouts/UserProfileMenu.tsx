import { User } from "lucide-react";
import { Button } from "../components/ui/button";
import { authClient } from "../lib/auth-client";
import { useNavigate } from "react-router-dom";

function ProfileMenu() {
  const navigate = useNavigate();

const handleLogout = async () => {
  await authClient.signOut();
  navigate("/login");
};
  return (
    <div className="flex items-center gap-2">
      <Button variant="default" size="xs" className="flex items-center" >
        <User />
        Profile
      </Button>
      <Button onClick={handleLogout} variant="outline" size="xs" className="flex items-center" >
     
        logout
      </Button>
    </div>
  );
}

export default ProfileMenu;
