import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		redirectTo: "/tabs/today"
	},
	{
		path: "tabs",
		component: TabsPage,
		children: [
			{
				path: "today",
				loadChildren: "../pages/today/today.module#TodayPageModule"
			},
			{
				path: "main",
				loadChildren: "../pages/main/main.module#MainPageModule"
			},
			{
				path: "settings",
				loadChildren:
					"../pages/settings/settings.module#SettingsPageModule"
			},
			{
				path: "",
				redirectTo: "/tabs/today",
				pathMatch: "full"
			}
		]
	},
	{
		path: "",
		redirectTo: "/tabs/main",
		pathMatch: "full"
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TabsPageRoutingModule {}
