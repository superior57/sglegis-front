import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { GradeComponent } from 'app/components/common/grade/grade.component';
import { roles } from 'app/models/auth/roles';
import { CampoBusca } from 'app/models/base/negocio/CampoBusca';
import { dialog } from 'app/models/size/size';
import { AuthGuard } from 'app/services/auth/auth.guard';
import { AppLoaderService } from 'app/services/dialogs/app-loader/app-loader.service';
import { CRUDService } from 'app/services/negocio/CRUDService/CRUDService';
import { EventEmitter } from 'events';
import * as moment from 'moment';
import { DocumentsFormComponent } from '../documents/documents-form/documents-form.component';
import { ActionPlanFormComponent } from './action-plan-form/action-plan-form.component';
import { AttachmentsDownloadComponent } from './attachments-download/attachments-download.component';
import { AuditFormComponent } from './audits-form/audits-form.component';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css']
})
export class RequirementsComponent implements OnInit {
  lastSearch: any;
  rows = [];
  groups = [];
  configSearch: any = [];

  columns = [
    { Propriedade: 'customer_business_name', Titulo: 'Matriz', Visivel: true, Largura:100 },
    { Propriedade: 'customer_unit_name', Titulo: 'Unidade', Visivel: true, Largura:100 },
    { Propriedade: 'area_name', Titulo: 'Sis.Gestão', Visivel: true, Largura:100 },
    { Propriedade: 'area_aspect_name', Titulo: 'Aspecto', Visivel: true, Largura:150 },
    { Propriedade: 'document_scope_description', Titulo: 'Âmbito', Visivel: true, Largura:100 },
    { Propriedade: 'document_name', Titulo: 'Documento', Visivel: true, Largura: 200 },
    // { Propriedade: 'document_attachment', Titulo: 'Anexo', Visivel: true, Largura: 100 },
    // { Propriedade: 'document_date_status', Titulo: 'Data/Status', Visivel: true, Largura:200},    
    { Propriedade: 'document_date_formated', Titulo: 'Data', Visivel: true, Largura: 100 },
    { Propriedade: 'status_description', Titulo: 'Status', Visivel: true, Largura:150 },
    { Propriedade: 'document_item_number', Titulo: 'Número', Visivel: true, Largura:100 },
    { Propriedade: 'audit_practical_order_description', Titulo: 'Ordem Prática', Visivel: true, Largura: 100 },
    { Propriedade: 'audit_conformity_description', Titulo: 'Conformidade', Visivel: true, Largura: 100 },
    { Propriedade: 'audit_evidnece_compliance', Titulo: 'Evidência', Visivel: true, Largura: 300 },
    { Propriedade: 'audit_control_action', Titulo: 'Controle', Visivel: true, Largura: 300 },
    { Propriedade: 'unit_aspect_responsible_name', Titulo: 'Responsável', Visivel: true, Largura: 100 },
    { Propriedade: 'audit_date', Titulo: 'Avaliação', Visivel: true, Largura: 100 },
    
  ]

  currentUser: any;
  roles = roles;
  selectedRows = [];
  syncInit = false;
  conforms = []
  pratics = []

  constructor(
    private crud: CRUDService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private auth: AuthGuard,
  ) { }

  prepareScreen() {
    this.loadConformity();
    this.loadPraticalOrder();
    this.setConfigSearch();
    //this.getAuditRequirements(undefined);
  }

  onFilterValueChange(type: string, value: any) {
    if (type === 'customer_group_id') {
      this.getCustomers(value);      
    }
    if (type === 'customer_id') {
      this.getUnits(value);      
    }
    if (type === 'area_id') {
      this.getAspects(value);      
    }
  }

