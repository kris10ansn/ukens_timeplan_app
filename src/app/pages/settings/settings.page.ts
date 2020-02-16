import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { UserInfoService } from "src/app/services/user-info.service";
import { LinkInputComponent } from "src/app/components/link-input/link-input.component";
import { File } from "@ionic-native/file/ngx";
import { ToastController } from "@ionic/angular";
import { Location } from "@angular/common";
import { AdMobService } from "src/app/services/admob.service";

@Component({
	selector: "app-settings",
	templateUrl: "./settings.page.html",
	styleUrls: ["./settings.page.scss"]
})
export class SettingsPage implements OnInit {
	@ViewChild("linkInput", { static: true })
	private linkInput: LinkInputComponent;

	constructor(
		private user: UserInfoService,
		private file: File,
		private toastController: ToastController,
		private adMob: AdMobService
	) {}

	public async ngOnInit() {
		this.linkInput.element.nativeElement.value = await this.user.webviewerUrl();
	}

	public submit() {
		this.linkInput.submit().then(() => {
			this.deleteCache(false);
			this.adMob.showInterstitial();
		});
	}

	public async getCacheSize() {
		const dir = this.file.externalCacheDirectory;
	}

	public async deleteCache(showToast = true) {
		const dir = this.file.externalCacheDirectory;

		const files = await this.file.listDir(dir, "");
		const promises = [];
		let size = 0;
		let filesDeleted = 0;

		files.forEach(async file => {
			if (file.isFile) {
				const deletion = this.file
					.removeFile(this.file.externalCacheDirectory, file.name)
					.then(() => {
						filesDeleted++;
					})
					.catch(console.error);

				const metadata = new Promise(resolve => {
					file.getMetadata(meta => {
						size += meta.size;
						resolve();
					});
				});

				promises.push(deletion);
				promises.push(metadata);
			}
		});

		await Promise.all(promises);

		if (showToast) {
			const toast = await this.toastController.create({
				message: `Slettet ${filesDeleted} filer (${Math.round(
					size / 1000
				)} kB)`,
				duration: 2500,
				showCloseButton: true,
				closeButtonText: "Lukk"
			});

			toast.present();
		}

		this.adMob.showInterstitial();
	}
}
