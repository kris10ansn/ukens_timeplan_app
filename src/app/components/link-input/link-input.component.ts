import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormControl, Validators, AbstractControl } from "@angular/forms";
import { UserInfoService } from "src/app/services/user-info.service";

@Component({
	selector: "app-link-input",
	templateUrl: "./link-input.component.html",
	styleUrls: ["./link-input.component.scss"]
})
export class LinkInputComponent {
	@ViewChild("linkInput", { static: true })
	public element: ElementRef;

	public pattern = new FormControl("", [
		Validators.pattern(
			/(((https)|(http))\:\/\/)?(www.)?novasoftware.se\/webviewer\/\(S\(.*\)\)\/.*/i
		)
	]);

	public processing = false;

	public processingError = false;

	constructor(private userInfo: UserInfoService) {}

	public async submit() {
		return new Promise(async (resolve, reject) => {
			this.processing = true;
			this.element.nativeElement.blur();

			const userInfo = await this.userInfo
				.from(this.element.nativeElement.value)
				.catch(e => {
					reject(null);
					return null;
				});

			if (userInfo == null) {
				this.processingError = true;
			} else {
				console.log(userInfo);
				resolve(userInfo);
			}

			this.processing = false;
		});
	}
}
