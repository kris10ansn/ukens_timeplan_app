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
		private user: UserInfoService
	) {}

	public async base64(
		week: number,
		width: number,
		height: number,
		useCache: boolean = true
	) {
		return new Promise<{
			localPath: string;
			webPath: string;
			filename: string;
		}>(async (resolve, reject) => {
			const userid = await this.user.userId();
			const schoolid = await this.user.schoolId();

			const filename = `full-timeplan${width}x${height}-${week}-${userid}-school${schoolid}.png`;
			const dir = this.file.externalCacheDirectory;

			const fileCached = await this.file
				.checkFile(dir, filename)
				.catch(_ => false);

			if (useCache && fileCached) {
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
