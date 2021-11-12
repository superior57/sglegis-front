import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';
import { profile } from 'app/models/auth/profile.types';
import { roles } from 'app/models/auth/roles';
import { AuthGuard } from 'app/services/auth/auth.guard';
import { AppConfirmService } from 'app/services/dialogs/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/services/dialogs/app-loader/app-loader.service';
import { CRUDService } from 'app/services/negocio/CRUDService/CRUDService';
import { CustomerGroupFormComponent } from '../../customer-groups/customer-group-form/customer-group-form.component';
import { CustomersFormsComponent } from '../../customers/customers-forms/customers-forms.component';

@Component({
  selector: 'app-units-form',
  templateUrl: './units-form.component.html',
  styleUrls: ['./units-form.component.css']
})
export class unitsFormComponent implements OnInit {
  public unitForm: FormGroup;
  customers_groups = [];
  customers = [];
  states = [];
  cities = [];
  areas = [];
  aspects = [];
  areasWithAspects = [];
  currentUser: any;
  roles = roles;
  profile = profile;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CustomersFormsComponent>,
    private loader: AppLoaderService,
    private crudService: CRUDService,
    private snackBar: MatSnackBar,
    private confirm: AppConfirmService,
    public dialog: MatDialog,
    private auth: AuthGuard
  ) { }

  prepareScreen(record) {
    this.unitForm = new FormGroup({
      customer_unit_id: new FormControl(record.customer_unit_id),
      customer_unit_cnpj: new FormControl(record.customer_unit_cnpj, []),
      customer_unit_name: new FormControl(record.customer_unit_name, [Validators.required, Validators.maxLength(50), Validators.minLength(3)]),
      customer_unit_address: new FormControl(record.customer_unit_address, []),
      customer_unit_city_id: new FormControl(record.customer_unit_city_id, []),
      customer_unit_uf_id: new FormControl(record.customer_unit_uf_id, []),
      customer_unit_cep: new FormControl(record.customer_unit_cep, []),
      customer_group_id: new FormControl(this.currentUser.role === roles.admin ? record.customer_group_id : this.currentUser.customer_group_id, [Validators.required]),
      customer_id: new FormControl(record.customer_id, [Validators.required]),
      unit_contact_name: new FormControl(record.unit_contact_name, [Validators.required]),
      unit_contact_email: new FormControl(record.unit_contact_email, [Validators.required, Validators.email]),
      unit_contact_phone: new FormControl(record.unit_contact_phone, [Validators.required]),
      unit_contact_observation: new FormControl(record.unit_contact_observation)
    });
    this.getGroups();
    this.getStates();

    if (this.currentUser.role !== roles.admin) {
      this.getCustomers(this.currentUser.customer_group_id);
    }

    this.unitForm.controls.customer_group_id.valueChanges.subscribe(res => {
      this.getCustomers(res);
    });
    
    if (!this.data.new) {      
      this.getCustomers(this.unitForm.controls.customer_group_id.value);
      this.getCep();
      this.getCities();
    }

    this.getAreasWithAspects(record.customer_unit_id);
  }

  getAreasWithAspects(unit_id) {
    this.crudService.GetParams(undefined, `/customerunit/${unit_id||"0"}/aspects`).subscribe(asps => {
      if (asps.status == 200) {
        this.areasWithAspects = [];
        this.areasWithAspects = asps.body;
      }
    });
  }

  toggleAll(arearWithAspect, evento) {
    for (let i = 0; i < arearWithAspect.aspects.length; i++) {
      arearWithAspect.aspects[i].checked = (evento.checked) ? "S" : "N";
    }
  }

  toggle(aspect, evento) {
    aspect.checked = (evento.checked) ? "S" : "N";
  }


  newGroupForm() {
    let dialogRef: MatDialogRef<any> = this.dialog.open(CustomerGroupFormComponent, {
      width: '720px',
      disableClose: true,
      data: { title: "Novo Grupo de Cliente", payload: "", new: true }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (res == "OK") {
          this.getGroups();
        }
        return;
      });
  }

  newCustomerForm() {
    let dialogRef: MatDialogRef<any> = this.dialog.open(CustomersFormsComponent, {
      width: '720px',
      disableClose: true,
      data: { title: "Nova Matriz", payload: "", new: true }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (res == "OK") {
          this.getCustomers(0);
        }
        return;
      });
  }

  deleteunit() {

  }

  saveunit() {
    let form = this.unitForm.value;
    this.loader.open();
    this.crudService.Save(form, this.data.new, "/customerunit", form.customer_unit_id).subscribe(res => {
      if (res.status == 200) {
        this.loader.close();
        this.saveAreasAspects(res.body.customer_unit_id || form.customer_unit_id).then(r => {
          this.snackBar.open("Registro gravado com sucesso", "", { duration: 3000 });
          this.dialogRef.close('OK');
        })

      } else {
        this.loader.close();
        this.snackBar.open("Erro ao gravar registro:" + res.Message, "", { duration: 5000 });
        this.dialogRef.close('NOK');
      }
    });
  }

  async saveAreasAspects(unit_id) {
    for (let i = 0; i < this.areasWithAspects.length; i++) {
      for (let j = 0; j < this.areasWithAspects[i].aspects.length; j++) {
        if (this.areasWithAspects[i].aspects[j].checked != this.areasWithAspects[i].aspects[j].previous) {
          if (this.areasWithAspects[i].aspects[j].checked == "S") {
            let o: any = new Object();
            o.area_id = this.areasWithAspects[i].area_id;
            o.area_aspect_id = this.areasWithAspects[i].aspects[j].area_aspect_id;
            o.customer_unit_id = unit_id;
            let resp = await this.crudService.Save(o, true, `/customerunit/${unit_id}/aspects`, "0").toPromise();
            console.log("res ins:" + resp);
          } else {
            let resp = await this.crudService.DeleteParams(this.areasWithAspects[i].aspects[j].unit_area_aspect_id, `/customerunit/${unit_id}/aspects`).toPromise();
            console.log("res del:"+ resp);
          }
        }
      }
    }

  }

  getCep() {    
    let cep = this.unitForm.controls.customer_unit_cep.value;
    //this.loader.open();
    this.crudService.GetParams(undefined, "/cep/" + cep).subscribe(res => {
      //this.loader.close();

      if (res.status == 200 && res.body.length > 0) {
        this.unitForm.controls.customer_unit_address.setValue(res.body[0].street_name);
        
        this.unitForm.controls.customer_unit_uf_id.setValue(res.body[0].state_id);
        let p: any = new Object();
        p.state_id = res.body[0].state_id;
        p.orderby = "city_name";
        p.direction = "asc";
        this.crudService.GetParams(p, "/city").subscribe(c => {
          if (c.status == 200) {
            this.cities = [];
            this.cities = c.body;
            
            this.unitForm.controls.customer_unit_city_id.setValue(res.body[0].city_id);
          }
        });
      }
    });
  }

  getGroups() {
    if (this.currentUser.role === roles.admin) {
      let p: any = new Object();
      p.orderby = "customer_group_name";
      p.direction = "asc";
      this.crudService.GetParams(p, "/customergroup").subscribe(res => {
        this.customers_groups = [];
        this.customers_groups = res.body;
      });
    } else {
      this.customers_groups = [];
      this.customers_groups.push({
        customer_group_id: this.currentUser.customer_group_id,
        customer_group_name: this.currentUser.customer_group_name
      })
    }
  }

  getCustomers(group_id) {
    
    if (group_id != 0) {
      let p: any = new Object();
      p.orderby = "customer_business_name";
      p.direction = "asc";
      p.fields = "customer_group_id";
      p.ops = "eq";
      p.values = group_id;
      this.crudService.GetParams(p, "/customer/query").subscribe(res => {
        this.customers = [];
        this.customers = res.body;
      });
    } else {
      let p: any = new Object();
      p.orderby = "customer_business_name";
      p.direction = "asc";
      p.field = "customer_group_id"
      this.crudService.GetParams(p, "/customer").subscribe(res => {
        this.customers = [];
        this.customers = res.body;
      });
    }
  }

  getStates() {
    this.crudService.GetParams(undefined, "/state").subscribe(s => {
      if (s.status == 200) {
        this.states = [];
        this.states = s.body.sort((a, b) => { return a.state_name.localeCompare(b.state_name); });
      }
    });
  }

  getCities() {
    const state_id = this.unitForm.controls.customer_unit_uf_id.value;    
    let p: any = new Object();
    p.state_id = state_id;
    p.orderby = "city_name";
    p.direction = "asc";
    this.crudService.GetParams(p, "/city").subscribe(c => {
      if (c.status == 200) {
        this.cities = [];
        this.cities = c.body;
      }
    });
  }

  ngOnInit() {
    this.currentUser = this.auth.getUser();
    this.prepareScreen(this.data.payload);
  }
}
