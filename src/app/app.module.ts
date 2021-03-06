import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { Downloader } from "@ionic-native/downloader/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { File } from "@ionic-native/file/ngx";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { IonicStorageModule } from "@ionic/storage";

import { MatInputModule } from "@angular/material/input";

import { HTTP } from "@ionic-native/http/ngx";
import { AdMobFree } from "@ionic-native/admob-free/ngx";

@NgModule({
	declarations: [AppComponent],
	entryComponents: [],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		IonicStorageModule.forRoot(),
		AppRoutingModule,
		BrowserAnimationsModule
	],
	providers: [
		StatusBar,
		SplashScreen,
		Downloader,
		WebView,
		File,
		AdMobFree,
		HTTP,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
