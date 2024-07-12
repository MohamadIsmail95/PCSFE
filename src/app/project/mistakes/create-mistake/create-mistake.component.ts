import { Component, OnInit } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import { FormBuilder, FormControl, FormGroup, Validators,FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { employeeList, typeList } from '../../project.const';
import { HttpService } from '../../http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-mistake',
  standalone: true,
  imports: [MatGridListModule,MatCardModule,FormsModule,ReactiveFormsModule,MatButtonModule,MatFormFieldModule,
    MatSelectModule,CommonModule,MatInputModule
  ],
  templateUrl: './create-mistake.component.html',
  styleUrl: './create-mistake.component.scss'
})
export class CreateMistakeComponent implements OnInit{

mistakeForm: FormGroup;
employeeData:employeeList[];
typeData:typeList[];
projectId:number;

constructor(private fb:FormBuilder , protected projservice:HttpService,
  private activateRoute: ActivatedRoute,private router: Router)
{
  this.mistakeForm = this.fb.group({
   'surveyId':[''],
   'telemarketerId':['',Validators.required],
   'mistakeTypeId':['',Validators.required],
   'gsm':['',Validators.required],
   'serial':['',Validators.required],
   'questionNumber':['',Validators.required],
   'segment':['',Validators.required],
   'description':['',Validators.required],
   'wieght':['',Validators.required],
   'controllerId':['',Validators.required],
   'adminRemark':['',Validators.required],

  });
}

  ngOnInit(): void {
    this.getEmployeeList();
    this.getProjectType();
    this.activateRoute.params.subscribe(params => {
      this.projectId = params['id'];  });
  }

  onSubmit()
  {
    this.mistakeForm.get('surveyId').setValue(this.projectId);
    console.log(this.mistakeForm.value)
    this.router.navigate(['/mistakes/'+this.projectId]);

  }
  getProjectType()
  {
    this.projservice.getTypes().subscribe((res)=>{
      this.typeData=res;
    })
  }

  getEmployeeList()
  {
    this.projservice.getEmployees().subscribe((data)=>
    {
      this.employeeData=data;
    }
    )
  }
}
