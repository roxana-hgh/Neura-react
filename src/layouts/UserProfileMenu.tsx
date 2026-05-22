import { User } from "lucide-react";
import { Button } from "../components/ui/button";

function ProfileMenu() {
  return (
    <div className="">
      <Button variant="default" size="xs" className="flex items-center" >
        <User />
        Profile
      </Button>
    </div>
  );
}

export default ProfileMenu;
