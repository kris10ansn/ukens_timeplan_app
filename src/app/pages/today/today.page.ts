import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Platform, IonContent, IonRefresher } from "@ionic/angular";
import { TimeplanService } from "src/app/services/timeplan.service";
import Jimp from "jimp";
import { File } from "@ionic-native/file/ngx";
import { BlobGeneratorService } from "src/app/services/blob-generator.service";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { TimeService } from "src/app/services/time.service";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { UserInfoService } from "src/app/services/user-info.service";
import { Router } from "@angular/router";
import { AdMobService } from "src/app/services/admob.service";

@Component({
	selector: "app-today",
	templateUrl: "./today.page.html",
	styleUrls: ["./today.page.scss"]
})
export class TodayPage implements OnInit {
	@ViewChild(IonRefresher, { static: false })
	refresher: IonRefresher;

	public week: number;
	public day: number;
	public status: string;
	public src: SafeUrl;

	private deviceWidth: number;
	private deviceHeight: number;

	constructor(
		private platform: Platform,
		private timeplan: TimeplanService,
		private file: File,
		private blob: BlobGeneratorService,
		private sanitizer: DomSanitizer,
		private webview: WebView,
		private time: TimeService,
		private userInfo: UserInfoService,
		private router: Router,
		private adMob: AdMobService
	) {}

	public async ngOnInit() {
		this.status = "Laster...";
		this.src = await this.getTodaysPlan();
	}

	public ionViewDidEnter() {
		this.refresher.disabled = false;
	}

	public ionViewWillLeave() {
		this.refresher.disabled = true;
	}

	public async reload() {
		this.src = null;
		this.src = await this.getTodaysPlan();
	}

	public async ionRefresh(event) {
		const { floor, random } = Math;
		const r = floor(random() * 5);

		setTimeout(() => {
			event.target.complete();

			if (r > 1) {
				this.adMob.showInterstitial();
			}
		}, 175);

		this.src = null;
		this.src = await this.getTodaysPlan(false);
	}

	public async onDaySelect(event) {
		const day = event.value;
		this.day = day;

		this.reload();

		const { floor, random } = Math;
		const r = floor(random() * 5);

		if (r > 1) {
			this.adMob.showInterstitial();
		}
	}

	public openSettings() {
		this.router.navigate(["settings"]);
	}

	public async onWeekInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const week = parseInt(target.value, 10);
		this.week = week;
		target.blur();

		this.src = null;
		this.src = await this.getTodaysPlan();

		target.value = "";
	}

	private async getTodaysPlan(useCache = true) {
		return new Promise(async (resolve, reject) => {
			if (!this.deviceWidth || !this.deviceHeight) {
				this.deviceWidth = this.platform.width();
				this.deviceHeight = this.platform.height();
			}

			const x = 1.25;
			const width = Math.round(this.deviceWidth * x);
			const height = Math.round(
				this.deviceHeight * x - (this.deviceHeight * x) / 8
			);

			let week, day;
			day = this.time.day;

			if (this.week) {
				week = this.week;
			} else {
				week = this.time.week;
				week = day > 5 || day === 0 ? week + 1 : week;
				this.week = week;
			}

			const { hours, minutes } = this.time;

			if (this.day) {
				day = this.day;
			} else if (day > 5 || day === 0) {
				day = 1;
			} else if (
				(hours > 15 || (hours === 15 && minutes > 15)) &&
				day !== 5
			) {
				// Schoolday is over, show next day
				day++;
			}

			this.day = day;

			const userid = await this.userInfo.userId();
			const schoolid = await this.userInfo.schoolId();

			const filename = `day-timeplan${width}x${height}-${week}-${day}-${userid}-school${schoolid}.png`;

			const filecached = await this.file
				.checkFile(this.file.externalCacheDirectory, filename)
				.catch(e => {
					console.error(e, "checkFile");
					return false;
				});

			if (filecached && useCache) {
				const path = this.webview
					.convertFileSrc(this.file.externalCacheDirectory + filename)
					.replace("undefined", "http://localhost");

				return resolve(path);
			}

			this.status = "Henter planen...";
			const response = await this.timeplan
				.base64(week, width * 5, height, useCache)
				.catch(error => {
					if (error === "PERMISSION DENIED") {
						this.status =
							"Kunne ikke hente planen. Vennligst tillat filtilgang for at dette skal fungere. Dra ned for å prøve på nytt.";
					} else {
						this.status = `Error: "${error}", dra ned for å laste inn på nytt`;
					}
					console.error(error);
				});

			const { localPath } = response as any;

			this.status = "Beskjærer plan...";

			const chunks = localPath.split("/");
			const dir = localPath.replace(chunks[chunks.length - 1], "");
			const timeplanFile = chunks[chunks.length - 1];

			let ret = false;
			const buffer = await this.file
				.readAsArrayBuffer(dir, timeplanFile)
				.catch(error => {
					console.error(error);
					ret = true;
				});

			if (ret) {
				this.status = "Prøver på ny...";
				return this.reload();
			}

			const base64 = await Jimp.read(buffer as any)
				.then(image => {
					return image
						.crop(width * (day - 1), 0, width - 5, height)
						.getBase64Async(image.getMIME());
				})
				.catch(error => {
					console.error(error);

					ret = true;
					return null;
				});

			if (ret) {
				this.status = "Prøver på ny...";
				return this.reload();
			}

			this.status = "Loading";

			const blob = this.blob.fromBase64(base64);

			const blobUrl = window.URL.createObjectURL(blob);

			resolve(this.sanitizer.bypassSecurityTrustUrl(blobUrl));

			this.file.writeFile(
				this.file.externalCacheDirectory,
				filename,
				blob,
				{ replace: true }
			);
		});
	}
}
