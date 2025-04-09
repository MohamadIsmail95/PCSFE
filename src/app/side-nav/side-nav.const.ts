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
  MISTAKE,
  MISTAKE_LIST,
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
    routerLink: 'home',
  },
  {
    title: 'Projects',
    svgIcon: KPI_ICON,
    postition: 'top',
    roles: ['admin', 'Telemarketer', 'Researcher'],
    children: [
      {
        title: 'Project List',
        svgIcon: LIST_ICON,
        routerLink: 'projects',
      },
    ],
  },
  {
    title: 'Statistics',
    svgIcon: DASHBOARD_ICON,
    postition: 'top',
    roles: ['admin', 'Researcher', 'Telemarketer'],
    children: [
      {
        title: 'General Reports',
        svgIcon: REPORT_ICON,
        routerLink: 'charts',
      },
      {
        title: 'Hourly Targets',
        svgIcon: KPI_ICON,
        routerLink: 'evaluations',
        roles: ['admin'],
      },
    ],
  },

  {
    title: 'Mistakes',
    svgIcon: MISTAKE,
    postition: 'top',
    roles: ['admin'],
    children: [
      {
        title: 'Mistake List',
        svgIcon: MISTAKE_LIST,
        postition: 'top',
        routerLink: 'mistakes',
      },
      {
        title: 'Team Mistake',
        svgIcon: TEAM_ICON,
        postition: 'top',
        routerLink: 'team-mistake',
      },
      {
        title: 'Weight Vs Survey',
        svgIcon: DICTIONARY,
        postition: 'top',
        routerLink: 'weight-survey',
      },
      {
        title: 'Summary',
        svgIcon: DEVICE_ICON,
        postition: 'top',
        routerLink: 'mistake-summary',
      },
    ],
  },
  {
    title: 'Settings',
    svgIcon: ADMIN_ICON,
    postition: 'bottom',
    roles: ['admin'],
    children: [
      {
        title: 'Segmants',
        svgIcon: SUBSET_ICON,
        routerLink: 'setting/segmants',
      },
      {
        title: 'Mistake Type',
        svgIcon: COUNTER_ICON,
        routerLink: 'setting/mistake-type',
      },
      {
        title: 'Dictionary Mapping',
        svgIcon: EXTRA_FIELDS_ICON,
        children: [
          {
            title: 'Project Type Dictionary',
            svgIcon: EXTRA_FIELDS_ICON,
            routerLink: 'setting/dictionary',
          },
        ],
      },
    ],
  },
];
