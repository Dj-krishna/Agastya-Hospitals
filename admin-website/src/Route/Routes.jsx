import Default from "../Components/Dashboard/Default";
import AddSlots from "../Components/SlotManagements/AddSlots";
import ManageSlots from "../Components/SlotManagements/ManageSlots";
import Doctors from "../Components/Doctors";
import Departments from "../Components/Departments";
import Appointments from "../Components/Appointments";
import Technologies from "../Components/Technologies";
import HealthPackages from "../Components/HealthPackages";
import Blog from "../Components/Blog";
import RolesPermissions from "../Components/RolesPermissions";
import Settings from "../Components/Settings";
import Specialities from "../Components/Specialities";
import Patients from "../Components/Patients";
import MedicalRecords from "../Components/MedicalRocords";
import UserProfileCard from "../Components/UserProfile";

export const routes = [
  { path: `/dashboard`, Component: <Default /> },
  { path: `/doctors`, Component: <Doctors /> },
  { path: `/patients`, Component: <Patients /> },
  { path: `/medical-records`, Component: <MedicalRecords /> },
  { path: `/specialities`, Component: <Specialities /> },
  { path: `/slot-management/add-slots`, Component: <AddSlots /> },
  { path: `/slot-management/manage-slots`, Component: <ManageSlots /> },
  { path: `/departments`, Component: <Departments /> },
  { path: `/appointments`, Component: <Appointments /> },
  { path: `/technologies`, Component: <Technologies /> },
  { path: `/health-packages`, Component: <HealthPackages /> },
  { path: `/blog`, Component: <Blog /> },
  { path: `/roles-permissions`, Component: <RolesPermissions /> },
  { path: `/settings`, Component: <Settings /> },
  { path: `/my-profile`, Component: <UserProfileCard /> },
];
