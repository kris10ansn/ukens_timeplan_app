import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { UserInfoService } from "src/app/services/user-info.service";
import { LinkInputComponent } from "src/app/components/link-input/link-input.component";
import { File } from "@ionic-native/file/ngx";

@Component({
	selector: "app-settings",
	templateUrl: "./settings.page.html",
	styleUrls: ["./settings.page.scss"]
})
export class SettingsPage implements OnInit {
	@ViewChild("linkInput", { static: true })
	private linkInput: LinkInputComponent;

	constructor(private userInfo: UserInfoService, private file: File) {}

	public async ngOnInit() {
		this.linkInput.element.nativeElement.value = await this.userInfo.webviewerUrl();
	}

	public submit() {
		this.linkInput.submit();
	}

	public async getCacheSize() {
		const dir = this.file.externalDataDirectory;
	}

	public async deleteCache() {
		const dir = this.file.externalDataDirectory;

		const files = await this.file.listDir(dir, "");

		files.forEach(async file => {
			if (file.isFile) {
				console.log(file);

				const parts = file.nativeURL.split("/");
				const filename = parts[parts.length - 1];
				const path = file.nativeURL.replace(filename, "");

				const checkFile = await this.file.checkFile(path, filename);
				console.log("Exists: ", checkFile);

				const removeFile = await this.file
					.removeFile(path, filename)
					.catch(console.log);
			}
		});
	}
}
