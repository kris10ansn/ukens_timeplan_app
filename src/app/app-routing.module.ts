import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { UserInfoService } from "./services/user-info.service";

const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		redirectTo: "tabs"
	},
	{
		path: "tabs",
		loadChildren: "./tabs/tabs.module#TabsPageModule",
		canActivate: [UserInfoService]
	},
	{
		path: "welcome",
		loadChildren: "./pages/welcome/welcome.module#WelcomePageModule"
	},
  { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule' }
];
@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule {}
