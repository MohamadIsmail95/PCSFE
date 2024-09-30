import { Routes} from '@angular/router';
import { authGuard } from './app-core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./side-nav/side-nav.component').then((c) => c.SideNavComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./project/project-list/project-list.component').then(
            (c) => c.ProjectListComponent
          ),canActivate: [authGuard], data: {Roles: ['admin', 'Telemarketer']}
      },
      {
        path: 'create-project',
        loadComponent: () =>
          import('./project/create-project/create-project.component').then(
            (c) => c.CreateProjectComponent
          ),canActivate: [authGuard], data: {Roles: ['admin', 'Telemarketer']}
      },
      {
        path: 'edit-project/:id',
        loadComponent: () =>
          import('./project/edit-project/edit-project.component').then(
            (c) => c.EditProjectComponent
          ),canActivate: [authGuard], data: {Roles: ['admin', 'Telemarketer']}
      },
      {
        path: 'charts',
        loadComponent: () =>
          import('./project/allcharts/allcharts.component').then(
            (c) => c.AllchartsComponent
          ),canActivate: [authGuard], data: {Roles: ['admin', 'Researcher']}
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./home/home.component').then(
            (c) => c.HomeComponent
          )
      },
      {
        path: 'evaluations',
        loadComponent: () =>
          import('./project/evaluations/evaluation/evaluation.component').then(
            (c) => c.EvaluationComponent
          )
      },
      {
        path: 'setting/segmants',
        loadComponent: () =>
          import('./project/setting/segmant/segmant.component').then(
            (c) => c.SegmantComponent
          )
      },
      {
        path: 'setting/dictionary',
        loadComponent: () =>
          import('./project/setting/dictionary-type/dictionary-type.component').then(
            (c) => c.DictionaryTypeComponent
          )
      },
      {
        path: 'setting/mistake-dictionary',
        loadComponent: () =>
          import('./project/setting/mistake-dictionary-type/mistake-dictionary-type.component').then(
            (c) => c.MistakeDictionaryTypeComponent
          )
      },
      {
        path: 'setting/create-segmant',
        loadComponent: () =>
          import('./project/setting/create-segmant/create-segmant.component').then(
            (c) => c.CreateSegmantComponent
          )
      },
      {
        path: 'mistakes/:id',
        loadComponent: () =>
          import('./project/mistakes/mistak-table/mistak-table.component').then(
            (c) => c.MistakTableComponent
          )
      },
      {
        path: 'project-dictionary/:id',
        loadComponent: () =>
          import('./project/setting/project-dictionary/project-dictionary.component').then(
            (c) => c.ProjectDictionaryComponent
          )
      },
      {
        path: 'mistake-dictionary/:id',
        loadComponent: () =>
          import('./project/setting/mistake-dictionary/mistake-dictionary.component').then(
            (c) => c.MistakeDictionaryComponent
          )
      },
      {
        path: 'segment-evaluation/:id',
        loadComponent: () =>
          import('./project/segment-evaluation/segment-evaluation.component').then(
            (c) => c.SegmentEvaluationComponent
          )
      },
      {
        path: 'create-mistake/:id',
        loadComponent: () =>
          import('./project/mistakes/create-mistake/create-mistake.component').then(
            (c) => c.CreateMistakeComponent
          )
      },
      {
        path: 'edit-mistake/:id',
        loadComponent: () =>
          import('./project/mistakes/update-mistake/update-mistake.component').then(
            (c) => c.UpdateMistakeComponent
          )
      },

    ],
  },
  {
    path: '403',
        loadComponent: () =>
          import('./app-core/redirects/not-eligible/not-eligible.component').then(
            (c) => c.NotEligibleComponent
          )
  },
  {
    path: '**',
        loadComponent: () =>
          import('./project/notfound/notfound.component').then(
            (c) => c.NotfoundComponent
          )
  }

];