  async setConfigSearch() {    

    let groups = await this.getGroups();
    let scopes = await this.getAuditRequirementscopes();
    let areas = await this.getAreas();
    let praticalorder = await this.pratics;
    let conformity = await this.conforms;

    let aux = [      
      new CampoBusca("customer_group_id", "Grupo", 50, "", "LIST", groups, "customer_group_name", "customer_group_id"),
      new CampoBusca("customer_id", "Matriz", 50, "", "LIST", [], "customer_business_name", "customer_id"),
      new CampoBusca("customer_unit_id", "Unidade", 50, "", "LIST", [], "customer_unit_name", "customer_unit_id"),
      new CampoBusca("area_id", "Sist.Gestão", 50, "", "LIST", areas, "area_name", "area_id"),
      new CampoBusca("area_aspect_id", "Aspecto", 50, "", "LIST", [], "area_aspect_name", "area_aspect_id"),
      new CampoBusca("document_scope_id", "Âmbito", 50, "", "LIST", scopes, "document_scope_description", "document_scope_id"),
      new CampoBusca("document_type", "Documento", 50, "", "string", null, null, null),
      new CampoBusca("document_number", "Número", 50, "", "string", null, null, null),
      new CampoBusca("audit_conformity_id", "Conformidade", 50, "", "LIST", conformity, "audit_conformity_desc", "audit_conformity_id"),
      new CampoBusca("audit_practical_order_id", "Ordem Prática", 50, "", "LIST", praticalorder, "audit_practical_order_desc", "audit_practical_order_id"),
    ];

    if (this.currentUser.role !== roles.admin) {
      aux[0].disabled = true; //group
      aux[1].fieldValue = this.currentUser.customer_id; 
    }

    this.configSearch = aux;
    this.syncInit = true;
  }


  openForm(info: any = {}) {   
    let dialogRef: MatDialogRef<any> = this.dialog.open(AuditFormComponent, {
      width: '900px',
      disableClose: true,
      data: {
        payload: this.selectedRows,
        user: this.currentUser
      }
    });

    dialogRef.afterClosed().subscribe(res => {             
      this.getAuditRequirements(this.lastSearch);
      this.selectedRows = [];      
      return;
    });
  }

  getAuditRequirements(parameter: any) {
    if (this.currentUser.role !== roles.admin) {
      parameter = {
        customer_id: this.currentUser.customer_id
      }
    }
    this.lastSearch = parameter;
    this.crud.GetParams(parameter, `/requirements`).subscribe(res => {
      this.rows = [];
      const newArr = res.body;
      newArr.forEach(newRow => {
        if (!this.rows.find(r => r.item_area_aspect_id === newRow.item_area_aspect_id && r.customer_unit_id === newRow.customer_unit_id)) {

          let date = moment(newRow.document_date);

          let audit_date = newRow.audit_updated_at;
          if (audit_date)
            audit_date = moment(newRow.audit_updated_at).format('DD/MM/yyyy');
          else
            audit_date = null;

          this.rows.push({
            ...newRow,
            // document_date_status: `${date.format('DD/MM/yyyy')} - ${newRow.status_description}`,
            document_date_formated: date.format('DD/MM/yyyy'),
            document_name: `${newRow.document_type} - ${(newRow.document_number) ? newRow.document_number : "S/No"}`,
            audit_practical_order_description: this.getPraticName(newRow.audit_practical_order_id),
            audit_conformity_description: this.getConformityName(newRow.audit_conformity_id),
            audit_date: audit_date,
          });
        }
      });
    });
  }


  
  handleActionPlan(registro: any) {     
    let dialogRef: MatDialogRef<any> = this.dialog.open(ActionPlanFormComponent, {
      width: dialog.medium,
      disableClose: true,
      data: { title: "", payload: { 
        ...registro,
        unit_id: registro.customer_unit_id,
        item_area_aspect_id: registro.item_area_aspect_id,
        user_id: this.currentUser.id,
      }, new: true }
    });
    
    dialogRef.afterClosed().subscribe(res => {
      
    })
  }

