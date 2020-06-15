import { Component, OnInit, Output, EventEmitter, OnChanges, Input } from '@angular/core';
import { PatientService } from '../patient.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';

interface patient {
	pid: number;
	birthdate: string;
	ageYear: number;
	ageMonth: number;
	evaldate: string;
	avatar: string;
}

@Component({
	selector: 'app-patient-list',
	templateUrl: './patient-list.component.html',
	styleUrls: ['./patient-list.component.css']
})

export class PatientListComponent implements OnInit, OnChanges {
	@Output() changeView: EventEmitter<number> = new EventEmitter();
	@Output() newMessage: EventEmitter<string> = new EventEmitter();

	@Input() mode: boolean;
	deleteMode = false;
	deletePatientPid: number;
	newPatientForm: FormGroup;
	patientDataGetters: ((patient: patient) => any)[] = [
		(patient: patient): number => patient.ageYear,
		(patient: patient): string => this.convertISOtoDate(patient.birthdate),
		(patient: patient): string => patient.evaldate ? this.convertISOtoDate(patient.evaldate) : 'First Eval Pending'
	];


	constructor(private patients: PatientService, private formBuilder: FormBuilder, private router: Router) {
		this.newPatientForm = this.formBuilder.group({ birthdate: '' });
	}

	convertISOtoDate(date: string): string {
		const monthArr: Array<string> = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		const [year, month, day]: Array<string> = date.split('-');

		return monthArr[Number(month) - 1] + ' ' + day + ', ' + year;
	}

	ngOnChanges(changes) {
		this.changeDeleteMode(changes.mode.currentValue);
	}

	ngOnInit(): void {
		sessionStorage.removeItem('ActivePatient');
		this.patients.changeActivePatient();

		this.patients.getAllPatients();
	}

	getAgeandMonth(birthdate: string): { age: number; month: number} {
		const currentDate: Date = new Date();
		const currentMonth: number = currentDate.getMonth() + 1;
		const currentDay: number = currentDate.getDate();
		const currentYear: number = currentDate.getFullYear();
		const [patientBirthYear, patientBirthMonth, patientBirthDay]: Array<string> = birthdate.split('-');

		let month: number = currentMonth - parseInt(patientBirthMonth, 10);
		let age: number = currentYear - parseInt(patientBirthYear, 10);

		if (month < 0) {
			month = 12 + month;
			age -= 1;
		}
		else if (month === 0 && currentDay < parseInt(patientBirthDay, 10)) {
			month = 11;
			age -= 1;
		}
		else if (currentDay < parseInt(patientBirthDay, 10)) {
			month -= 1;
		}

		return { age, month };
	}

	patientOnSubmit(birthdate: string): void {
		if (birthdate) {
			const { age, month } = this.getAgeandMonth(birthdate);

			if (age >= 5 && age <= 9) {
				this.patients.upsertPatient({ birthdate, age, month }).subscribe(
					({ message }) => this.newMessage.emit(message),
					(err: string) => this.newMessage.emit(err)
				);
			}
			else {
				this.newMessage.emit('Patient must be between the ages of 5 and 9.');
			}
		}
		else {
			this.newMessage.emit('Sorry, we were not able to add the patient without their birthday.');
		}
	}

	selectPatient(pid: number): void {
		setTimeout(() => this.changeView.emit(pid), 200);
	}

	deletePatient(): void {
		this.patients.deletePatient(this.deletePatientPid).subscribe(
			({ message }) => this.newMessage.emit(message),
			(err: string) => this.newMessage.emit(err));
	}

	changeDeleteMode(mode) {
		document.getElementById('minus').style.color = !mode ? '#1976d2' : 'red';
		this.deleteMode = mode;
	}
}