import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import Dashboard from "../pages/dashboard";
import BlankPage from "../BlankPage.js";
import Login from "../auth/Login.js";
import Logout from "../auth/Logout.js";
import GalleryVideo from "../pages/gallery/gallery_video/index.jsx";
const AdministratorLoginAcitivity = React.lazy(() => import("../pages/administrator_activity/AdministratorLoginAcitivity.js"));
const UserLeave = React.lazy(() => import("../pages/leave/user_leave/index.jsx"));
const OfficeLeave = React.lazy(() => import("../pages/leave/office_leave/index.jsx"));
const AttendenceList = React.lazy(() => import("../pages/attendence/attendenceList/Index.jsx"));
const TodayAttendence = React.lazy(() => import('./../pages/attendence/todayattendence/index'));
const GalleryCategory = React.lazy(() => import("../pages/gallery/gallery_category/GalleryCategory.jsx"));
const GalleryImage = React.lazy(() => import("../pages/gallery/gallery_image/GalleryImage.jsx"));
const Slider = React.lazy(() => import("../pages/gallery/slider/index.jsx"));
const Achievements = React.lazy(() => import("../pages/gallery/achievements/index.jsx"));
const Career = React.lazy(() => import("../pages/career/index.jsx"));
const Salary = React.lazy(() => import("../pages/salary/index.jsx"));
const SalaryManage = React.lazy(() => import("../pages/salary/manage/index.jsx"));
const LoginAcitivity = React.lazy(() => import("../pages/district_head_login_activity/LoginAcitivity.js"));

const Profile = React.lazy(() => import('../pages/Profile'));
const Administrator = React.lazy(() => import('../pages/administrator/Listing'));
const DistrictHead = React.lazy(() => import('../pages/district_head/Listing'));
const ChangePassword = React.lazy(() => import('../pages/ChangePassword'));
const ListVacancies = React.lazy(() => import('../pages/vacancies/Listing'));
const UsersWorklist = React.lazy(() => import('../pages/users_work/Listing'));
const UsersWorklistTime = React.lazy(() => import('../pages/users_work_time/Listing'));
const TerminatedTeacher = React.lazy(() => import('../pages/users/TerminatedTeacher'));
const Contacts = React.lazy(() => import('../pages/users/Contacts'));
const BankDetail = React.lazy(() => import('../pages/users/BankDetail'));
const UserOverView = React.lazy(() => import('../pages/users/UserOverView'));
const Settings = React.lazy(() => import('../pages/setting'));
const NotificationReport = React.lazy(() => import('../pages/notification/Listing'));
const District = React.lazy(() => import('../pages/location/district'));
const Block = React.lazy(() => import('../pages/location/block'));
const Noticeboard = React.lazy(() => import('../pages/website/noticeboard/index'));
const authProtectedRoutes = [
  { path: "/dashboard", exact: true, component: <Dashboard /> },
  { path: "/attendacelist", exact: true, component: <AttendenceList /> },
  { path: "/todayattendance", exact: true, component: <TodayAttendence /> },
  { path: "/administrator/list", exact: true, component: <Administrator /> },
  { path: "/administrator/activity", exact: true, component: <AdministratorLoginAcitivity /> },
  { path: "/district-head/list", exact: true, component: <DistrictHead /> },
  { path: "/district-head/activity", exact: true, component: <LoginAcitivity /> },
  { path: "/vacancies", exact: true, component: <ListVacancies /> },
  { path: "/Working-list", exact: true, component: <UsersWorklist /> },
  { path: "/working-time", exact: true, component: <UsersWorklistTime /> },
  { path: "/terminated-teachers", exact: true, component: <TerminatedTeacher /> },
  { path: "/teachers", exact: true, component: <Contacts /> },
  { path: "/teachers-account-list", exact: true, component: <BankDetail /> },
  { path: "/teachers/:reg_code", exact: true, component: <UserOverView /> },
  { path: "/password", exact: true, component: <ChangePassword /> },
  { path: "/settings", exact: true, component: <Settings /> },
  { path: "/notification/report", exact: true, component: <NotificationReport /> },
  { path: "/profile", exact: true, component: <Profile /> },
  { path: "/location/district", exact: true, component: <District /> },
  { path: "/location/block", exact: true, component: <Block /> },
  { path: "/galleycategory", exact: true, component: <GalleryCategory /> },
  { path: "/galleryimage", exact: true, component: <GalleryImage /> },
  { path: "/galleryvideo", exact: true, component: <GalleryVideo /> },
  { path: "/slider", exact: true, component: <Slider /> },
  { path: "/achievements", exact: true, component: <Achievements /> },
  { path: "/career", exact: true, component: <Career /> },
  { path: "/leave-list", exact: true, component: <UserLeave /> },
  { path: "/office-leave", exact: true, component: <OfficeLeave /> },
  { path: "/salary", exact: true, component: <Salary /> },
  { path: "/salary-manage", exact: true, component: <SalaryManage /> },
  { path: "/website/notice_bord", exact: true, component: <Noticeboard /> },
  { path: "*", component: <BlankPage /> },
];

const publicRoutes = [
  {
    path: "/",
    exact: true,
    component: <Navigate to="/login" />,
  },
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "*", component: <BlankPage /> },

];

export { authProtectedRoutes, publicRoutes };