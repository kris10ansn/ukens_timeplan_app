import { Injectable } from "@angular/core";
import {
	AdMobFree,
	AdMobFreeBannerConfig,
	AdMobFreeInterstitialConfig
} from "@ionic-native/admob-free/ngx";
import { Platform } from "@ionic/angular";

@Injectable({
	providedIn: "root"
})
export class AdMobService {
	private testing = false;

	constructor(private admob: AdMobFree, private platform: Platform) {
		platform.ready().then(() => {
			const interstitialConfig: AdMobFreeInterstitialConfig = {
				isTesting: this.testing,
				autoShow: false,
				id: "ca-app-pub-5941999908296936/7000395492"
			};

			this.admob.interstitial.config(interstitialConfig);

			this.admob.interstitial.prepare();

			this.admob
				.on(this.admob.events.INTERSTITIAL_CLOSE)
				.subscribe(() => {
					this.admob.interstitial.prepare();
				});
		});
	}

	showBanner() {
		const bannerConfig: AdMobFreeBannerConfig = {
			isTesting: this.testing,
			autoShow: true,
			id: "ca-app-pub-5941999908296936/2576374257"
		};

		this.admob.banner.config(bannerConfig);

		this.admob.banner
			.prepare()
			.then(() => {
				console.log("banner success");
			})
			.catch(error => {
				console.log(error);
			});
	}

	showInterstitial() {
		this.admob.interstitial.isReady().then(() => {
			this.admob.interstitial.show().catch(console.log);
		});
	}
}
