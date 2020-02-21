import { Component, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { LinkInputComponent } from "src/app/components/link-input/link-input.component";

@Component({
	selector: "app-welcome",
	templateUrl: "./welcome.page.html",
	styleUrls: ["./welcome.page.scss"]
})
export class WelcomePage {
	@ViewChild("linkInput", { static: true })
	private linkInput: LinkInputComponent;

	constructor(private router: Router) {}

	public async doneButton() {
		const userInfo = await this.linkInput.submit().catch(error => {
			console.error(error);
			return null;
		});

		if (userInfo) {
			this.router.navigate(["/tabs"]);
		}
	}
}
