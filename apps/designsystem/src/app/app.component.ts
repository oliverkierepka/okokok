import { Component } from '@angular/core';

@Component({
	selector: 'rh-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'designsystem';

	public logMessage(messageFromButton: string) {
		console.log(messageFromButton);
	}
}
