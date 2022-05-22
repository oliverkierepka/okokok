import { Component } from '@angular/core';

@Component({
	selector: 'ok-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'designsystem';

	public logMessage(messageFromButton: any) {
		console.log(messageFromButton);
	}
}
