import { Component, OnInit } from '@angular/core';
import { PatientService } from './patient.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
interface dataPoints {
	rawScore: string;
	ageEquivalent: string;
	standardScore: string;
	level: string;
	percentile: string;
	scaledScore: string;
}

interface fullPatient {
	pid: number;
	birthdate: string;
	ageYear: number;
	ageMonth: number;
	evaldate: string;
	avatar: string;
	rawData: string;
	standardData: string;
	vmiData: dataPoints;
	vpData: dataPoints;
	mcData: dataPoints;
}
@Component({
	selector: 'app-root',
	animations: [
		trigger(
			'parent', [
				transition('* => *', [
				])
			]
		),
		trigger('simpleFadeAnimation', [
			transition(':enter', [
				style({ opacity: 1 }),
				animate('200ms', style({ transform: 'translateX(0)', opacity: 0 }))
			]),
			transition(':leave', [
				style({ transform: 'translateX(0)', opacity: 1 }),
				animate('200ms', style({ transform: 'translateX(100%)', opacity: 0 }))
			])
		]),
		trigger(
			'iconFadeInOut', [
				transition(':enter', [
					style({ transform: 'translateX(100%)', opacity: 0 }),
					animate('800ms', style({ transform: 'translateX(0)', opacity: 1 }))
				]),
				transition(':leave', [
					style({ transform: 'translateX(0)', opacity: 1 }),
					animate('800ms', style({ transform: 'translateX(100%)', opacity: 0 }))
				])
			]
		),
		trigger(
			'listToolbarTransfer', [
				transition(':enter', [
					style({ transform: 'translateX(-100%)', opacity: 0 }),
					animate('800ms', style({ transform: 'translateX(0)', opacity: 1 }))
				]),
				transition(':leave', [
					style({ transform: 'translateX(0)', opacity: 0 }),
					animate('800ms', style({ transform: 'translateX(-100%)', opacity: 1 }))
				])
			]
		),
		trigger(
			'viewToolbarTransfer', [
				transition(':enter', [
					style({ transform: 'translateX(100%)', opacity: 0 }),
					animate('800ms', style({ transform: 'translateX(0%)', opacity: 1 }))
				]),
				transition(':leave', [
					style({ transform: 'translateX(0)', opacity: 0 }),
					animate('800ms', style({ transform: 'translateX(100%)', opacity: 1 }))
				])
			]
		)
	],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	message = null;
	alreadyVisited = false;
	patientId = null;
	visibleCategory = 'vmi';
	deleteMode = false;
	patientDataLabels: string[] = ['Age', 'Birthday', 'Last Eval Date'];
	activePatient: fullPatient = {} as fullPatient ;
	stickyNoteStyles: { angle: string; color: string }[];

	constructor(private patients: PatientService, private router: Router) {}

	ngOnInit() {
		const storedPatient = sessionStorage.getItem('ActivePatient');

		if (storedPatient) {
			this.alreadyVisited = true;
			this.patientId = JSON.parse(storedPatient);
			sessionStorage.removeItem('ActivePatient');
		}

		const angleSizes: string[] = Array.from(
			new Array(5), (x, i) => i - 2).map(
			(size: number): string => String(size) + 'deg');


		this.stickyNoteStyles = ['#ff7455', '#1ba8b1', '#fffeaa', '#ff0079', '#dcff46', '#f12840'].map((cardColor: string): {
			angle: string; color: string;
		} => {
			const randomAngle = angleSizes[Math.floor(Math.random() * angleSizes.length)];

			return {
				angle: randomAngle,
				color: cardColor
			};
		});

		this.patients.getAllPatients();
		this.patients.newMessage.subscribe((message: string) => this.message = message);
	}

	selectPatient(pid: number) {
		this.patientId = pid;
		this.message = null;
	}

	goBack() {
		this.patientId = null;
		this.visibleCategory = 'vmi';
		this.deleteMode = false;
	}
}