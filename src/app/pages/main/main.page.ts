import { Component, OnInit } from "@angular/core";
import { TimeplanService } from "src/app/services/timeplan.service";
import { Platform } from "@ionic/angular";
import { TimeService } from "src/app/services/time.service";

@Component({
	selector: "app-main",
	templateUrl: "./main.page.html",
	styleUrls: ["./main.page.scss"]
})
export class MainPage implements OnInit {
	public week: number;
	public src: string;
	public status: string;

	private deviceWidth: number;
	private deviceHeight: number;

	constructor(
		private platform: Platform,
		private timeplan: TimeplanService,
		private time: TimeService
	) {}

	public async ngOnInit() {
		this.src = await this.loadPlan();
	}

	public async onWeekInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const week = parseInt(target.value, 10);
		this.week = week;
		target.blur();

		this.src = null;
		this.src = await this.loadPlan();

		target.value = "";
	}

	private async loadPlan() {
		return new Promise<string>(async (resolve, reject) => {
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
				.base64(week, width, height)
				.catch(error => {
					this.status = `Error: "${error}"`;
					reject(null);
					return { webPath: null };
				});

			if (webPath != null) {
				resolve(webPath);
			}
		});
	}
}
