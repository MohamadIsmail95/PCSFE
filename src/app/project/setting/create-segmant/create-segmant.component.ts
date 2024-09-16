import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import {ReactiveFormsModule, FormControl} from '@angular/forms';
import { HttpService } from '../../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-segmant',
  standalone: true,
  imports: [MatButtonModule,MatFormFieldModule,MatCardModule,MatInputModule,FormsModule,ReactiveFormsModule],
  templateUrl: './create-segmant.component.html',
  styleUrl: './create-segmant.component.scss'
})
export class CreateSegmantComponent implements OnInit {
  segmantForm : FormGroup;

 constructor(private fb:FormBuilder , private httpService:HttpService ,private router: Router){
  this.segmantForm = this.fb.group({
    'name' : ['',Validators.required]
  })
 }
  ngOnInit(): void {
  }

  onSubmit()
  {
    this.httpService.CreateSegmant(this.segmantForm.value).subscribe((response)=>{
      this.router.navigate(['/setting/segmants']);

    })

  }


}
