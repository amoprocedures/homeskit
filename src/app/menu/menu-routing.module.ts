import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MenuPage} from './menu.page';

const routes: Routes = [
    {
        path: '',
        component: MenuPage,
        children: [
            {
                path: 'home',
                loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
            },
            {
                path: 'statistics',
                loadChildren: () => import('../pages/statistics/statistics.module').then(m => m.StatisticsPageModule)
            },
            {
                path: 'setting',
                loadChildren: () => import('../pages/setting/setting.module').then(m => m.SettingPageModule)
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'home'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MenuPageRoutingModule {
}
