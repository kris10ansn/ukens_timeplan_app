import { Component, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { UserInfoService } from "src/app/services/user-info.service";
import { FormControl, Validators } from "@angular/forms";
import { LinkInputComponent } from "src/app/components/link-input/link-input.component";

@Component({
	selector: "app-welcome",
	templateUrl: "./welcome.page.html",
	styleUrls: ["./welcome.page.scss"]
})
export class WelcomePage {
	@ViewChild("linkInput", { static: true })
	private linkInput: LinkInputComponent;

	public processing = false;

	constructor(private router: Router, private userInfo: UserInfoService) {}

	public async doneButton() {
		const userInfo = await this.linkInput.submit().catch(error => null);

		if (userInfo) {
			this.router.navigate(["/tabs"]);
		}
	}
}
