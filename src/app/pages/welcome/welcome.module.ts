import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { WelcomePage } from "./welcome.page";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { ErrorStateMatcher } from "@angular/material/core";
import { ComponentsModule } from "src/app/components/components.module";

const routes: Routes = [
	{
		path: "",
		component: WelcomePage
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		MatInputModule,
		MatButtonModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
		ComponentsModule
	],
	providers: [ErrorStateMatcher],
	declarations: [WelcomePage]
})
export class WelcomePageModule {}
