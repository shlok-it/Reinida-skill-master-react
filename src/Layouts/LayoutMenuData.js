import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isVacancies, setIsVacancies] = useState(false);
  const [isCareer, setIsCareer] = useState(false);
  const [isSalary, setisSalary] = useState(false);
  const [isAttendance, setIsAttendance] = useState(false);
  const [isWorkingTime, setWorkingTime] = useState(false);
  const [isWorkinglist, setisWorkinglist] = useState(false);
  const [isUsers, setIsUsers] = useState(false);
  const [isGalleryCategory, setIsGalleryCategory] = useState(false);
  const [isLocation, setIsLocation] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isAdsReport, setIsAdsReport] = useState(false);
  const [isAdministrator, setIsAdministrator] = useState(false);
  const [isAdsHistory, setIsAdsHistory] = useState(false);
  const [isProject, setIsProject] = useState(false);
  const [isLeave, setIsLeave] = useState(false);
  const [isTasks, setIsTasks] = useState(false);
  const [isSocialTasks, setIsSocialTasks] = useState(false);
  const [isWorkReport, setIsWorkReport] = useState(false);
  const [isPackage, setIsPackage] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const [isLiveClientReport, setIsLiveClientReport] = useState(false);
  const [isSessionYear, setSessionYear] = useState(false);
  const [isWebsite, setWebsite] = useState(false);
  const [isDistrictHead, setIsDistrictHead] = useState(false);

 

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "DistrictHead") {
      setIsDistrictHead(false);
    }
   
    if (iscurrentState !== "Attendance") {
      setIsAttendance(false);
    }
    if (iscurrentState !== "working_time") {
      setWorkingTime(false);
    }
    if (iscurrentState !== "Vacancies") {
      setIsVacancies(false);
    }
    if (iscurrentState !== "GalleryCategory") {
      setIsGalleryCategory(false);
    }
    if (iscurrentState !== "WorkingList") {
      setisWorkinglist(false);
    }
    if (iscurrentState !== "Teachers") {
      setIsUsers(false);
    }
    if (iscurrentState !== "Administrator") {
      setIsAdministrator(false);
    }
    if (iscurrentState !== "Client") {
      setIsClient(false);
    }
    if (iscurrentState !== "Project") {
      setIsProject(false);
    }
    if (iscurrentState !== "Tasks") {
      setIsTasks(false);
    }
    if (iscurrentState !== "SocialTasks") {
      setIsSocialTasks(false);
    }
    if (iscurrentState !== "Leave") {
      setIsLeave(false);
    }
    
    if (iscurrentState !== "AdsReport") {
      setIsAdsReport(false);
    }
    if (iscurrentState !== "AdsHistory") {
      setIsAdsHistory(false);
    }
    if (iscurrentState !== "WorkReport") {
      setIsWorkReport(false);
    }
    if (iscurrentState !== "Package") {
      setIsPackage(false);
    }
    if (iscurrentState !== "LiveClientReport") {
      setIsLiveClientReport(false);
    }
    if (iscurrentState !== "Notification") {
      setIsNotification(false);
    }
    if (iscurrentState !== "Location") {
      setIsLocation(false);
    }
    if (iscurrentState !== "Career") {
      setIsCareer(false);
    }
    if (iscurrentState !== "Salary") {
      setisSalary(false);
    }
    if (iscurrentState !== "SessionYear") {
      setSessionYear(false);
    }
    if (iscurrentState !== "Website") {
      setWebsite(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isAttendance,
    isVacancies,
    isGalleryCategory,
    isWorkinglist,
    isWorkingTime,
    isUsers,
    isClient,
    isProject,
    isAdministrator,
    isTasks,
    isSocialTasks,
    isAdsReport,
    isAdsHistory,
    isWorkReport,
    isNotification,
    isPackage,
    isLeave,
    isLocation,
    isCareer.
    isSalary,
    isLiveClientReport,
    isSessionYear,
    isWebsite
  ]);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "mdi mdi-home-outline",
      link: "/dashboard",
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
      }
    },
    {
      id: "career",
      label: "Career form",
      icon: "mdi mdi-school",
      link: "/career",
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isCareer);
        setIscurrentState("Career");
      }
    },
    {
      id: "leave",
      label: "Leave",
      icon: "mdi mdi-logout",
      link: "/#",
      stateVariables: isLeave,
      click: function (e) {
        e.preventDefault();
        setIsLeave(!isLeave);
        setIscurrentState("Leave");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "officeleave",
          label: "Office Leave",
          link: "/office-leave",
          parentId: "leave",
        },
        {
          id: "staffleave",
          label: "Teacher Leave",
          link: "/leave-list",
          parentId: "leave",
        }
      ]
    },
    
    {
      id: "attendance",
      label: "Attendance",
      icon: "mdi mdi-ray-start-arrow",
      link: "/#",
      stateVariables: isAttendance,
      click: function (e) {
        e.preventDefault();
        setIsAttendance(!isAttendance);
        setIscurrentState("Attendance");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "todayAttendance",
          label: "Today Attendance",
          link: "/todayattendance",
          parentId: "attendance",
        },
        {
          id: "allAttendance",
          label: "Attendace List",
          link: "/attendacelist",
          parentId: "attendance",
        },
      ]
    },
    {
      id: "vacancies",
      label: "Vacancies",
      icon: "mdi mdi-playlist-check",
      link: "/vacancies",
      // hideFor: ['MANAGER'],
      click: function (e) {
        e.preventDefault();
        setIsPackage(!isVacancies);
        setIscurrentState("Vacancies");
      }
    },
    {
      id: "Working-list",
      label: "Working list",
      icon: "mdi mdi-account",
      link: "/Working-list",
      // hideFor: ['MANAGER'],
      click: function (e) {
        e.preventDefault();
        setIsPackage(!isWorkinglist);
        setIscurrentState("WorkingList");
      }
    },
    {
      id: "workingtime",
      label: "Working Time",
      icon: "mdi mdi-history",
      link: "/working-time",
      // hideFor: ['MANAGER'],
      click: function (e) {
        e.preventDefault();
        setIsPackage(!isWorkingTime);
        setIscurrentState("working_time");
      }
    },
    {
      id: "teachers",
      label: "Teachers",
      icon: "mdi mdi-account-multiple-outline",
      link: "/#",
      stateVariables: isUsers,
      click: function (e) {
        e.preventDefault();
        setIsUsers(!isUsers);
        setIscurrentState("Teachers");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "all_teachers",
          label: "All Teachers",
          link: "/teachers",
          parentId: "teachers",
        },
        {
          id: "teachers-account",
          label: "Teachers Account",
          link: "/teachers-account-list",
          parentId: "teachers",
        },
        // {
        //   id: "active_teachers",
        //   label: "Active Teachers",
        //   link: "/teachers",
        //   parentId: "teachers",
        // },
        // {
        //   id: "expired_teachers",
        //   label: "Expired Teachers",
        //   link: "/teachers",
        //   parentId: "teachers",
        // }
      ]
    },
    {
      id: "gallery",
      label: "Media",
      icon: "mdi mdi-image",
      link: "/#",
      stateVariables: isGalleryCategory,
      click: function (e) {
        e.preventDefault();
        setIsGalleryCategory(!isGalleryCategory);
        setIscurrentState("GalleryCategory");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "galleycategory",
          label: "Gallery Category",
          link: "/galleycategory",
          parentId: "gallery",
        },
        {
          id: "galleryimage",
          label: "Gallery Image",
          link: "/galleryimage",
          parentId: "gallery",
        },
        {
          id: "galleryvideo",
          label: "Video Gallery",
          link: "/galleryvideo",
          parentId: "gallery",
        },
        {
          id: "slider",
          label: "Slider List",
          link: "/slider",
          parentId: "gallery",
        },
        {
          id: "achievements",
          label: "Achievements",
          link: "/achievements",
          parentId: "gallery",
        },
      ]
    },
    {
      id: "Salary",
      label: "Payroll & Salary",
      icon: "mdi mdi-wallet",
      link: "/#",
      stateVariables: isSalary,
      click: function (e) {
        e.preventDefault();
        setisSalary(!isSalary);
        setIscurrentState("Salary");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "list",
          label: "Salary List",
          link: "/salary",
          parentId: "Salary",
        },
        {
          id: "salarymanage",
          label: "Salary Manage",
          link: "/salary-manage",
          parentId: "Salary",
        },
       
      ]
    },    
    {
      id: "administrator",
      label: "Administrator",
      icon: "mdi mdi-security-account",
      link: "/#",
      hideFor: ['MANAGER'],
      stateVariables: isAdministrator,
      click: function (e) {
        e.preventDefault();
        setIsAdministrator(!isAdministrator);
        setIscurrentState("Administrator");
      },subItems: [
        {
          id: "administratorlist",
          label: "List",
          link: "/administrator/list",
          parentId: "administrator",
        },
        {
          id: "administratoractivity",
          label: "Activity Log",
          link: "/administrator/activity",
          parentId: "administrator",
        }
      ]
    },
    {
      id: "DistrictHead",
      label: "District Head",
      icon: "mdi mdi-security-account",
      link: "/#",
      // hideFor: ['MANAGER'],
      stateVariables: isDistrictHead,
      click: function (e) {
        e.preventDefault();
        setIsDistrictHead(!isDistrictHead);
        setIscurrentState("DistrictHead");
      },
       subItems: [
        {
          id: "DistrictHeadlist",
          label: "List",
          link: "/district-head/list",
          parentId: "DistrictHead",
        },
        {
          id: "DistrictHeadActivity",
          label: "Activity Log",
          link: "/district-head/activity",
          parentId: "DistrictHead",
        }
      ]
    },
    {
      id: "location",
      label: "Location",
      icon: "mdi mdi-map-marker",
      link: "/#",
      stateVariables: isLocation,
      click: function (e) {
        e.preventDefault();
        setIsLocation(!isLocation);
        setIscurrentState("Location");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "district",
          label: "All District",
          link: "/location/district",
          parentId: "location",
        },
        {
          id: "all_block",
          label: "All Block",
          link: "/location/block",
          parentId: "location",
        }
      ]
    },
    {
      id: "website",
      label: "Website",
      icon: "mdi mdi-web",
      link: "/#",
      stateVariables: isWebsite,
      click: function (e) {
        e.preventDefault();
        setWebsite(!isWebsite);
        setIscurrentState("Website");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "notice_bord",
          label: "Notice Board",
          link: "/website/notice_bord",
          parentId: "website",
        },
      ]
    },
    {
      id: "notification",
      label: "Notification",
      icon: "mdi mdi-bell-outline",
      link: "/notification/report",
      click: function (e) {
        e.preventDefault();
        setIsNotification(!isNotification);
        setIscurrentState("Notification");
      }
    },
    // {
    //   id: "SessionYear",
    //   label: "Session Year",
    //   icon: "mdi mdi-arrow-outline",
    //   link: "session-year",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsNotification(!isSessionYear);
    //     setIscurrentState("SessionYear");
    //   }
    // },
    {
      id: "notification",
      label: "",
      icon: "",
      link: "#",
      click: function (e) {
        e.preventDefault();
        setIsNotification(!isNotification);
        setIscurrentState("Notification");
      }
    },
  
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
