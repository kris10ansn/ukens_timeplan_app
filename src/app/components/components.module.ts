import { NgModule } from "@angular/core";
import { LinkInputComponent } from "./link-input/link-input.component";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
	imports: [CommonModule, MatInputModule, ReactiveFormsModule, FormsModule],
	declarations: [LinkInputComponent],
	exports: [LinkInputComponent]
})
export class ComponentsModule {}
