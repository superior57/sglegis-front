import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormControlName, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { profile } from 'app/models/auth/profile.types';
import { roles } from 'app/models/auth/roles';
import { CampoBusca } from 'app/models/base/negocio/CampoBusca';
import { AuthGuard } from 'app/services/auth/auth.guard';
import { AppConfirmService } from 'app/services/dialogs/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/services/dialogs/app-loader/app-loader.service';
import { CRUDService } from 'app/services/negocio/CRUDService/CRUDService';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.css']
})
export class UsersFormComponent implements OnInit {
  public user: FormGroup;
  roles = roles;
  profile = profile;
  customers = [];
  customers_groups = [];
  currentUser: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UsersFormComponent>,
    private loader: AppLoaderService,
    private crudService: CRUDService,
    private snackBar: MatSnackBar,
    private confirm: AppConfirmService,
    private auth: AuthGuard,
  ) { }

  ngOnInit() {
    this.currentUser = this.auth.getUser();
    this.prepareScreen(this.data.payload);
  }

  prepareScreen(record) {
    this.user = new FormGroup({
      user_id: new FormControl(record.user_id),
      user_email: new FormControl(record.user_email, [Validators.required, Validators.email]),
      user_name: new FormControl(record.user_name, [Validators.required]),
      user_profile_type: new FormControl(this.data.new ? profile.operacional : record.user_profile_type, [Validators.required]),
      user_role: new FormControl(this.data.new ? roles.client : record.user_role, [Validators.required]),
      is_disabled: new FormControl(record.is_disabled),
      customer_id: new FormControl(record.customer_id),
    });   
    
    if (this.user.value.user_role !== roles.admin) {
      this.user.controls.customer_id.setValidators([Validators.required]);
      this.getCustomers(this.currentUser.customer_id);
    }
    else {
      this.getCustomers(undefined);
    }

    this.user.controls.user_role.valueChanges.subscribe(res => {      
      if (res !== roles.admin) {
        this.user.controls.customer_id.setValidators([Validators.required]);
      } else {
        this.user.controls.customer_id.clearValidators();       
      }
      this.user.controls.customer_id.updateValueAndValidity();      
    })
    
  }

  getCustomers(customer_id) {
    let p: any = new Object();
    p.orderby = "customer_business_name";
    p.direction = "asc";

    if (customer_id) {
      p.fields = "customer_id";
      p.ops = "eq";
      p.values = customer_id;
    }
    this.crudService.GetParams(p, "/customer/query").subscribe(res => {
      this.customers = [];
      this.customers = res.body;
    })
  };

  saveUser() {
    let user = this.user.value;
    this.loader.open("Saving user");
    this.crudService.Save(user, this.data.new, "/users", user.user_id)
    .subscribe(res => {        
      this.loader.close();
      this.snackBar.open("Registro gravado com sucesso", "", { duration: 3000 });
      this.dialogRef.close();
    }, err => {
      this.loader.close();
      this.snackBar.open("Erro ao gravar registro: " + err, "", { duration: 5000 });
      this.dialogRef.close('NOK');      
    })
  }

  deleteUser() {
    let user = this.user.value;
    this.confirm.confirm("Exclusão - User", "Tem certeza que deseja excluir o User " + user.user_id).subscribe(result => {
      if (result === true) {
        this.loader.open("Excluindo - User");
        this.crudService.DeleteParams(user.user_id, "/users").subscribe(res => {
          this.snackBar.open("User excluído com sucesso!", "", { duration: 3000 });
          this.dialogRef.close("OK");
          this.loader.close();
        }, err => {
          this.loader.close();
          this.snackBar.open("Erro ao excluir User: " + err, "", { duration: 5000 });
        })
      }
    })
  }

  resetPassword() {
    let user = this.user.value;
    this.confirm.confirm("Criar nova senha", "Uma nova senha será gerada e enviada para " + user.user_email).subscribe(result => {
      if (result === true) {
        this.loader.open("Enviando email");
        this.crudService.Save(user, this.data.new, "/users/reset-password", user.user_id).subscribe(res => {
          this.loader.close()
          this.snackBar.open("A nova senha foi enviada por email!", "", { duration: 5000 });
        }, err => {
          this.loader.close();
          this.snackBar.open("Ocorreu um erro ao enviar email: " + err, "", { duration: 5000 });
        })
      }
    })
  }

  disableUser() {
    const user = {...this.user.value};
    console.log(user);
    
    user.is_disabled = user.is_disabled == 1 ? 0 : 1;
    this.confirm.confirm("Desabilitar usuário", (user.is_disabled == 1 ? ("Desabilitar usuário ") : ("Ativar usuário ")) + user.user_name + "?").subscribe(result => {
      if (result === true) {
        this.loader.open();
        this.crudService.Save(user, this.data.new, "/users", user.user_id).subscribe(res => {
          this.loader.close();
          this.user.value.is_disabled = user.is_disabled;
          this.snackBar.open("Usuário desabilitado com sucesso", "", { duration: 5000 });
        }, err => {
          this.loader.close();
          this.snackBar.open("Ocorreu um erro ao tentar desabilitar o usuário!" + err, "", { duration: 5000 });
        })
      }
    })    
  }

}
