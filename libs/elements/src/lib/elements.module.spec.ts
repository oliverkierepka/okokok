import { async, TestBed } from '@angular/core/testing';
import { ElementsModule } from './elements.module';

describe('ElementsModule', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ElementsModule],
		}).compileComponents();
	}));

	// TODO: Add real tests here.
	//
	// NB: This particular test does not do anything useful.
	//     It does NOT check for correct instantiation of the module.
	it('should have a module definition', () => {
		expect(ElementsModule).toBeDefined();
	});
});
