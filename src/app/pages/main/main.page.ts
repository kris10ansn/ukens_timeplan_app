import {
	Component,
	OnInit,
	ViewChild,
	ElementRef,
	AfterViewInit
} from "@angular/core";
import { TimeplanService } from "src/app/services/timeplan.service";
import { Platform, IonInput, IonRefresher } from "@ionic/angular";
import { TimeService } from "src/app/services/time.service";
import { Router } from "@angular/router";
import { AdMobService } from "src/app/services/admob.service";

@Component({
	selector: "app-main",
	templateUrl: "./main.page.html",
	styleUrls: ["./main.page.scss"]
})
export class MainPage implements OnInit {
	@ViewChild(IonRefresher, { static: false })
	refresher: IonRefresher;

	public week: number;
	public src: string;
	public status: string;

	private deviceWidth: number;
	private deviceHeight: number;

	constructor(
		private platform: Platform,
		private timeplan: TimeplanService,
		private time: TimeService,
		private router: Router,
		private adMob: AdMobService
	) {}

	public async ngOnInit() {
		this.src = await this.loadPlan();
	}

	public ionViewDidEnter() {
		this.refresher.disabled = false;
	}

	public ionViewWillLeave() {
		this.refresher.disabled = true;
	}

	public ionViewWillEnter() {
		const r = Math.round(Math.random());

		if (r === 1) {
			this.adMob.showInterstitial();
		}
	}

	public async reload() {
		this.src = null;
		this.src = await this.loadPlan();
	}

	public async ionRefresh(event) {
		setTimeout(() => {
			event.target.complete();
		}, 175);

		this.src = null;
		this.src = await this.loadPlan(false);
	}

	public async onWeekInput(event: Event) {
		const target = event.target as HTMLInputElement;
		target.blur();
		const week = parseInt(target.value, 10);
		this.week = week;

		this.reload();

		target.value = "";

		const r = Math.floor(Math.random() * 5);

		if (r > 1) {
			this.adMob.showInterstitial();
		}
	}

	public openSettings() {
		this.router.navigate(["settings"]);
	}

	private async loadPlan(useCache: boolean = true) {
		return new Promise<string>(async (resolve, reject) => {
			this.status = "Henter plan...";

			if (!this.deviceWidth || !this.deviceHeight) {
				this.deviceWidth = this.platform.width();
				this.deviceHeight = this.platform.height();
			}

			const x = 1.5;
			const width = Math.round(this.deviceWidth * x);
			const height = Math.round(
				this.deviceHeight * x - (this.deviceHeight * x) / 10
			);

			const day = this.time.day;
			let week;

			if (this.week) {
				week = this.week;
			} else {
				week = this.time.week;
				week = day > 5 || day === 0 ? week + 1 : week;
				this.week = week;
			}

			const { webPath } = await this.timeplan
				.base64(week, width, height, useCache)
				.catch(error => {
					if (error === "PERMISSION DENIED") {
						this.status =
							"Kunne ikke hente planen. Vennligst tillat filtilgang for at dette skal fungere. Dra ned for å prøve på nytt.";
					} else {
						this.status = `Error: "${error}", dra ned for å laste inn på nytt`;
					}
					reject(null);
					return { webPath: null };
				});

			if (webPath != null) {
				resolve(webPath);
			}
		});
	}
}
