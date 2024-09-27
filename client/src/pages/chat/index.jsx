import { toast } from "sonner";
import { useAppStore } from "@/store"; 
import { useEffect } from "react"; 
import { useNavigate } from "react-router-dom"; 

const Chat = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo?.profileSetup) { 
      toast("Please set up your profile to continue."); 
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return <div>Chat</div>;
};

export default Chat;
