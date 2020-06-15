import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientViewComponent } from './patient-view/patient-view.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { CategoryCardComponent } from './category-card/category-card.component';

@NgModule({
	declarations: [
		AppComponent,
		PatientViewComponent,
		PatientListComponent,
		CategoryCardComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		AppRoutingModule,
		BrowserAnimationsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }