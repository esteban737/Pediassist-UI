import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientViewComponent } from './patient-view/patient-view.component';


const routes: Routes = [
	{ path: '', component: PatientListComponent, data: { animation: 'List' } },
	// { path: 'patient-view/:pid', component: PatientViewComponent, data: { animation: 'View' } }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }