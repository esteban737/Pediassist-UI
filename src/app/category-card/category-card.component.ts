import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-category-card',
	templateUrl: './category-card.component.html',
	styleUrls: ['./category-card.component.css']
})
export class CategoryCardComponent implements OnInit {
	@Input() categoryData: any;
	stickyNoteStyles: { hori: string; vert: string; angle: string; color: string }[];

	constructor() {

	}

	ngOnInit() {
		const marginSizes: string[] = Array.from(
			new Array(7), (x, i) => i - 3).map(
			(size: number): string => String(size) + 'vh');

		const angleSizes: string[] = Array.from(
			new Array(5), (x, i) => i - 2).map(
			(size: number): string => String(size) + 'deg');

		this.stickyNoteStyles = ['#ff7455', '#1ba8b1', '#fffeaa', '#ff0079', '#dcff46', '#f12840'].map((cardColor: string): {
			hori: string; vert: string; angle: string; color: string;
		} => {
			const randomMarginLeft = marginSizes[Math.floor(Math.random() * marginSizes.length)];
			const randomMarginBottom = marginSizes[Math.floor(Math.random() * marginSizes.length)];
			const randomAngle = angleSizes[Math.floor(Math.random() * angleSizes.length)];

			return {
				hori: randomMarginLeft,
				vert: randomMarginBottom,
				angle: randomAngle,
				color: cardColor
			};
		});
	}
}