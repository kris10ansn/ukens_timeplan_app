import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	Router
} from "@angular/router";

import { HTTP } from "@ionic-native/http/ngx";
import { Storage } from "@ionic/storage";

@Injectable({
	providedIn: "root"
})
export class UserInfoService {
	constructor(
		private router: Router,
		private http: HTTP,
		private storage: Storage
	) {}

	public async from(webviewerUrl: string) {
		return new Promise(async (resolve, reject) => {
			let url = webviewerUrl.replace("design1.aspx", "MZDesign1.aspx");
			url = url.includes("http") ? url : "https://" + url;

			const uri = new URL(url);

			const response = await this.http
				.get(uri.href, {}, {})
				.catch(error => null);

			const doc = document.implementation.createHTMLDocument();
			const webviewer = doc.createElement("html");
			webviewer.innerHTML = response.data;

			const studentSelect = webviewer.querySelector(
				"select#ScheduleIDDropDownList"
			) as HTMLSelectElement;

			const userId =
				studentSelect.value === "0" ? null : studentSelect.value;
			const schoolId = uri.searchParams.get("schoolid");

			if (userId && schoolId) {
				await this.storage.set("userid", userId);
				await this.storage.set("schoolid", schoolId);
				await this.storage.set("webviewerUrl", webviewerUrl);

				return resolve({ userId, schoolId, webviewerUrl });
			} else {
				return reject("Info not found");
			}
		});
	}

	public async canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Promise<boolean> {
		const promise = this.isAuthenticated();

		promise.then(authenticated => {
			if (!authenticated) {
				this.router.navigate(["welcome"]);
			}
		});

		return promise;
	}

	public async isAuthenticated() {
		return new Promise<boolean>(async resolve => {
			return resolve(false);
			const userid = await this.storage.get("userid");
			const schoolid = await this.storage.get("schoolid");

			if (userid && schoolid) {
				return resolve(true);
			} else {
				return resolve(false);
			}
		});
	}

	public async userId() {
		return new Promise(async (resolve, reject) => {
			const userid = await this.storage.get("userid").catch(reject);
			userid ? resolve(userid) : reject();
		});
	}

	public async schoolId() {
		return new Promise(async (resolve, reject) => {
			const schoolid = await this.storage.get("schoolid").catch(reject);
			schoolid ? resolve(schoolid) : reject();
		});
	}

	public async webviewerUrl() {
		return new Promise(async (resolve, reject) => {
			const webviewerUrl = await this.storage
				.get("webviewerUrl")
				.catch(reject);

			webviewerUrl ? resolve(webviewerUrl) : reject();
		});
	}
}
