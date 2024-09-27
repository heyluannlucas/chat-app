import { useState } from 'react';
import Emoji from '../../assets/teste.png';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import LogIn from '../../assets/login.jpeg';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { SIGNUP_ROUTE, LOGIN_ROUTE } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateSignup = () => {
    if (!email.length) {
      toast.error('Email is required');
      return false;
    }
    if (!password.length) {
      toast.error('Password is required');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.error('Email is required');
      return false;
    }
    if (!password.length) {
      toast.error('Password is required');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const res = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
        console.log({ res });
        toast.success('Login successful!');
        
        if (res.data.user.id) { 
          setUserInfo(res.data.user)
          if (res.data.user.profileSetup) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }
        
      } catch (error) {
        console.error({ error });
        toast.error('Login failed. Please check your credentials.');
      }
    }
  };
  

  const handleSignup = async () => {
    if (validateSignup()) {
      try {
        const res = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true });
        console.log({ res });
        toast.success('Signup successful! Please log in.');
        
        if (res.status === 201) {
          setUserInfo(res.data.user)
          navigate("/profile");
        }
        
      } catch (error) {
        console.error({ error });
        toast.error('Signup failed. Please try again.');
      }
    }
  };
  

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-6 w-full">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold md:text-6xl text-center">Welcome</h1>
            <img src={Emoji} alt="heart emoji" className="h-[90px] my-4" />
            <p className="font-medium text-center">
              Fill in the details to get started with the chat app
            </p>
          </div>

          <div className="w-full flex items-center justify-center">
            <Tabs className="w-3/4" defaultValue='login'>
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value='login'
                  className="text-black text-opacity-90 border-b-2 border-transparent 
                  w-full p-3 transition-all duration-300 
                  data-[state=active]:font-semibold data-[state=active]:border-b-purple-500"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value='signup'
                  className="text-black text-opacity-90 border-b-2 border-transparent 
                  w-full p-3 transition-all duration-300 
                  data-[state=active]:font-semibold data-[state=active]:border-b-purple-500"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value='login'>
                <input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="custom-button" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5 mt-10" value='signup'>
                <input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button className="custom-button" onClick={handleSignup}>
                  Signup
                </Button> 
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={LogIn} alt="background login" className="h-[500px] w-[600px]" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
