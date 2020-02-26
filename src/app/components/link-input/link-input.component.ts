import {
	Component,
	OnInit,
	ViewChild,
	ElementRef,
	Input,
	AfterViewInit
} from "@angular/core";
import { FormControl, Validators, AbstractControl } from "@angular/forms";
import { UserInfoService } from "src/app/services/user-info.service";
import { MatFormField } from "@angular/material/form-field";

@Component({
	selector: "app-link-input",
	templateUrl: "./link-input.component.html",
	styleUrls: ["./link-input.component.scss"]
})
export class LinkInputComponent implements AfterViewInit {
	@ViewChild("linkInput", { static: true })
	public element: ElementRef;

	@ViewChild(MatFormField, { static: false })
	public formField: MatFormField;

	@Input()
	private alignCenter = false;

	public pattern = new FormControl("", [
		Validators.required,
		Validators.pattern(
			/(((https)|(http))\:\/\/)?(www.)?novasoftware.se\/webviewer\/\(S\(.*\)\)\/.*(?=.*(schoolid\=))(?=.*(\&|\?)(id\=)).*/i
		)
	]);

	public processing = false;

	public processingError = false;

	constructor(private userInfo: UserInfoService) {}

	public ngAfterViewInit() {
		if (this.alignCenter) {
			const { nativeElement } = this.formField._elementRef;
			nativeElement.classList.add("align-center");
		}
	}

	public async submit() {
		return new Promise(async (resolve, reject) => {
			this.processing = true;
			this.element.nativeElement.blur();

			const userInfo = await this.userInfo
				.from(this.element.nativeElement.value)
				.catch(e => {
					reject(e);
					return null;
				});

			if (userInfo == null) {
				this.processingError = true;
			} else {
				return resolve(userInfo);
			}
		});
	}
}
