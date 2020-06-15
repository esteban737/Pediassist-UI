import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import * as io from 'socket.io-client';

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

interface patient {
	pid: number;
	birthdate: string;
	ageYear: number;
	ageMonth: number;
	evaldate: string;
	avatar: string;
}

@Injectable({
	providedIn: 'root'
})
export class PatientService {
	newMessage: EventEmitter<string> = new EventEmitter();
	connected = false;
	allPatientData: patient[];
	activePatient: fullPatient = {} as fullPatient;
	socket: SocketIOClient.Socket;

	constructor(private http: HttpClient) {
		this.socket = io('http://localhost:8080');
	}

	public getAllPatients(): void {
		const patientRequest = this.http.get('http://localhost:8080/patients/general').pipe(
			catchError((err, obs) => {
				this.connected = false;
				this.socket.on('connected', () => {
					this.newMessage.emit('Reconnecting');
					setTimeout(() => window.location.reload(false), 1000);
				});

				return throwError('It looks like the data server is not connected.');
			})
		);

		patientRequest.subscribe((patients: patient[]) => {
			this.connected = true;
			this.allPatientData = patients;
		}, (err: string) => {
			this.newMessage.emit(err);
		});

		this.socket.on('listupdate', () => {
			patientRequest.subscribe((patients: patient[]) => {
				this.allPatientData = patients;
			}, (err: string) => {
				this.newMessage.emit(err);
			});
		});
	}

	public upsertPatient(birthdateInfo: { birthdate: string; age: number; month: number }): Observable<any> {
		return this.http.post('http://localhost:8080/patients/general', birthdateInfo).pipe(
			catchError((err, obs) => {
				this.connected = false;
				this.socket.on('connected', () => {
					this.newMessage.emit('Reconnecting');
					setTimeout(() => window.location.reload(false), 1000);
				});

				return throwError('It looks like the data server is not connected.');
			})
		);
	}

	public deletePatient(pid: number): Observable<any> {
		return this.http.delete(`http://localhost:8080/patients/${pid}`).pipe(
			catchError((err, obs) => {
				this.connected = false;
				this.socket.on('connected', () => {
					this.newMessage.emit('Reconnecting');
					setTimeout(() => window.location.reload(false), 1000);
				});

				return throwError('It looks like the data server is not connected.');
			})
		);
	}

	public loadPatient(pid: number): void {
		const patientRequest = this.http.get(`http://localhost:8080/patients/${pid}`).pipe(
			catchError((err, obs) => {
				this.connected = false;
				this.socket.on('connected', () => {
					this.newMessage.emit('Reconnecting');
					setTimeout(() => window.location.reload(false), 1000);
				});

				return throwError('It looks like the data server is not connected.');
			})
		);

		patientRequest.subscribe((patient: fullPatient) => {
			this.activePatient = patient;
		}, (err: string) => {
			this.newMessage.emit(err);
		});

		this.socket.on(`${pid}-update`, () => {
			patientRequest.subscribe((patient: fullPatient) => {
				this.activePatient = patient;
			}, (err: string) => {
				this.newMessage.emit(err);
			});
		});
	}

	public uploadNewEval(patient: fullPatient & {
		vmi: string; vp: string; mc: string; newEvaldate: string;
	}): Observable<any> {
		return this.http.post(`http://localhost:8080/patients/${patient.pid}/scores`, patient).pipe(
			catchError((err, obs) => {
				this.connected = false;
				this.socket.on('connected', () => {
					this.newMessage.emit('Reconnecting');
					setTimeout(() => window.location.reload(false), 1000);
				});

				return throwError('It looks like the data server is not connected.');
			})
		);
	}

	public changeActivePatient = (patient: fullPatient = {} as fullPatient): void => {
		this.activePatient = patient;
	};
}