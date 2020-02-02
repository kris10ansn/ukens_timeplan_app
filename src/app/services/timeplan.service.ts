import { Injectable } from "@angular/core";
import { Downloader } from "@ionic-native/downloader/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { File } from "@ionic-native/file/ngx";
import { UserInfoService } from "./user-info.service";

@Injectable({
	providedIn: "root"
})
export class TimeplanService {
	constructor(
		private downloader: Downloader,
		private webview: WebView,
		private file: File,
		private userInfo: UserInfoService
	) {}

	public async base64(week: number, width: number, height: number) {
		return new Promise<{
			localPath: string;
			webPath: string;
			filename: string;
		}>(async (resolve, reject) => {
			console.log("base64 call timeplan service");
			const userid = await this.userInfo.userId();
			const schoolid = await this.userInfo.schoolId();

			const filename = `full-timeplan${width}x${height}-${week}-${userid}-school${schoolid}.png`;
			const dir = this.file.externalDataDirectory;

			const fileCached = await this.file
				.checkFile(dir, filename)
				.catch(_ => false);

			if (fileCached) {
				const localPath = dir + filename;
				const webPath = this.webview
					.convertFileSrc(localPath)
					.replace("undefined", "http://localhost");
				return resolve({ localPath, webPath, filename });
			} else {
				const url =
					"http://www.novasoftware.se/" +
					`ImgGen/schedulegenerator.aspx?format=png&schoolid=${schoolid}/` +
					`nb-no&id=${userid}&period=` +
					`&width=${width}&height=${height}&week=${week}`;

				const localPath = (await this.downloader
					.download({
						uri: url,
						destinationUri: dir + filename
					})
					.catch((error: any) => reject(error))) as string;

				console.log(localPath);

				const webPath = this.webview
					.convertFileSrc(localPath)
					.replace("undefined", "http://localhost");

				return resolve({
					localPath,
					webPath,
					filename
				});
			}
		});
	}
}
