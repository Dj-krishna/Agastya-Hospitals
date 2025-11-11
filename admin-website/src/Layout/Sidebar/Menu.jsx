export const MENUITEMS = [
  {
    menutitle: "",
    menucontent:
      "Dashboard,Doctors,Patients,MedicalRecords,Specialities,Appointments,Departments,Slot Management,AddSlots,ManageSlots,HealthPackages,Technologies,Blog,RolesPermissions,Settings",
    Items: [
      {
        title: "Dashboard",
        icon: "home",
        type: "link",
        path: `/dashboard`,
      },

      {
        title: "Doctors",
        icon: "widget",
        path: `/doctors`,
        type: "link",
      },

      {
        title: "Patients",
        icon: "widget",
        path: `/patients`,
        type: "link",
      },
      {
        title: "Medical Records",
        icon: "widget",
        path: `/medical-records`,
        type: "link",
      },
      {
        path: `/specialities`,
        icon: "file",
        title: "Specialities",
        type: "link",
      },

      {
        title: "Appointments",
        icon: "widget",
        path: `/appointments`,
        type: "link",
      },
      {
        path: `/departments`,
        icon: "project",
        title: "Departments",
        type: "link",
      },
      {
        title: "Slot Management",
        icon: "chat",
        type: "sub",
        active: false,
        children: [
          {
            path: `/slot-management/add-slots`,
            type: "link",
            title: "Add Slots",
          },
          {
            path: `/slot-management/manage-slots`,
            type: "link",
            title: "Manage Slots",
          },
        ],
      }, ///health-packages
      {
        title: "Health Packages",
        icon: "home",
        type: "link",
        path: `/health-packages`,
      },
      {
        title: "Technologies",
        icon: "home",
        type: "link",
        path: `/technologies`,
      },
      {
        path: `/blog`,
        icon: "file",
        title: "Blog",
        type: "link",
      },
      {
        path: `/testimonials`,
        icon: "home",
        title: "Testimonials",
        type: "link",
      },
      {
        path: `/roles-permissions`,
        icon: "project",
        title: "Roles & Permissions",
        type: "link",
      },
      {
        title: "Settings",
        icon: "widget",
        path: `/settings`,
        type: "link",
      },
    ],
  },
];
