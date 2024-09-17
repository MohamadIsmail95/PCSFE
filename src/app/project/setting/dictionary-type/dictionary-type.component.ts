import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../http.service';
import { DictionaryViewModel, typeList } from '../../project.const';
import {MatSelectModule} from '@angular/material/select';
import { rangeValidator } from './../../CustomValidators/rangeValidator';
import { sequenceRangeValidator } from './../../CustomValidators/sequenceRangeValidator';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-dictionary-type',
  standalone: true,
  imports: [MatCardModule,ReactiveFormsModule,MatInputModule,MatButtonModule,
    MatIconModule,MatFormFieldModule,CommonModule,MatSelectModule,MatGridListModule,MatSnackBarModule],
  templateUrl: './dictionary-type.component.html',
  styleUrl: './dictionary-type.component.scss'
})
export class DictionaryTypeComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  form: FormGroup;
  projectTypes : typeList[];
  dictionaryList : DictionaryViewModel[]=[{rangFrom:1,rangTo:5,value:50}];

  constructor(private fb: FormBuilder , private httpservice:HttpService) {

    this.form = this.fb.group({
      projectTypeId: ['', Validators.required],
      dictionaryRanges: this.fb.array([],sequenceRangeValidator()) // Initialize FormArray
    },
    { validators: rangeValidator()}
  );




  }

  ngOnInit(): void {

    this.getProjectType();

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

this.httpservice.updateDictionaryType(this.form.value).subscribe((response)=>{
  this.getDictionariesById(this.form.get('projectTypeId').value);
  this.openSnackBar('Update Dictionary Successfully','Closed')
})



}



getProjectType()
{
  this.httpservice.getTypes().subscribe((response)=>{
   this.projectTypes = response
  })
}

getDictionaries(event : any)
{
  this.httpservice.getDictionaryByTypeId(event.value).subscribe((response)=>{
    this.populateFormArray(response)

  })
}

getDictionariesById(id : number)
{
  this.httpservice.getDictionaryByTypeId(id).subscribe((response)=>{
    this.populateFormArray(response)

  })
}




// Method to convert array of objects into FormArray of FormGroups
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


openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action);
}

}

