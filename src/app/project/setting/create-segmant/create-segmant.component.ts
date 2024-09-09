import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import {ReactiveFormsModule, FormControl} from '@angular/forms';

@Component({
  selector: 'app-create-segmant',
  standalone: true,
  imports: [MatButtonModule,MatFormFieldModule,MatCardModule,MatInputModule,FormsModule,ReactiveFormsModule],
  templateUrl: './create-segmant.component.html',
  styleUrl: './create-segmant.component.scss'
})
export class CreateSegmantComponent implements OnInit {
  segmantForm : FormGroup;

 constructor(private fb:FormBuilder){
  this.segmantForm = this.fb.group({
    'name' : ['',Validators.required]
  })
 }
  ngOnInit(): void {
  }

  onSubmit()
  {
    console.log(this.segmantForm.value);

  }


}
