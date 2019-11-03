import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { SettingsPage } from "./settings.page";
import { MatInputModule } from "@angular/material/input";

const routes: Routes = [
	{
		path: "",
		component: SettingsPage
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		MatInputModule,
		RouterModule.forChild(routes)
	],
	declarations: [SettingsPage]
})
export class SettingsPageModule {}
