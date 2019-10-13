import { Component, OnInit } from "@angular/core";
import { TimeplanService } from "src/app/services/timeplan.service";
import { Platform } from "@ionic/angular";

@Component({
	selector: "app-main",
	templateUrl: "./main.page.html",
	styleUrls: ["./main.page.scss"]
})
export class MainPage implements OnInit {
	public imageSrc: string;

	constructor(
		private platform: Platform,
		private timeplan: TimeplanService
	) {}

	async ngOnInit() {
		const pWidth = this.platform.width();
		const pHeight = this.platform.height();

		const x = 1.25;
		const width = Math.round(pWidth * x);
		const height = Math.round(pHeight * x - (pHeight * x) / 20);

		const src = await this.timeplan.base64(40, width, height);

		this.imageSrc = src;
	}
}
