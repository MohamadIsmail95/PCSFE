import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMistakeComponent } from './update-mistake.component';

describe('UpdateMistakeComponent', () => {
  let component: UpdateMistakeComponent;
  let fixture: ComponentFixture<UpdateMistakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMistakeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateMistakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
