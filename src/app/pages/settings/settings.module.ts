import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { SettingsPage } from "./settings.page";
import { LinkInputComponent } from "src/app/components/link-input/link-input.component";
import { ComponentsModule } from "src/app/components/components.module";

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
		RouterModule.forChild(routes),
		ComponentsModule
	],
	declarations: [SettingsPage]
})
export class SettingsPageModule {}
