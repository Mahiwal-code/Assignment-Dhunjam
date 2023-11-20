import { useNavigate } from "react-router-dom";
const Login = ({
  handleLogin,
  username,
  password,
  setPassword,
  setUsername,
}) => {
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = () => {
    const token = handleLogin();
    if (token) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="bg-black h-screen flex items-center justify-center">
      <div className="bg-black p-8 flex flex-col items-center rounded shadow-md">
        <p className="text-2xl font-bold mb-4 text-center text-white">
          Venue Admin Login
        </p>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          className="w-[600px] p-2 mb-4 border rounded-xl "
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className="w-[600px] p-2 mb-4 border rounded-xl "
        />
        <button
          onClick={handleSignIn}
          className="w-[600px] px-4 py-2 bg-blue-800 text-white rounded-xl"
        >
          Sign In
        </button>
        <div className="text-center mt-4">
          <a href="/registration" className="text-blue-800">
            New Registeration ?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
