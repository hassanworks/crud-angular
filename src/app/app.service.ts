import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  getData() {
    let url = 'http://dummy.restapiexample.com/api/v1/employees';
    return this.http.get(url);
  }

  postData(name, age, salary) {
    let url = 'http://dummy.restapiexample.com/api/v1/create';
    return this.http.post(url, {
      employee_age: age,
      employee_name: name,
      employee_salary: salary,
    });
  }

  deleteData(id: number) {
    let delUrl = 'http://dummy.restapiexample.com/api/v1/delete';
    const url = `${delUrl}/${id}`; // DELETE api/heroes/42
    return this.http.delete(url);
    // .pipe(catchError(this.handleError('deleteHero')));
  }

  editData(id: number) {
    let gerUrl = 'http://dummy.restapiexample.com/api/v1/employee';
    let url = `${gerUrl}/${id}`;
    return this.http.get(url);
  }

  updateData(id: number, name, age, salary) {
    let updateUrl = 'http://dummy.restapiexample.com/api/v1/update';
    const url = `${updateUrl}/${id}`;
    return this.http.put(url, {
      employee_age: age,
      employee_name: name,
      employee_salary: salary,
    });
  }
}
