import { useAppStore } from "@/store";

const Profile = () => {
  // Desestrutura userInfo do estado global da store
  const { userInfo } = useAppStore((state) => state);

  return (
    <div>
      <h1>Profile</h1>
      {/* Verifica se userInfo está definido antes de acessar suas propriedades */}
      {userInfo ? (
        <div>Email: {userInfo.email}</div>
      ) : (
        <div>No user information available</div>
      )}
    </div>
  );
};

export default Profile;
