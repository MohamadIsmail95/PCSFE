import { HttpService } from '../../http.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import {AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, input} from '@angular/core';
import { provideRouter, Route, RouterLink } from '@angular/router';
import {MatDialog,MatDialogRef,MatDialogActions,MatDialogClose,MatDialogTitle,MatDialogContent,} from '@angular/material/dialog';
//-----------------------Modules-----------------------------------
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatGridListModule} from '@angular/material/grid-list';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DictionaryViewModel } from '../../project.const';
import { sequenceRangeValidator } from '../../CustomValidators/sequenceRangeValidator';
import { rangeValidator } from '../../CustomValidators/rangeValidator';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-dictionary',
  standalone: true,
  imports: [CommonModule,MatInputModule,MatFormFieldModule,MatCardModule,MatButtonModule,MatIconModule,
    MatProgressBarModule,MatSnackBarModule,MatGridListModule,ReactiveFormsModule
  ],
  templateUrl: './project-dictionary.component.html',
  styleUrl: './project-dictionary.component.scss'
})
export class ProjectDictionaryComponent implements OnInit
 {

  projectId:number;
  form: FormGroup;
  dictionaryList : DictionaryViewModel[]=[];

constructor( protected projservice:HttpService,private router: Router,
  private _snackBar: MatSnackBar ,private activateRoute: ActivatedRoute,
  private fb: FormBuilder
){
  this.activateRoute.params.subscribe(params => {
    this.projectId = params['id'];  });

  this.form = this.fb.group({
    projectId: [this.projectId, Validators.required],
    dictionaryRanges: this.fb.array([],sequenceRangeValidator()) // Initialize FormArray
  },
  { validators: rangeValidator()}
);
}


  ngOnInit(): void {


      this.getProjectDictionaryById();
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }


// Getter to access the FormArray controls
get dictionaryRanges(): FormArray {
  return this.form.get('dictionaryRanges') as FormArray;
}

// Create a FormGroup representing an object with 'name' and 'age'
createItem(): FormGroup {
  return this.fb.group({
    rangFrom: ['', [Validators.required, Validators.min(0)]],
    rangTo: ['', [Validators.required, Validators.min(0)]],
    value: ['', [Validators.required, Validators.min(0)]],
  },
  { validators: rangeValidator()}
);
}




// Method to add new form control in the FormArray
addItem(): void {
  this.dictionaryRanges.push(this.createItem());
}


// Method to remove a specific form control from the FormArray
removeItem(index: number): void {
  this.dictionaryRanges.removeAt(index);
}

// Submit handler to process the form
onSubmit(): void {

  this.projservice.updateDictionaryProject(this.form.value).subscribe((response)=>{
    console.log(response);
    this.populateFormArray(response);
    this.openSnackBar('Update Dictionary Successfully','Closed')
  })


}

populateFormArray(data: any[]): void {

  this.dictionaryRanges.clear(); // Clears all controls from the FormArray
  console.log(this.dictionaryRanges.value);

  let formArray = this.dictionaryRanges;

  data.forEach(item => {
    formArray.push(this.fb.group({
      rangFrom: [item.rangFrom, [Validators.required, Validators.min(0)]],
      rangTo: [item.rangTo, [Validators.required, Validators.min(0)]],
      value: [item.value, [Validators.required, Validators.min(0)]],
    },
    { validators: rangeValidator()}
  ));
  });
}



getProjectDictionaryById()
{
  this.projservice.getProjectDictionary(this.projectId).subscribe((response)=>{
   this.populateFormArray(response)
  })
}





}
