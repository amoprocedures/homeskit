import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.page.html',
    styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
    public selectedIndex = 0;
    public appPages = [
        {
            title: 'Home',
            url: 'menu/home',
            icon: 'home-outline'
        },
        {
            title: 'Statistics',
            url: 'menu/statistics',
            icon: 'bar-chart-outline'
        },
        {
            title: 'Sync Data',
            url: 'menu/setting',
            icon: 'sync-outline'
        }
    ];

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    async onMenuClick(page: { title, url, icon }, index: number) {
        this.selectedIndex = index;
        await this.router.navigate([page.url], {replaceUrl: true});
    }

}
