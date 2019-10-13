import { Injectable } from "@angular/core";
import { Downloader } from "@ionic-native/downloader/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { File } from "@ionic-native/file/ngx";
@Injectable({
	providedIn: "root"
})
export class TimeplanService {
	constructor(
		private downloader: Downloader,
		private webview: WebView,
		private file: File
	) {}

	public async base64(week: number, width: number, height: number) {
		return new Promise<string>(async (resolve, reject) => {
			const filename = `timeplan${width}x${height}-${week}.png`;
			const dir =
				this.file.externalDataDirectory +
				"file%3A/" +
				this.file.dataDirectory.split("file:///")[1];

			const fileCached = await this.file
				.checkFile(dir, filename)
				.catch(_ => false);

			if (fileCached) {
				const path = this.webview.convertFileSrc(dir + filename);
				return resolve(path);
			}
			if (!fileCached) {
				const url =
					"http://www.novasoftware.se/" +
					"ImgGen/schedulegenerator.aspx?format=png&schoolid=60870/" +
					"nb-no&id={01D16CA5-3F31-4CA7-B678-221FC5160B4C}&period=" +
					`&width=${width}&height=${height}&week=${week}`;

				const file = await this.downloader
					.download({
						uri: url,
						destinationInExternalFilesDir: {
							dirType: this.file.dataDirectory,
							subPath: filename
						}
					})
					.catch((error: any) => reject(error));
				console.log(file);

				const path = this.webview.convertFileSrc(file as string);
				console.log(path, this.webview.convertFileSrc(dir + filename));

				return resolve(path);
			}
		});
	}
}
