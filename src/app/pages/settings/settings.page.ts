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

		const files = this.file.listDir(dir, "");

		// tslint:disable-next-line: forin
		for (const file in files) {
			console.log(file);
		}

		this.file.removeRecursively(dir, "");
	}
}
