import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { PatientService } from '../patient.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

declare let $: any;

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
	selector: 'app-patient-view',
	templateUrl: './patient-view.component.html',
	styleUrls: ['./patient-view.component.css']
})

export class PatientViewComponent implements OnInit, OnChanges {
	@Input() pid: any;
	@Input() category: any;
	@Output() alreadyVisited: EventEmitter<boolean> = new EventEmitter();
	@Output() newMessage: EventEmitter<string> = new EventEmitter();

	message: string;
	evalForm: FormGroup;

	constructor(private patients: PatientService, private route: ActivatedRoute, private formBuilder: FormBuilder) {
		this.evalForm = this.formBuilder.group({
			vmi: '',
			vp: '',
			mc: '',
			newEvaldate: ''
		});
	}

	ngOnChanges(changes) {
		this.pickCategory(changes.category.currentValue);
	}

	ngOnInit(): void {
		this.alreadyVisited.emit(false);
		sessionStorage.setItem('ActivePatient', String(this.pid));
		this.patients.loadPatient(this.pid);
	}

	evalOnSubmit({ vmi, vp, mc, newEvaldate }: { vmi: string; vp: string; mc: string; newEvaldate: string }): void {
		newEvaldate = newEvaldate ? newEvaldate : this.patients.activePatient.evaldate;
		let underThirty: Boolean = [vmi, vp, mc].every((value: string) => parseInt(value, 10) <= 30);

		if (vmi && vp && mc && underThirty)
			this.patients.uploadNewEval({
				 ...this.patients.activePatient, vmi, vp, mc, newEvaldate
			}).subscribe(
				({ message }) => this.message = message,
				(err: string) => this.newMessage.emit(err));
		else if (!vmi || !vp || !mc) {
			this.message = 'Make sure you gave a value for each category!';
		}
		else {
			this.message = 'You can not have any scores larger than 30!';
		}
	}

	pickCategory(cat: string): void {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		let index: number;

		if (cat === 'vmi') index = 0;
		if (cat === 'vp') index = 1;
		if (cat === 'mc') index = 2;

		$('#dataCarousel').carousel(index);
	}
}