import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { profile } from 'app/models/auth/profile.types';
import { CampoBusca } from 'app/models/base/negocio/CampoBusca';
import { AuthGuard } from 'app/services/auth/auth.guard';
import { AppLoaderService } from 'app/services/dialogs/app-loader/app-loader.service';
import { CRUDService } from 'app/services/negocio/CRUDService/CRUDService';
import { AreasFormComponent } from '../areas/areas-form/areas-form.component';
import { DocumentsFormComponent } from './documents-form/documents-form.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit  {

  lastSearch: any;
  rows = [];
  configSearch: any = [];
  
  columns = [
    { Propriedade: 'concat_type_number',Titulo: 'Documento',Visivel: true,Largura:100 },    
    { Propriedade: 'document_date',Titulo: 'Data',Visivel: true,Largura: 80,Tipo: "DATA" },
    { Propriedade: 'document_scope_description',Titulo: 'Âmbito',Visivel: true,Largura:10 },
    { Propriedade: 'document_summary',Titulo: 'Ementa',Visivel: true,Largura: 300 },
    { Propriedade: 'status_description',Titulo: 'Status',Visivel: true,Largura:10 },
  ]

  profile = profile;
  currentUser: any = {};
  syncInit = false;

  showState: boolean = false;
  showCity: boolean = false;
  states = [];
  cities = [];
  selected_scope_id: 0;
  selected_state_id: 0;

  constructor(
    private crud: CRUDService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,    
    private auth: AuthGuard,
    private crudService: CRUDService,
  ) { }

  prepareScreen() {  
    this.setConfigSearch();
    this.getDocuments(undefined);
  }

  onFilterValueChange(type: string, value: any) {

    if (type === 'state_id') {
      this.selected_state_id = value;
      this.handleScope(this.selected_scope_id);
    }

    if (type === 'document_scope_id') {
      this.selected_scope_id = value;
      this. handleScope(this.selected_scope_id);
    }
  }

  handleScope(value) {
    switch (value) {
      case 3: //ESTADUAL
        this.showStates();
        this.hideCity();
        break;
      case 4: //MUNICIPAL
        this.showStates();
        if (this.selected_state_id > 0)
          this.showCities(this.selected_state_id);
        else
          this.hideCity();
      default: //GLOBAL or FEDERAL
        this.hideState();
        this.hideCity();
        break;
    }
  }

  hideState() {
    this.showState = false;
    this.states = [];
  }

  hideCity() {
    this.showCity = false;
    this.cities = [];
  }

  showStates() {
    this.showState = true;

    this.crudService.GetParams({ "orderby": "state_name", "direction": "asc" }, "/state").subscribe(res => {
      if (res.status == 200) {
        let states = [];
        states = res.body.map(s => {
          return{
            ...s,
            document_state_id: s.state_id,
            document_state_name: s.state_name,
          };
        });

        this.configSearch[1].lista = states;
        this.syncInit = true;
      }
    });
  };

  showCities(stateId) {
    this.showCity = true;

    if (stateId){
      let p: any = new Object();
      p.orderby = "city_name";
      p.direction = "asc";
      p.state_id = stateId;
      if (this.showCity) {
        this.crudService.GetParams(p, "/city").subscribe(res => {
          if (res.status == 200) {
            let cities = res.body;
            // const newArr = res.body;
            // newArr.forEach(c => {
            //   this.cities.push({
            //     ...c,
            //     document_state_id: c.state_id,
            //     document_state_name: c.state_name,

            //     document_city_id: c.city_id,
            //     document_city_name: c.city_name
            //   })
            // });

            this.configSearch[2].lista = cities;
            this.syncInit = true;
          }
        });
      }
    };
  }

  async setConfigSearch() {
    let scopes = await this.getAuditRequirementscopes();

    let aux = [
      new CampoBusca("document_scope_id", "Âmbito", 50, "", "LIST", scopes, "document_scope_description", "document_scope_id"),
      new CampoBusca("state_id", "Estado", 50, "", "LIST", [], "state_name", "state_id"),
      new CampoBusca("city_id", "Cidade", 50, "", "LIST", [], "city_name", "city_id"),

      new CampoBusca("document_summary", "Ementa", 50, "", "string", null, null, null),
      new CampoBusca("document_type", "Tipo", 50, "", "string", null, null, null),
      new CampoBusca("document_number", "Número", 50, "", "string", null, null, null),
    ];

    this.configSearch = aux;
    this.syncInit = true;
  }

  openForm(info: any = {}, newRercord: Boolean) {
    let text;     
    text = (newRercord) ? "Novo Documento" : "Editar Documento: " + info.document_id;    
    
    let dialogRef: MatDialogRef<any> = this.dialog.open(DocumentsFormComponent, {
      width: '900px',
      disableClose: true,
      data: { title: text, payload: info, new: newRercord }
    });

    dialogRef.afterClosed()
    .subscribe(res => {      
      this.getDocuments(this.lastSearch);
      return;
    });
  }
  
  getDocuments(parameter: any) {
    this.lastSearch = parameter;

    this.crud.GetParams(parameter, "/document").subscribe(res => {
      this.rows = [];
      this.rows = res.body;
    })
  }

  ngOnInit() {
    this.currentUser = this.auth.getUser();
    this.prepareScreen();
  }
  
  getAuditRequirementscopes() {
    return this.crud.GetParams(undefined, "/documentscope").toPromise().then(res => res.body);
  }
  
}
