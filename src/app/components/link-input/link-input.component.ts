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
		Validators.required,
		Validators.pattern(
			/(((https)|(http))\:\/\/)?(www.)?novasoftware.se\/webviewer\/\(S\(.*\)\)\/.*(?=.*(schoolid\=))(?=.*(\&|\?)(id\=)).*/i
		)
	]);

	public processing = false;

	public processingError = false;

	constructor(private userInfo: UserInfoService) {}

	public async submit() {
		return new Promise(async (resolve, reject) => {
			this.processing = true;
			this.element.nativeElement.blur();

			console.log(this.element.nativeElement.value);

			const userInfo = await this.userInfo
				.from(this.element.nativeElement.value)
				.catch(e => {
					reject(e);
					return null;
				});

			if (userInfo == null) {
				this.processingError = true;
			} else {
				console.log(userInfo);
				resolve(userInfo);
			}
		});
	}
}
