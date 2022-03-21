import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalFilterCategoriesPage } from './modal-filter-categories.page';

describe('ModalFilterCategoriesPage', () => {
  let component: ModalFilterCategoriesPage;
  let fixture: ComponentFixture<ModalFilterCategoriesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFilterCategoriesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFilterCategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
