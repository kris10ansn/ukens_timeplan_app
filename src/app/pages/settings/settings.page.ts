import { Component, OnInit, NgZone } from "@angular/core";
import { File } from "@ionic-native/file/ngx";

@Component({
	selector: "app-settings",
	templateUrl: "./settings.page.html",
	styleUrls: ["./settings.page.scss"]
})
export class SettingsPage implements OnInit {
	public text = "Delete cached timeplans";
	public size = 0;

	constructor(private file: File, private zone: NgZone) {}

	public ngOnInit() {
		this.updateCacheFileSize();
	}

	private async updateCacheFileSize() {
		this.size = 0;

		const files = await this.file.listDir(
			this.file.externalDataDirectory,
			""
		);

		files.forEach((entry, index) => {
			entry.getMetadata(metadata => {
				this.size += metadata.size;
				if (index === files.length - 1) {
					this.zone.run(() => {});
				}
			});
		});
	}

	public async clearCache(event: Event) {
		const target = event.target as HTMLButtonElement;
		target.setAttribute("disabled", "");
		this.size = null;
		this.text = "Deleting cache...";
	}

	public get sizeMB() {
		return this.size != null
			? Math.round((this.size / 1000000) * 100) / 100
			: null;
	}
}