  handleAttachmentDownload(registro: any) {     
    let dialogRef: MatDialogRef<any> = this.dialog.open(AttachmentsDownloadComponent, {
      width: dialog.medium,
      disableClose: false,
      data: { title: "Arquivos anexo", payload: { 
        ...registro,
        unit_id: registro.customer_unit_id,
        item_area_aspect_id: registro.item_area_aspect_id,
        user_id: this.currentUser.id,
      }, new: true }
    });
    
    dialogRef.afterClosed().subscribe(res => {
      
    })
  }
  
  handleCheck(rowIndex: any, status: boolean) {    
    if (status) {
      this.selectedRows = [...this.selectedRows, {
        ...this.rows[rowIndex],
        rowIndex
      }];
    } else {
      this.selectedRows = this.selectedRows.filter(r => r.rowIndex !== rowIndex);
    }    
  }
  
  ngOnInit() {
    this.currentUser = this.auth.getUser();
    this.prepareScreen();
  }
  
  getAuditRequirementscopes() {
    return this.crud.GetParams(undefined, "/documentscope").toPromise().then(res => res.body);
  }
  
//#region GROUP CUSTOMER UNIT

  getGroups() {
    return this.crud.GetParams({ "orderby": "customer_group_name", "direction": "asc" }, "/customergroup").toPromise().then(res => res.body);
  }
  getCustomers(group_id) {        
    if (group_id) {
      let p: any = new Object();
      p.orderby = "customer_business_name";
      p.direction = "asc";
      p.fields = "customer_group_id";
      p.ops = "eq";
      p.values = group_id;
      this.crud.GetParams(p, "/customer/query").subscribe(res => {
        let customers = res.body;
        this.configSearch[1].lista = customers;        
        this.syncInit = true;
      });
    } else {
      let p: any = new Object();
      p.orderby = "customer_business_name";
      p.direction = "asc";
      p.field = "customer_group_id"
      
      this.crud.GetParams(p, "/customer").subscribe(res => {
        let customers = res.body;
        this.configSearch[1].lista = customers;        
        this.syncInit = true;
      });
    }
  }
  getUnits(customer_id) {
    if (customer_id) {
      let p: any = new Object();
      p.orderby = "customer_unit_name";
      p.direction = "asc";
      p.fields = "customer_id";
      p.ops = "eq";
      p.values = customer_id;
      this.crud.GetParams(p, "/customerunit/query").subscribe(res => {
        let units = res.body;
        this.configSearch[2].lista = units;        
        this.syncInit = true;
      });
    } else {
      let p: any = new Object();
      p.orderby = "customer_unit_name";
      p.direction = "asc";
      p.field = "customer_id"
      
      this.crud.GetParams(p, "/customerunit").subscribe(res => {
        let units = res.body;
        this.configSearch[2].lista = units;        
        this.syncInit = true;
      });
    }
  }
//#endregion
  
  getAreas() {
    return this.crud.GetParams({ "orderby": "area_name", "direction": "asc" }, "/area").toPromise().then(res => res.body);
  }
  getAspects(area_id) {
    return this.crud.GetParams({ "orderby": "area_aspect_name", "direction": "asc", "fields": "area_id", "ops": "eq", "values": area_id }, "/areaaspect/query")
      .subscribe(res => {
        let aspects = res.body;
        this.configSearch[4].lista = aspects;
        this.syncInit = true;
    })
}

getAttachments(document_id){
  return [{'document_src': 'teste'},{'document_src': 'teste2'} ]
  }

  getPraticName(id) {
    let p = this.pratics.find(p => p.audit_practical_order_id === id);
    if (p)
      return p.audit_practical_order_desc;
  }

  getConformityName(id) {
    let c = this.conforms.find(c => c.audit_conformity_id === id);
    if (c)
      return c.audit_conformity_desc;
  }

  async loadPraticalOrder() {
    this.pratics = await this.crud.GetParams(undefined, "/praticalorder").toPromise().then(res => res.body);
  }

  async loadConformity() {
    this.conforms = await this.crud.GetParams(undefined, "/conformity").toPromise().then(res => res.body);
  }
}
