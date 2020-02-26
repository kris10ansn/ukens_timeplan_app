import { Component, ViewChild, OnInit, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { LinkInputComponent } from "src/app/components/link-input/link-input.component";
import { IonSlides, Platform } from "@ionic/angular";
import { UserInfoService } from "src/app/services/user-info.service";

@Component({
	selector: "app-welcome",
	templateUrl: "./welcome.page.html",
	styleUrls: ["./welcome.page.scss"]
})
export class WelcomePage implements OnInit {
	@ViewChild("linkInput", { static: true })
	private linkInput: LinkInputComponent;

	@ViewChild("mainSlider", { static: true })
	public slides: IonSlides;

	@ViewChild("helpSlides", { static: true })
	public helpSlides: IonSlides;

	@ViewChild("helpPopup", { static: true })
	public helpPopup: ElementRef;

	constructor(private user: UserInfoService, private router: Router) {}

	public async ngOnInit() {
		this.slides.ionSlideWillChange.subscribe(async next => {
			const active = await this.slides.getActiveIndex();
			const previous = await this.slides.getPreviousIndex();

			const distance = active - previous;
			const dir = distance / Math.abs(distance);

			if (Math.abs(distance) > 1) {
				this.slides.slideTo(previous + dir);
			}
			const isAuthenticated = await this.user.isAuthenticated();
			if (active === 2) {
				this.slides.lockSwipeToNext(!isAuthenticated);
			} else {
				this.slides.lockSwipeToNext(false);
			}
		});
	}

	public async doneButton() {
		const userInfo = await this.linkInput.submit().catch(error => {
			console.error(error);
			return null;
		});

		if (userInfo) {
			this.slides.lockSwipeToNext(false);
			this.slides.slideNext();
		}
	}

	public allowButton() {
		this.router.navigate(["tabs"]);
	}

	public showHelp() {
		this.helpPopup.nativeElement.classList.remove("hidden");
		this.helpSlides.slideTo(0);
	}

	public hideHelp() {
		this.helpPopup.nativeElement.classList.add("hidden");
	}
}
