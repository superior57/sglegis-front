import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { profile } from 'app/models/auth/profile.types';
import { CampoBusca } from 'app/models/base/negocio/CampoBusca';
import { dialog } from 'app/models/size/size';
import { AuthGuard } from 'app/services/auth/auth.guard';
import { AppLoaderService } from 'app/services/dialogs/app-loader/app-loader.service';
import { CRUDService } from 'app/services/negocio/CRUDService/CRUDService';
import { unitsFormComponent } from './units-form/units-form.component';
import { unitsResponsibleFormComponent } from './units-responsible-form/units-responsible-form.component';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class unitsComponent implements OnInit {
  lastSearch: any;
  rows = [];
  
  columns = [
    {
      Propriedade: 'customer_business_name',
      Titulo: 'Matriz',
      Visivel: true,
      Largura:70
    },    
    {
      Propriedade: 'customer_unit_name',
      Titulo: 'Unidade',
      Visivel: true,
      Largura:100
    },
    {
      Propriedade: 'customer_unit_address',
      Titulo: 'Endereço',
      Visivel: true,
      Largura:70
    },        
    {
      Propriedade: 'unit_contact_name',
      Titulo: 'Nome do Contato',
      Visivel: true,
      Largura:70
    },
    {
      Propriedade: 'unit_contact_email',
      Titulo: 'Email',
      Visivel: true,
      Largura:100
    },
    {
      Propriedade: 'unit_contact_phone',
      Titulo: 'Telefone',
      Visivel: true,
      Largura:50
    }
  ]

  configSearch = [
    new CampoBusca("filter", "Grupo", 50, "", "string", null, null, null)
  ];

  currentUser: any = {};
  profile = profile;

  constructor(
    private crud: CRUDService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private auth: AuthGuard,    
  ) { }

  prepareScreen() {
    this.currentUser = this.auth.getUser();
    this.getunits(undefined);
    
  }

  openForm(info: any = {}, newRercord: Boolean) {
    let text;     
    text = (newRercord) ? "Nova Unidade" : "Editar Unidade: " + info.customer_unit_name;    
    
    let dialogRef: MatDialogRef<any> = this.dialog.open(unitsFormComponent, {
      width: '900px',
      disableClose: true,
      data: { title: text, payload: info, new: newRercord }
    });

    dialogRef.afterClosed()
    .subscribe(res => {      
      this.getunits(this.lastSearch);
      return;
    });
  }
  
  getunits(parameter: any) {
    this.lastSearch = parameter;
    this.crud.GetParams(this.lastSearch, "/customerunit").subscribe(res => {
      this.rows = [];
      this.rows = res.body;
    })
  }

  openResponsibleForm(info: any = {}) {
    let dialogRef: MatDialogRef<any> = this.dialog.open(unitsResponsibleFormComponent, {
      width: dialog.medium,
      disableClose: true,
      data: { title: "Responsáveis por Aspecto", payload: info }
    });
  }

  ngOnInit() {
    this.prepareScreen();
  }
  

}
