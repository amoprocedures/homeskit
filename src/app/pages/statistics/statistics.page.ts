import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DatabaseService} from '../../database/database.service';
import {CategoryStat} from '../../shared/shared.models';
import {UtilService} from '../../shared/util.service';
import {AnimationController} from '@ionic/angular';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.page.html',
    styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {

    @ViewChild('card', {read: ElementRef, static: true}) card: ElementRef;
    @ViewChild('card2', {read: ElementRef, static: true}) card2: ElementRef;
    stats: CategoryStat[];

    totalExp = 0.0;

    constructor(
        private database: DatabaseService,
        private util: UtilService,
        private animCtrl: AnimationController
    ) {
    }

    async ngOnInit() {
        await this.runStats();
    }

    async runStats() {
        const anim1 = this.animCtrl
            .create()
            .addElement(this.card2.nativeElement)
            .duration(1000)
            .iterations(1)
            .fromTo('transform', 'translateY(100px)', 'translateY(0)')
            .fromTo('opacity', '0', '1');
        const anim2 = this.animCtrl
            .create()
            .addElement(this.card.nativeElement)
            .duration(1200)
            .iterations(1)
            .fromTo('transform', 'translateY(100px)', 'translateY(0)')
            .fromTo('opacity', '0', '1');
        const parent = this.animCtrl
            .create()
            .duration(1200)
            .iterations(1)
            .addAnimation([anim1, anim2]);
        parent.play();
        this.database.dbReady.subscribe(async (isReady) => {
            if (isReady) {
                this.getData();
            }
        });
    }

    getData() {
        this.database.statsUIData().subscribe((stats) => {
            this.stats = stats;
            this.stats.map((stat) => {
                if (stat.type === 'This Year') {
                    this.totalExp = stat.total_price;
                }
            });
        });
    }

    getColor(index = 0) {
        const selected = (index > 8) ? index % 8 : index;
        const colors = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];
        return colors[selected];
    }
}
