import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class TimeService {
	constructor() {}

	public get day() {
		return new Date().getDay();
	}

	public get week() {
		return this.getWeekNumber(new Date());
	}

	public get hours() {
		return new Date().getHours();
	}

	public get minutes() {
		return new Date().getMinutes();
	}

	public getWeekNumber(date: Date) {
		// Copy date so don't modify original
		date = new Date(
			Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
		);
		// Set to nearest Thursday: current date + 4 - current day number
		// Make Sunday's day number 7
		date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
		// Get first day of year
		const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
		// Calculate full weeks to nearest Thursday
		const weekNo = Math.ceil(
			((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
		);
		// Return array of year and week number
		return weekNo;
	}
}
