import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from './app.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'employee-app';
  apiData: any = [];
  employeeData: any = [];
  allData: any = [];
  // fliteredValues: any = [];
  // filteredAge: any = [];
  // filteredSalary: any = [];
  showDataInModal: any = [];
  showUpdate: boolean = false;
  showSubmit: boolean = false;
  displayAgeFilterTitle: string = 'All';
  displaySalaryFilterTitle: string = 'All';
  dialogTitle: string = '';
  dataInModal: any = [];
  isAscending: object = {
    id: true,
    employee_name: true,
    employee_salary: true,
    employee_age: true,
  };

  ageFilter = { min: '0', max: '0' };
  salaryFilter = { min: '0', max: '0' };

  searchText: string;
  closeResult = '';

  employeeForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    salary: new FormControl('', [
      Validators.required,
      Validators.min(10000),
      Validators.max(9999999),
    ]),
    age: new FormControl('', [
      Validators.required,
      Validators.min(16),
      Validators.max(150),
    ]),
  });

  get name() {
    return this.employeeForm.get('name');
  }

  get salary() {
    return this.employeeForm.get('salary');
  }

  get age() {
    return this.employeeForm.get('age');
  }

  constructor(private employee: AppService, private modalService: NgbModal) {
    this.employee.getData().subscribe((data) => {
      console.log(data);
      this.apiData = data;
      this.employeeData = this.apiData.data;
      this.allData = this.apiData.data;
      console.log('Nama: ', this.employeeData);
    });
  }

  search() {
    console.log('input: ', this.searchText);

    // debugger;
    let filt = this.allData.filter(
      (el) => this.searchText === el.employee_name.toUpperCase
    );
    console.log('filter: ', filt);

    // if (this.searchText === filter) {
    //   console.log('this.searchText: ', this.searchText);
    //   console.log('this.allData.employee_name: ', this.allData.employee_name);
    // }
  }

  filterValues() {
    this.employeeData = this.allData.filter((data) => {
      return (
        (Number(this.ageFilter.min) > 0
          ? data.employee_age >= Number(this.ageFilter.min) &&
            data.employee_age < Number(this.ageFilter.max)
          : true) &&
        (Number(this.salaryFilter.min) > 0
          ? data.employee_salary >= this.salaryFilter.min &&
            data.employee_salary < this.salaryFilter.max
          : true)
      );
    });
  }

  // FILTER BY AGE
  filterByAge(min: string, max: string) {
    this.ageFilter = { min: min, max: max };
    this.displayAgeFilterTitle = Number(min) > 0 ? `${min}-${max}` : 'All'; // Display title
    this.filterValues();
    // if (this.filteredBySalary) {
    //   let filteredVal = this.fliteredValues.filter(
    //     (el) => el.employee_age >= min && el.employee_age < max
    //   );
    //   this.displayAgeFilterTitle = `${min}-${max}`; // Display name
    //   this.employeeData = filteredVal;
    //   this.filteredByAge = true;
    // } else {
    //   let filteredVal = this.allData.filter(
    //     (el) => el.employee_age >= min && el.employee_age < max
    //   );
    //   this.displayAgeFilterTitle = `${min}-${max}`; // Display name
    //   this.fliteredValues = filteredVal;
    //   this.employeeData = filteredVal;
    //   this.filteredByAge = true;
    // }
  }

  // FILTER BY SALARY
  filterBySalary(min: string, max: string) {
    this.salaryFilter = { min: min, max: max };
    this.displaySalaryFilterTitle = Number(min) > 0 ? `${min}-${max}` : 'All'; // Display title
    this.filterValues();
    // if (this.filteredByAge) {
    //   let filteredVal = this.fliteredValues.filter(
    //     (el) => el.employee_salary >= min && el.employee_salary < max
    //   );
    //   this.displaySalaryFilterTitle = `${min}-${max}`; // Display name
    //   this.employeeData = filteredVal;
    //   this.filteredBySalary = true;
    // } else {
    //   let filteredVal = this.allData.filter(
    //     (el) => el.employee_salary >= min && el.employee_salary < max
    //   );
    //   this.displaySalaryFilterTitle = `${min}-${max}`; // Display name
    //   this.fliteredValues = filteredVal;
    //   this.employeeData = filteredVal;
    //   this.filteredBySalary = true;
    // }
  }

  // SORTING STARTS HERE
  ascendingOrder(field: string) {
    this.isAscending = {
      id: true,
      employee_name: true,
      employee_salary: true,
      employee_age: true,
    };
    this.isAscending[field] = false;
    this.employeeData = this.employeeData.sort((x, y) => {
      if (x[field] > y[field]) {
        return 1;
      }
      if (x[field] < y[field]) {
        return -1;
      }
      return 0;
    });
  }

  descendingOrder(field: string) {
    this.isAscending[field] = true;
    this.employeeData = this.employeeData.sort((x, y) => {
      if (x[field] < y[field]) {
        return 1;
      }
      if (x[field] > y[field]) {
        return -1;
      }
      return 0;
    });
  }

  sortData(field: string) {
    this.isAscending[field]
      ? this.ascendingOrder(field)
      : this.descendingOrder(field);
  }
  // SORTING ENDS HERE

  // MODAL STARTS HERE //
  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  // MODAL ENDS HERE //

  // OPEN MODAL ON ADD EMPLOYEE BUTTON
  onAddEmployee(content) {
    this.showSubmit = true;
    this.showUpdate = false;
    this.dialogTitle = 'Add Employee';
    this.open(content);
    this.employeeForm.reset();
  }

  // ADD EMPLOYEE ON SUBMIT BUTTON
  onSubmit() {
    console.log('Enter Value: ', this.employeeForm.value);

    this.employee
      .postData(
        this.employeeForm.value.name,
        this.employeeForm.value.age,
        this.employeeForm.value.salary
      )
      .subscribe(
        (data) => {
          this.employeeData.push({
            // id: Math.floor(Math.random() * 1000),
            name: this.employeeForm.value.name,
            salary: this.employeeForm.value.salary,
            age: this.employeeForm.value.age,
          });
          // this.postId = data.id;
        },
        (error) => {
          console.log(error);
          // this.employeeData.push({
          //   id: Math.floor(Math.random() * 1000),
          //   employee_name: this.employeeForm.value.name,
          //   employee_salary: this.employeeForm.value.salary,
          //   employee_age: this.employeeForm.value.age,
          // });
        }
      );
    this.modalService.dismissAll();
  }

  // DELETE EMPLOYEE
  onDelete(id: any) {
    if (window.confirm('Are you sure you want to delete?')) {
      this.employee.deleteData(id).subscribe((data) => {
        let del = this.employeeData.filter((el) => el.id !== id);
        this.employeeData = del;

        // this.employeeData.splice(index, 1);
      });
    }
  }

  // OPENS MODAL ON EDIT BUTTON
  onEdit(id: any, content) {
    this.open(content);
    this.showSubmit = false;
    this.showUpdate = true;
    this.dialogTitle = 'Update Employee';
    this.employeeForm.reset();
    this.employee.editData(id).subscribe((data) => {
      console.log('DATAAA: ', data);
      this.showDataInModal = data;
      this.dataInModal = this.showDataInModal.data;
      console.log('dataInModal: ', this.dataInModal);
      this.employeeForm.controls['name'].setValue(
        this.dataInModal.employee_name
      );
      this.employeeForm.controls['salary'].setValue(
        this.dataInModal.employee_salary
      );
      this.employeeForm.controls['age'].setValue(this.dataInModal.employee_age);
    });
  }

  // UPDATE EMPLOYEE
  onUpdate() {
    this.employee
      .updateData(
        this.dataInModal.id,
        this.employeeForm.value.name,
        this.employeeForm.value.age,
        this.employeeForm.value.salary
      )
      .subscribe((data) => {
        console.log('Updated Data: ', data);
        this.employeeForm.reset();
      });
    this.modalService.dismissAll();
  }
}
