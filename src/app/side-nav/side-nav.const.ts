import { IconNavItem } from 'techteec-lib/components/icon-side-nav';
import {
  ADD_ICON,
  ADMIN_ICON,
  COUNTER_ICON,
  DASHBOARD_ICON,
  DEVICE_ICON,
  DICTIONARY,
  EXTRA_FIELDS_ICON,
  HOME_ICON,
  KPI_ICON,
  LIST_ICON,
  REPORT_ICON,
  SHARE_ICON,
  SUBSET_ICON,
  TEAM_ICON,
} from '../common/app-icons.const';
import { IconNavItemWithRoles } from './side-nav';
export const items: IconNavItemWithRoles[] = [
  {
    title: 'Home',
    svgIcon: HOME_ICON,
    postition: 'top',
    routerLink: 'home'
  },
  {
    title: 'Projects',
    svgIcon: KPI_ICON,
    postition: 'top',
    roles: ['admin','Telemarketer'],
    children: [
      {
        title: 'Project List',
        svgIcon: LIST_ICON,
        routerLink: 'projects'
      }

    ],
  },
  {
    title: 'Statistics',
    svgIcon: DASHBOARD_ICON,
    postition: 'top',
    roles: ['admin','Researcher'],
    children: [
      {
        title: 'General Reports',
        svgIcon: REPORT_ICON,
        routerLink: 'charts'
      },
      {
        title: 'Hourly Targets',
        svgIcon: KPI_ICON,
        routerLink: 'evaluations'
      }

    ],
  },

  {
    title: 'Team Mistake',
    svgIcon: TEAM_ICON,
    postition: 'top',
    routerLink: 'team-mistake'
  },

  {
    title: 'Settings',
    svgIcon: ADMIN_ICON,
    postition: 'bottom',
    roles: ['admin'],
    children: [
      // {
      //   title: 'Devices',
      //   svgIcon: DEVICE_ICON,
      //   routerLink: 'admin/devices',

      // },
      {
        title: 'Segmants',
        svgIcon: SUBSET_ICON,
        routerLink: 'setting/segmants'
      },
      {
        title: 'Mistake Type',
        svgIcon: DICTIONARY,
        routerLink: 'setting/mistake-type'
      },
      {
        title: 'Dictionary Mapping',
        svgIcon: EXTRA_FIELDS_ICON,
        children :[
          {
            title: 'Project Type Dictionary',
            svgIcon: EXTRA_FIELDS_ICON,
            routerLink: 'setting/dictionary'
          },
          {
            title: 'Mistake Type Dictionary',
            svgIcon: COUNTER_ICON,
            routerLink: 'setting/mistake-dictionary'
          }
        ]
      },
    ],
  },
];
