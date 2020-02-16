import { Component, OnInit } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AdMobService } from "./services/admob.service";
import { UserInfoService } from "./services/user-info.service";

@Component({
	selector: "app-root",
	templateUrl: "app.component.html",
	styleUrls: ["app.component.scss"]
})
export class AppComponent implements OnInit {
	constructor(
		private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		private adMobService: AdMobService,
		private user: UserInfoService
	) {
		this.initializeApp();
	}

	public initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleLightContent();
			this.splashScreen.hide();
		});
	}

	public async ngOnInit() {
		if (await this.user.isAuthenticated()) {
			this.adMobService.showBanner();
		} else {
			console.log("not authenticated");
		}
	}
}
