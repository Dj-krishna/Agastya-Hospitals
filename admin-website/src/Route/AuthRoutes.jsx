import RegisterSimple from "../Components/Pages/Auth/RegisterSimple";
import Logins from "../Auth/Signin";
import ForgetPwd from "../Auth/ForgetPwd";
import NewUserRegister from "../Auth/NewUserRegister";

export const authRoutes = [
  { path: `/login`, Component: <Logins /> },
  { path: `/register-simple`, Component: <RegisterSimple /> },
  { path: `/forget-pwd`, Component: <ForgetPwd /> },
  { path: `/register-new-user`, Component: <NewUserRegister /> },
];
