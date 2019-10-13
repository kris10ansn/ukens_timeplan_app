import { Component, OnInit } from "@angular/core";
import { TimeplanService } from "src/app/services/timeplan.service";

@Component({
	selector: "app-all",
	templateUrl: "./all.page.html",
	styleUrls: ["./all.page.scss"]
})
export class AllPage implements OnInit {
	constructor(private timeplan: TimeplanService) {}

	ngOnInit() {}
}
