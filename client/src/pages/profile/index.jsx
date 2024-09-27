import { Avatar } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { UPDATE_PROFILE_ROUTE } from "@/utils/constants";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";


const Profile = () => {
  const navigate = useNavigate(); 
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState(userInfo?.firstName || ""); 
  const [lastName, setLastName] = useState(userInfo?.lastName || ""); 
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  useEffect(() => {
    if(userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
  }, [userInfo])


  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name required");
      return false;
    }
    if (!lastName) {
      toast.error("Last name required");
      return false;
    }
    return true;
  };
  
  const saveChanges = async () => {
    if (validateProfile()) { // Ensure validateProfile is called properly
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor }, 
          { withCredentials: true }
        );
  
        if (response.status === 200 && response.data) {
          setUserInfo({...response.data }); 
          toast.success("Profile updated successfully"); 
          navigate("/chat"); 
        }
      } catch (error) {
        console.error("Error updating profile:", error); // Add error handling
        toast.error("Failed to update profile");
      }
    }
  };

  const handleNavigate = () => {
    if  (userInfo.profileSetup) {
      navigate('/chat')
    } else {
      toast.error('Please setup profile.')
    }
  };
  

  return (
    <div className="bg-[#f8f9fa] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max shadow-lg rounded-lg p-6 bg-white border border-gray-300">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-gray-700 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          ><Avatar className="h-30 w-30 md:w-46 md:h-46 rounded-full overflow-hidden shadow-md border-2 border-white">
          {image ? (
            <AvatarImage 
              src={image} 
              alt="User Avatar"
              className="object-cover w-full h-full bg-black" 
            />
          ) : (
            <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center ${getColor(selectedColor)}`}>
              {firstName ? firstName.charAt(0) : userInfo.email.charAt(0)}
            </div>
          )}
        </Avatar>
        
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full">
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-gray-800 items-center justify-center">
            <div className="w-full">
              <input 
                placeholder="Email" 
                type="email" 
                disabled 
                value={userInfo.email} 
                className="rounded-xl p-6 bg-gray-200 text-black border-none shadow-md" 
              />
            </div>
            <div className="w-full">
              <input 
                placeholder="First Name" 
                type="text"  
                onChange={e => setFirstName(e.target.value)}
                value={firstName} 
                className="rounded-xl p-6 bg-gray-200 text-black border-none shadow-md" 
              />
            </div>
            <div className="w-full">
              <input 
                placeholder="Last Name" 
                type="text"  
                onChange={e => setLastName(e.target.value)}
                value={lastName} 
                className="rounded-xl p-6 bg-gray-200 text-black border-none shadow-md" 
              />
            </div>
          </div>
        </div>
        <div className="flex gap-5">
          {colors.map((color, index) => (
            <div
              key={index}
              className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === index ? "outline outline-gray-600 outline-2" : ""}`}
              onClick={() => setSelectedColor(index)}
            ></div>
          ))}
        </div>
        <div className="w-full">
          <Button className="rounded-xl h-16 w-full bg-purple-500 hover:bg-purple-500 transition-all duration-300" onClick={saveChanges}> 
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
