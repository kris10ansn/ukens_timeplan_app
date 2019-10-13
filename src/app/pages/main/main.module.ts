import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { PinchZoomModule } from "ngx-pinch-zoom";

import { IonicModule } from "@ionic/angular";

import { MainPage } from "./main.page";

const routes: Routes = [
	{
		path: "",
		component: MainPage
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		PinchZoomModule,
		RouterModule.forChild(routes)
	],
	declarations: [MainPage]
})
export class MainPageModule {}
